
    // if (this.props.tiles && this.props.esriTiles) {
    //   console.error('`tiles` or `esriTiles` props may be set on <Map>, not both');
    // }
    // if (this.props.tiles) {
    //   L.tileLayer(this.props.tiles).addTo(this.map);
    // }
    // if (this.props.esriTiles) {
    //   L.esri.basemapLayer(this.props.esriTiles).addTo(this.map);
    // }

/*
 * Geojson layer for points
 */

'use strict';

var L = window.L;  // explicitly bring into scope to not be evil
var LReactMapLayerMixin = require('./_LReactMapLayer');
var LPin = require('./_LPin.jsx');
var React = require('react/addons');

var EsriTileLayer = React.createClass({

  mixins: [
    LReactMapLayerMixin,
    LPin.mixin,
  ],

  addLayerToMap: function(props) {
    // remove any existing layer so we can render fresh
    if (this.props.getMap().hasLayer(this.layer)) {
      this.props.getMap().removeLayer(this.layer);
    }

    if (this.props.thematicLayers) {
      this.layer = new L.esri.DynamicMapLayer(this.props.thematicLayers.url, {opacity: 0.5, maxZoom: 12});
      //TODO: handle multiple or rename?
      this.props.getMap().addLayer(this.layer);
    }
  },

  // render() comes from _LPin.mixin

});


module.exports = EsriTileLayer;
