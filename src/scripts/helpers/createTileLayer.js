'use strict';

class CreateTileLayer {

  

  createLayer: function() {

    L.tileLayer('https://cartocdn-ashbu.global.ssl.fastly.net/simbiotica/api/v1/map/ad78f28b63c643a6a793885abdd63e14:1459237782618/0/{z}/{x}/{y}.png').addTo(this.map);
  }


}

export default CreateTileLayer;
