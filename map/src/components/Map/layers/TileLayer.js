'use strict';

import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import PopupManager from '../../PopUp/PopupManager';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

/* Optional statements for the query */
const optionalStatements = {
  donations: {
    from:    (filters, timelineDate, layer) => filters && filters.from ? `date >= '${moment.utc(filters.from).format('MM-DD-YYYY')}'::date` : `date >= '${moment.utc(layer.domain[0], 'YYYY-MM-DD').format('MM-DD-YYYY')}'::date`,
    to:      (filters, timelineDate) => `date <= '${moment.utc(timelineDate || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  },
  projects: {
    to:      (filters, timelineDate) => `year='${moment.utc(timelineDate || filters && filters.to).format('YYYY')}'`,
    region:  filters => filters && filters.region ? `iso in (${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)})` : '',
    sectors: filters => filters && filters.sectors.length ? `(${filters.sectors.map(sector => `${sector}_people<>0`).join(' OR ')})` : ''
  }
};

export default class TileLayer {

  constructor(options, state) {
    this.options = Object.assign(defaults, options);
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
      return this.options.sql_template.replace(/\s\$WHERE/g, () => {
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
   * Init the layer and return a deferred Object
   * @return {Object} jQuery deferred object
   */
  initLayer() {
    const deferred = $.Deferred();
    const query = this._getQuery();

    const requestBody = {
      layers: [{
        'user_name': this.options.cartodbAccount,
        'type': 'cartodb',
        'options': {
          'sql': query,
          'cartocss': this.options.geo_cartocss,
          'cartocss_version': '2.3.0'
        }
      }]
    };

    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: `https://${this.options.cartodbAccount}.carto.com/api/v1/map/`,
      data: JSON.stringify(requestBody)
    }).done(data => {
      const tileUrl = `https://${this.options.cartodbAccount}.carto.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png32`;
      this.layer = L.tileLayer(tileUrl, { noWrap: true });
      deferred.resolve(this.layer);
    }).fail(deferred.reject);

    return deferred;
  }

  /**
   * Return true if the layer should be reloaded due to new params
   * @param  {Object} oldState old state of the map and the application
   * @param  {Object} state    new state
   * @return {Boolean}         true if should be reloaded, false otherwise
   */
  shouldLayerReload(oldState, state) {
    return oldState.filters.timestamp !== state.filters.timestamp ||
      oldState.timelineDate !== state.timelineDate ||
      oldState.mode !== state.mode;
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
   * Update the layer according to new params
   */
  updateLayer() {
    /* This layer is always reloaded */
    return;
  }

}
