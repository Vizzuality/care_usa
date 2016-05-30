'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

class LayersCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/layers`;
  }

  parse(data) {
    const donorsLayer = _.findWhere(data, { slug: 'number-of-donors' });

    donorsLayer.layer_type = 'svg';
    donorsLayer.geo_query = 'SELECT iso, CASE WHEN ST_Intersects(the_geom, ST_SetSRID(st_makebox2d(ST_MakePoint($EAST, $NORTH), ST_MakePoint($WEST, $SOUTH)), 4326)) THEN ST_RemoveRepeatedPoints(the_geom, $TOLERANCE) END AS the_geom FROM borders';
    donorsLayer.sql_template = 'SELECT count(country_iso) AS total, country_iso AS iso FROM donors $WHERE GROUP BY country_iso';
    donorsLayer.geo_cartocss = [
      {
        limit: 50,
        color: '#A6DBEC',
        opacity: 1
      },
      {
        limit: 250,
        color: '#63B2CB',
        opacity: 1
      },
      {
        limit: 1500,
        color: '#1C88AC',
        opacity: 1
      },
      {
        limit: 3000,
        color: '#0D5B74',
        opacity: 1
      },
      {
        limit: Infinity,
        color: '#022D3B',
        opacity: 1
      }
    ];
    donorsLayer.timeline.speed = 10;

    return data;
  }

  /* Within the category "mode", set the layer "slug" as active and all the
   * other inactive */
  setActiveLayer(mode, slug) {
    let specs = this.toJSON();
    specs.filter(layer => layer.category === mode)
      .forEach(layer => layer.active = layer.slug === slug);
    this.set(specs);
    this.trigger('change');
  }

  /* Return the active layer for the current mode, if exists */
  getActiveLayer(mode) {
    return this.findWhere({
      active: true,
      category: mode
    });
  }

  /* Return a range formed by the minimum date contained into the domain
   * property of the layers and the maximum one */
  getDataDomain() {
    return this.toJSON()
      .map(layer => layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate()))
      .reduce((res, domain) => {
        if(+res[0] > +domain[0]) res[0] = domain[0];
        if(+res[1] < +domain[1]) res[1] = domain[1];
        return res;
      }, [Infinity, -Infinity]);
  }

}

export default new LayersCollection();
