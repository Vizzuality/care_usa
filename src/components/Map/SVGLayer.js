'use strict';

import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import '../../scripts/helpers/LTopoJSON';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

const optionalStatements = {
  donations: {
    from:    (filters, timelineDate, layer) => `date >= '${timelineDate ? moment.utc(timelineDate).subtract(7, 'days').format('MM-DD-YYYY') : moment.utc(filters && filters.from ? filters.from : layer.domain[0]).format('MM-DD-YYYY')}'::date`,
    to:      (filters, timelineDate) => `date <= '${moment.utc(timelineDate || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  }
};

/* The tolerance is the precision of the geometries. The smaller it is, the
 * better precision they will have.
 * This array contains the tolerance we should ask for depending on the zoom
 * level of the map. We use it to reduce the footprint on smaller zoom levels
 * as the precision is not a critical factor.
 * Example:
 * 	{ limit: 5,  value: .5 } means that until a zoom of 5 (excluded) the
 * 	tolerance will have a value of .5

 * NOTE: the last limit has the value of -1, as its tolerance will always be
 * used if the zoom level is superior or equal to the previous limit */
const toleranceConfig = [
  { limit: 5,  value: .5 },
  { limit: 8,  value: .3 },
  { limit: -1, value: .1 },
];

class CreateTileLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options, state) {
    this.options = Object.assign(defaults, options);
    this.options.geo_cartocss = JSON.parse(this.options.geo_cartocss);
    this.options.state = state;
    this.timestamp = +(new Date());
  }

  createLayer() {
    const deferred = $.Deferred();

    $.ajax({
      url: `https://${defaults.cartodbAccount}.cartodb.com/api/v2/sql`,
      dataType: 'json',
      data: {
        q: this._getGeoQuery(),
        format: 'topojson',
      }
    }).done(topoJSON => {
      this.layer = new L.TopoJSON({
        topoJSON,
        update: this.updateGeometry.bind(this)
      });

      this.fetchData();

      deferred.resolve(this.layer);
    }).fail(deferred.reject);

    return deferred;
  }

  fetchData() {
    $.ajax({
      url: `https://${defaults.cartodbAccount}.cartodb.com/api/v2/sql`,
      dataType: 'json',
      data: {
        q: this._getQuery()
      }
    }).done(data => {
      this.comparisonColumn = this._getComparisonColumn(Object.keys(data.fields));
      this.layer.setData(data.rows)
    });
  }

  /* Called by this.layer to update the color of each geometry depending on the
   * data */
  updateGeometry(geo, data) {
    const geometryData = _.findWhere(data, { iso: geo.feature.properties.iso });

    /* If we don't have data, we hide the geometry */
    if(!geometryData) {
      geo.setStyle({ fillOpacity: 0 });
      return;
    }

    geo.setStyle(this._getGeoAppearance(geometryData[this.comparisonColumn]));
  }

  _getComparisonColumn(columns) {
    if(columns.length === 2) {
      return columns[0] === 'iso' ? columns[1] : columns[0];
    } else {
      throw new Error('The sql_template query should return only two columns');
    }
  }

  _getGeoAppearance(value) {
    let index = 0;
    while(index < this.options.geo_cartocss.length - 1 &&
      value > this.options.geo_cartocss[index].limit) index++;
    return {
      fillColor: this.options.geo_cartocss[index].color,
      fillOpacity:this.options.geo_cartocss[index].opacity
    };
  }

  /**
   * Return the tolerance depending on the zoom level and based on the
   * toleranceConfig object
   * @param  {Number} zoom current zoom level of the map
   * @return {Number}
   */
  _getTolerance(zoom) {
    let index = 0;
    while(index < toleranceConfig.length - 1 &&
      zoom >= toleranceConfig[index].limit) index++;
    return toleranceConfig[index].value;
  }

  _getGeoQuery() {
    let sql = this.options.geo_query;
    const zoom = this.options.state.zoom;

    let bounds = {
      east:  this.options.state.bounds.getEast(),
      north: this.options.state.bounds.getNorth(),
      west:  this.options.state.bounds.getWest(),
      south: this.options.state.bounds.getSouth()
    };

    /* If the zoom is lower than firstToleranceLimit, we ask for the geometries
     * for the whole world because the tolerance is pretty high and the response
     * will still have a reasonable size */
    const firstToleranceLimit = toleranceConfig[0].limit;
    if(zoom < firstToleranceLimit) {
      bounds = {
        east:  220.4296875,
        north: 85.98213689652798,
        west:  -228.1640625,
        south: -83.71554430601263
      };
    }

    return sql.replace('$TOLERANCE', this._getTolerance(zoom).toString())
      .replace('$EAST',  bounds.east)
      .replace('$NORTH', bounds.north)
      .replace('$WEST',  bounds.west)
      .replace('$SOUTH', bounds.south);
  }

  _getQuery() {
    const filters = this.options.state.filters;
    const timelineDate = this.options.state.timelineDate;
    const layer = this.options.state.layer;
    const statements = optionalStatements[this.options.category];
    const templateWhere = _.indexOf(this.options.sql_template.split(' '), '$WHERE') >= 0 ? true : false;
    const templateYear = _.indexOf(this.options.sql_template.split(' '), '$YEAR') >= 0 ? true : false;
    if (templateWhere) {
      return this.options.sql_template.replace(/\$WHERE/g, () => {
        const res = Object.keys(statements).map(name => {
          const filter = filters[name];
            if(Array.isArray(filter) && filter.length ||
              !Array.isArray(filter) && filter || timelineDate) {
              return statements[name](filters, timelineDate, layer);
            }
            return null;
          }).filter(statement => !!statement)
            .join(' AND ');

        if(res.length) {
          return (this.options.category === 'donations' ? 'WHERE ' : 'AND ') + res;
        }
        return '';
      });
    }

    if(templateYear) {
      return this.options.sql_template.replace(/\s\$YEAR/g, () => {
        if(timelineDate || filters && filters['to']) {
          return ` WHERE ${statements['to'](filters, timelineDate)}`;
        }
        return '';
      });
    }
  }

  /**
   * Add layer to map
   * @param  {L.Map} map
   * @param {Function} callback
   */
  addLayer(map) {
    if (!map) {
      throw new Error('map param is required');
    }
    map.addLayer(this.layer);
  }

  removeLayer(map) {
    if (this.layer) {
      map.removeLayer(this.layer);
    }
  }

  /**
   * Return whether the layer should be reloaded depending on the new zoom level
   * compared to the old one. When the map is panned, the zoom doesn't change so
   * both previousZoom and zoom should have the same value.
   * @param  {Number}   previousZoom zoom before the zooming or panning
   * @param  {Number}   zoom         zoom after the action
   * @return {Boolean}               true if should be reloaded, false otherwise
   */
  shouldLayerReload(previousZoom, zoom) {
    const firstToleranceLimit = toleranceConfig[0].limit;

    /* The only case when we don't want the layer to be reloaded is if the zoom
     * level stays below the first limit as the tolerance is really high and we
     * already have loaded the geometries for the whole world */
    return !(previousZoom < firstToleranceLimit &&
      zoom < firstToleranceLimit);
  }

}

export default CreateTileLayer;
