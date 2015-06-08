/*
 * Leaflet map component wrapper for React
 *
 * This component is a wrapper providing a friendly react-like API to other
 * components and connecting some pieces for the real leaflet
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var MapStore = require('../../stores/mapViewStore.js');
var MapActions = require('../../actions/mapViewActions.js');
var LeafletMap = require('./_mapLeaflet.jsx');


var leafletOptions = [  // not complete yet
  'attributionControl',
  'zoomControl',
  'scrollWheelZoom',
  'doubleClickZoom',
  'dragging',
];


var pick = function(keys, obj) {
  var out = {};
  keys.forEach(function(key) {
    if (obj[key] !== undefined) {
      out[key] = obj[key];
    }
  });
  return out;
};

module.exports = React.createClass({

  mixins: [Reflux.connect(MapStore, 'mapView')],

  updateCurrentBounds: function(newMapViewBounds) {
    // Triggered whenever the map view changes, including:
    //   - initial map render
    //   - user drags or zooms the map
    //   - programatic changes to the map view
    // This function re-triggers it as an action so the mapViewStore can keep
    // track of where we are
    // The `user` child action of changeBounds signifies that leaflet should
    // not try to fitBounds the new bounds it just went to. (loop de loop)
    MapActions.changeBounds.user(newMapViewBounds);
  },

  // () -> either `L.map` instance or `undefined`
  getMap: function() {
    // TODO: is `this.refs` undefined at the beginning of the lifecycle?
    // ... if so, this could throw, and should probably handle that.
    return this.refs.leafletMapComponent.getLeafletMap();
  },

  render: function() {
    // pass a function down to children through props to access the leaflet map
    var children = React.Children.map(this.props.children, function(child) {
      return child ? React.addons.cloneWithProps(child, {getMap: this.getMap}) : null;
    }, this);

    var normalLMapConfig = pick(leafletOptions, this.props);

    return (
      <div>
        <LeafletMap
          extraClassName={this.props.className}
          normalLMapConfig={normalLMapConfig}
          bounds={this.state.mapView.bounds}
          ref="leafletMapComponent"
          changeBounds={MapActions.changeBounds}
          onMapMove={this.updateCurrentBounds} />
        {children}
      </div>
    );
  }
});
