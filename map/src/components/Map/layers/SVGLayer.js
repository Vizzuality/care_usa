'use strict';

import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import '../../../scripts/helpers/LTopoJSON';
import PopupManager from '../../PopUp/PopupManager';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

/* Optional statements for the query */
const optionalStatements = {
  donations: {
    from: (filters, timelineDate) => `date >= '${moment.utc(timelineDate || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    to: (filters, timelineDate, layer) => `date < '${timelineDate ? moment.utc(timelineDate).add(7, 'days').format('MM-DD-YYYY') : moment.utc(filters && filters.to ? filters.to.add(7, 'days') : layer.domain[1].add(7, 'days')).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
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

export default class SVGLayer {

  constructor(options, state) {
    this.options = Object.assign(defaults, options);
    this.options.geo_cartocss = JSON.parse(this.options.geo_cartocss);
    this.options.state = state;
    this.timestamp = +(new Date());
  }

  /**
   * Return the query used to fetch the layer
   * @return {String} SQL query
   */
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
   * Init the layer and return a deferred Object
   * @return {Object} jQuery deferred object
   */
  initLayer() {
    const deferred = $.Deferred();
    const query = this._getQuery();
    const geoQuery = this._getGeoQuery();

    $.ajax({
      dataType: 'json',
      url: `https://${this.options.cartodbAccount}.carto.com/api/v2/sql`,
      data: {
        q: geoQuery,
        format: 'topojson'
      }
    }).done(topoJSON => {
      this.layer = new L.TopoJSON({
        topoJSON,
        update: this.updateGeometry.bind(this),
        defaultFillColor: this._getDefaultGeoColor()
      });

      this.fetchData();

      deferred.resolve(this.layer);
    }).fail(deferred.reject);

    return deferred;
  }

  /**
   * Fetch the data associated with the geometries
   */
  fetchData() {
    $.ajax({
      url: `https://${this.options.cartodbAccount}.carto.com/api/v2/sql`,
      dataType: 'json',
      data: {
        q: this._getQuery()
      }
    }).done(data => {
      this.comparisonColumn = this._getComparisonColumn(Object.keys(data.fields));
      this.layer.setData(data.rows)
    });
  }

  /**
   * Update the color of each geometry depending on the data
   * @param  {Object} geo  geometry
   * @param  {Object} data data
   */
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
   * Return the default color of the geometries when created. It uses the first
   * color of the cartocss (supposedly the lightest) in order to provide a
   * smooth animation to the color.
   * @return {String} CSS color
   */
  _getDefaultGeoColor() {
    return this.options.geo_cartocss[0].color;
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

  /**
   * Return true if the layer should be reloaded due to new params
   * @param  {Object} oldState old state of the map and the application
   * @param  {Object} state    new state
   * @return {Boolean}         true if should be reloaded, false otherwise
   */
  shouldLayerReload(oldState, state) {
    const firstToleranceLimit = toleranceConfig[0].limit;

    /* The only case when we don't want the layer to be reloaded is if the zoom
     * level stays below the first limit as the tolerance is really high and we
     * already have loaded the geometries for the whole world */
    return !(oldState.zoom < firstToleranceLimit &&
      state.zoom < firstToleranceLimit);
  }

  onMapClick(map, [lat, lng], zoom, date, slug) {
    this.closePopup();
    this.popup = new PopupManager(map, lat, lng, zoom, date, slug);
  }

  /**
   * Close the popup
   */
  closePopup() {
    if(this.popup) this.popup.close();
  }

  /**
   * Update the layer according to new state
   */
  updateLayer(state) {
    this.closePopup();
    this.options.state = state;
    this.fetchData();
  }

}
