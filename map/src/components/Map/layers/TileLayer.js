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
    const templateWhere = _.indexOf(this.options.sql_template.split(' '), '$WHERE') >= 0;
    const templateYear = _.indexOf(this.options.sql_template.split(' '), '$YEAR') >= 0;
    const templateSector = _.indexOf(this.options.sql_template.split(' '), '$SECTOR') >= 0;
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

    if(templateSector) {
      return this.options.sql_template.replace(/\s\$SECTOR/g, () => {
        return `data.total`; // Ready to filter by sector in stories
      });
    }
    return this.options.sql_template;
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
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: `https://${this.options.cartodbAccount}.carto.com/api/v1/map?stat_tag=API&config=${encodeURIComponent(JSON.stringify(requestBody))}`
    }).done(data => {
      const tileUrl = `${data.cdn_url.templates.https.url}/${this.options.cartodbAccount}/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`;
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
    // we need to redirect to the stories country page
    // if (slug === 'stories') {
    //   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    //   $.getJSON(url)
    //     .then(function(data) {
    //       const countryCode = (data.address && data.address.country_code) ? data.address.country_code.toUpperCase() : '';
    //       const isoCode = countryCodes[countryCode];
    //       if (isoCode) {
    //         window.location = `/stories?country=${isoCode}`;
    //       }
    //     })
    // } else {
    // }
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
