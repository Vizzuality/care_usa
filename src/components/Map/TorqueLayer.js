'use strict';

import $ from 'jquery';

const optionalStatements = {
  donations: {
    from:    (filters, timeline) => `date > '${moment(filters && filters.from || timeline.from).format('MM-DD-YYYY')}'::date`,
    to:      (filters, timeline) => `date < '${moment(filters && filters.to || timeline.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries like '%${filters.region}%'` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors in (${filters.sectors.map(sector => `'${sector}'`).join(', ')})` : ''
  }
};

/**
 * doc: http://docs.cartodb.com/cartodb-platform/torque/torquejs-getting-started/
 */
class TorqueLayer {

  constructor(options, state) {
    this.options = options;
    this.state = state;
    this.timestamp = new Date().getTime();
  }

  createLayer() {
    const deferred = new $.Deferred();

    // Creating torque layer
    this.layer = new L.TorqueLayer({
      user: config.cartodbAccount,
      table: this.options.tablename || 'donors',
      sql: this.getQuery(),
      cartocss: this.getCartoCSS()
    });

    this.layer.error((err) => {
      console.error(err);
    });

    deferred.resolve(this.layer);

    return deferred.promise();
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

  /**
   * Remove layer from map
   * @param  {L.Map} map
   */
  removeLayer(map) {
    if (map && this.layer) {
      map.removeLayer(this.layer);
    }
  }

  getQuery() {
    return `
      SELECT *,
        (CASE WHEN "amount" < 100 THEN 1
          WHEN "amount" BETWEEN 100 AND 500  THEN 2
          WHEN "amount" BETWEEN 501 AND 1000 THEN 3
          WHEN "amount" > 1000 THEN 4 END) as torque_category
      FROM donors
    `;
    // const filters = this.options.state.filters;
    // const timeline = this.options.state.timelineDates;
    // const statements = optionalStatements[this.options.category]
    // return this.options.sql_template.replace('$WHERE', () => {
    //   if(filters || timeline) {
    //     const res = Object.keys(statements).map(name => {
    //       const filter = filters[name];
    //         if(Array.isArray(filter) && filter.length ||
    //           !Array.isArray(filter) && filter || timeline) {
    //           return statements[name](filters, timeline);
    //         }
    //         return null;
    //       }).filter(statement => !!statement)
    //         .join(' AND ');
    //
    //     if(res.length) {
    //       return (this.options.category === 'donations' ? 'WHERE ' : 'AND ') + res;
    //     }
    //   }
    //   return '';
    // });
  }

  getCartoCSS() {
    return `
      Map {
        -torque-frame-count:256;
        -torque-animation-duration:30;
        -torque-time-attribute:"date";
        -torque-aggregation-function:"CDB_Math_Mode(torque_category)";
        -torque-resolution:2;
        -torque-data-aggregation:linear;
      }
      ​
      #donors {
        marker-fill-opacity: 0.7;
        marker-line-color: #FFF;
        marker-line-width: 1;
        marker-line-opacity: 1;
        marker-width: 2.5;
        marker-fill: rgb(193,230,226);
        marker-allow-overlap: true;
        marker-comp-op: darken;
        [zoom=2]{marker-width: 2;}
        [zoom=3]{marker-width: 3;}
        [zoom=4]{marker-width: 5;}
        [zoom=5]{marker-width: 7;}
        [zoom=6]{marker-width: 8.5;}
        [zoom=7]{marker-width: 10;}
        [zoom=8]{marker-width: 13;}
        [zoom>8]{marker-width: 13;}
      }
      #care_donors_v02 [ amount = 4] {
        marker-fill: rgb(34,50,58);
        marker-line-color: #182B31;
      }
      #care_donors_v02 [ amount = 3] {
        marker-fill: rgb(91,135,153);
        marker-line-color: #4F8593;
      }
      #care_donors_v02 [ amount = 2] {
        marker-fill: rgb(143,188,196);
        marker-line-color: #88B8BD;
      }
      #care_donors_v02 [ amount = 1] {
        marker-fill: rgb(223,253,251);
        marker-line-color: #BCEEEA ;
      }
      #donors[frame-offset=1] {
        marker-width:8;
        marker-fill-opacity:0.45;
      }
      #donors[frame-offset=2] {
        marker-width:10;
        marker-fill-opacity:0.225;
      }
    `;
  }

}

export default TorqueLayer;
