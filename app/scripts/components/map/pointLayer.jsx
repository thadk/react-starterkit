/*
 * Geojson layer for points
 */

'use strict';

var L = window.L;  // explicitly bring into scope to not be evil
var LReactMapLayerMixin = require('./_LReactMapLayer');
var LPin = require('./_LPin.jsx');
var React = require('react/addons');


var PointLayer = React.createClass({

  mixins: [
    LReactMapLayerMixin,
    LPin.mixin,
  ],

  addLayerToMap: function(props) {
    // remove any existing layer so we can render fresh
    if (this.props.getMap().hasLayer(this.layer)) {
      this.props.getMap().removeLayer(this.layer);
    }

    var options = this.getPinOptions(props);

    this.layer = L.geoJson(props.geojson, options);
    this.props.getMap().addLayer(this.layer);
  },

  // render() comes from _LPin.mixin

});


module.exports = PointLayer;
