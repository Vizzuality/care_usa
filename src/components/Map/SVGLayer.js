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
    from:    (filters, timelineDate, layer) => filters && filters.from ? `date >= '${moment.utc(filters.from).format('MM-DD-YYYY')}'::date` : `date >= '${moment.utc(layer.domain[0], 'YYYY-MM-DD').format('MM-DD-YYYY')}'::date`,
    to:      (filters, timelineDate) => `date <= '${moment.utc(timelineDate || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  }
};

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
    while(value > this.options.geo_cartocss[index].limit) index++;
    return {
      fillColor: this.options.geo_cartocss[index].color,
      fillOpacity:this.options.geo_cartocss[index].opacity
    };
  }

  _getGeoQuery() {
    let sql = this.options.geo_query;

    /* TODO: adapt depending on the zoom level */
    let tolerance = .5;
    if(this.options.state.zoom >= 5) tolerance = .3;
    if(this.options.state.zoom >= 8) tolerance = .1;

    return sql.replace('$TOLERANCE', tolerance.toString())
      .replace('$EAST', this.options.state.bounds.getEast())
      .replace('$NORTH', this.options.state.bounds.getNorth())
      .replace('$WEST', this.options.state.bounds.getWest())
      .replace('$SOUTH', this.options.state.bounds.getSouth());
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
        if(filters || timelineDate) {
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

}

export default CreateTileLayer;
