/*
 * Leaflet Layer Mixin
 *
 * Handles lifecycle transitions for layers that need to talk to leaflet.
 */
 'use strict';


var LReactMapLayerMixin = {

  componentDidMount: function() {
    this.addLayerToMap(this.props);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (!objectEq(prevProps, this.props)) {
      this.addLayerToMap(this.props);
    }
  },

  componentWillUnmount: function() {
    var map;
    try {
      map = this.props.getMap();
    } catch (e) {
      console.warn('could not get map to remove layer');
      return;
    }
    if (this.layer) {
      map.removeLayer(this.layer);
    } // else {} ... is there something we need to handle here???
  },
};

/**
 * SHALLOW compare of two objects by key
 */
function objectEq(prev, next) {
  var prevKeys = Object.keys(prev || {}),
      nextKeys = Object.keys(next || {});

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return nextKeys.every(function(key) {
    return prev[key] === next[key];
  });
}



module.exports = LReactMapLayerMixin;
