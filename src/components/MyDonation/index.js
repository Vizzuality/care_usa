'use strict';

import $ from 'jquery';
import _ from 'underscore';
import React  from 'react';
import MapC from '../MapC';
import MyDonationDashboard from './MyDonationDashboard';
import Router from '../Router';
import GeoModel from './GeoModel';
import layersCollection from '../../scripts/collections/layersCollection';

/**
 * Router definition
 */
class DonationRouter extends Router {}
// Overriding default routes
DonationRouter.prototype.routes = {
  '': function() {
    console.info('you are on donation page');
  }
};
const router = new DonationRouter();
router.start();

class MyDonation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {layersData: []};
  }

  componentDidMount() {
    this.geo = new GeoModel();
    this.updateBBox();
    router.params.on('change', this.updateBBox.bind(this));
  }

  componentDidUpdate() {
    const bbox = [
      [this.state.bbox[1], this.state.bbox[0]],
      [this.state.bbox[3], this.state.bbox[2]]
    ];
    this.refs.MapC.mapView.map.fitBounds(bbox);
    this.refs.MapC.mapView.removeAllLayers();
    this.refs.MapC.mapView.layersSpec.reset(this.state.layersData);
    this.refs.MapC.mapView.layersSpec.instanceLayers();
    this.refs.MapC.mapView.toggleLayers();
  }

  updateBBox() {
    $.when(
      layersCollection.fetch(),
      this.geo.fetch({
        data: {q: router.params.get('city')}
      })
    ).done(() => {
      const layerModel = layersCollection.find({slug: 'amount-of-money'});
      const layersData = [{
        type: 'marker',
        position: this.geo.attributes.position,
        title: router.params.attributes.name,
        active: true
      }, {
        type: 'cartodb',
        active: layerModel.attributes.active,
        account: config.cartodbAccount,
        sql: layerModel.attributes.geo_query.replace('$WHERE', ''),
        cartocss: layerModel.attributes.geo_cartocss
      }];
      const nexState = _.extend({}, router.params.attributes, {
        bbox: this.geo.attributes.bbox,
        position: this.geo.attributes.position,
        layersData: layersData
      });
      this.setState(nexState);
    });
  }

  render() {
    return (
      <div className="l-app">
        <MapC ref="MapC"
          layersData={this.state.layersData}
          legend={false} />
        <MyDonationDashboard
          name={this.state.name}
          amount={this.state.amount} />
      </div>
    );
  }

}

export default MyDonation;
