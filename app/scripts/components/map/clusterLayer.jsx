/*
 * Layer for point clusters from geojson files
 */

'use strict';

var assign = require('object-assign');
var DGSet = require('../../util').DGSet;
var objectEq = require('../../util').objectEq;
var pick = require('../../util').pick;
var L = window.L;  // explicitly bring into scope to not be evil
var LReactMapLayerMixin = require('./_LReactMapLayer');
var LPin = require('./_LPin.jsx');
var sidePopup = require('./leaflet.sidepopup');
var React = require('react/addons');


function _existsIn(from) {
  return function(key) {
    return typeof from[key] !== 'undefined';
  }
}

function _transform(transforms, from) {
  return function(transformed, option) {
    transformed[option] = transforms[option](from[option]);
    return transformed;
  }
}

/**
 * @param transformMap - a map of functions that may apply transformations
 * @param options
 * @returns a new object, containing only those properties from @param options
 *  that have transforms in `transformMap`, with those transforms applied.
 */
function transformOptions(transformMap, options) {
  // return a new object, containing only those properties from `options1
  return Object.keys(transformMap)
    .filter(_existsIn(options))
    .reduce(_transform(transformMap, options), {});
}

/**
 * A pass-through transform
 */
function identity(what) {
  return what;
}


function summarizeMarkers(markers) {
  var features = markers.map(function(marker) {
    return marker.feature;
  });
  return {features: features};
}


/**
 * ClusterLayer for Leaflet
 *
 * @example
 *     ...
 *     render() {
 *       return (
 *         <ClusterLayer
 *           getMap={this.props.getMap}
 *           zoomToBoundsOnClick={false}
 *           spiderifyOnMaxZoom={false}
 *           maxClusterRadius={50}
 *           iconCreateFunction={this.clusterIcon} />
 *       );
 *     },
 *     ...
 */
var ClusterLayer = React.createClass({

  mixins: [
    LReactMapLayerMixin,
    LPin.mixin,
  ],

  componentWillMount: function() {
    this.clusterPropTransforms = {
      showCoverageOnHover:         identity,
      zoomToBoundsOnClick:         identity,
      spiderfyOnMaxZoom:          identity,
      removeOutsideVisibleBounds:  identity,
      animateAddingMarkers:        identity,
      disableClusteringAtZoom:     identity,
      maxClusterRadius:            identity,
      polygonOptions:              identity,
      singleMarkerMode:            identity,
      spiderfyDistanceMultiplier: identity,
      chunkedLoading:              identity,
      chunkInterval:               identity,
      chunkDelay:                  identity,
      chunkProgress:               identity,
      iconCreateFunction:          this._iconCreateWrap,
    };
    // special post-clusterLayer-construct props handling for clusters
    this.clusterExtraOptionMap = {
      clusterPopupFunction:     this._iconPopupWrap,
      clusterMouseoverFunction: this._iconMouseoverWrap,
      clusterMouseoutFunction:  this._iconMouseoutWrap,
      clusterDblclick:          this._iconDblclick,
    };
    // for diffing markers going on/off map
    this.idsOnMap = new DGSet();
  },

  addLayerToMap: function() {

    // reuse the clusterLayer if its options haven't changed.
    var clusterProps = pick(Object.keys(this.clusterPropTransforms), this.props);
    if (!objectEq(clusterProps, this._currentClusterProps)) {  // WARNING: misses this.clusterExtraOptionMap changes. hmm...
      this._currentClusterProps = clusterProps;

      if (this.props.getMap().hasLayer(this.layer)) {
        this.props.getMap().removeLayer(this.layer);
      }

      var clusterOpts = transformOptions(this.clusterPropTransforms, clusterProps);
      this.layer = L.markerClusterGroup(clusterOpts);
      this.props.getMap().addLayer(this.layer);

      transformOptions(this.clusterExtraOptionMap, this.props);
    }

    var pinProps = pick(LPin.props, this.props);
    if (!objectEq(pinProps, this._currentPinProps)) {
      // reset all the pins if the pinProps have changed
      this._currentPinProps = pinProps;
      this.layer.clearLayers();
      this.markerMap = {};

      // save new pin options if pins have changed
      this.pinOptions = this.getPinOptions(this.props);
    }

    this.updateMarkers();
  },

  updateMarkers: function() {

    var nextIds = new DGSet(this.props.layerData.map(function(location) {
      return location.id;
    }));

    // in with the new
    var idsToAdd = nextIds.difference(this.idsOnMap);

    var newMarkers = L.geoJson(this.props.layerData
      .filter(function(location) {
        return idsToAdd.has(location.id);
      }), this.pinOptions)
      .getLayers();

    newMarkers.forEach(function(marker) {
      this.idsOnMap.add(marker.feature.id);
    }, this);

    this.layer.addLayers(newMarkers);

    // out with the old
    var idsToRemove = this.idsOnMap.difference(nextIds);

    var markersToRemove = this.layer.getLayers()
      .filter(function(layer) {
        return idsToRemove.has(layer.feature.id);
      });

    markersToRemove.forEach(function(marker) {
      this.idsOnMap.remove(marker.feature.id)
    }, this);

    this.layer.removeLayers(markersToRemove);
  },

  _iconCreateWrap: function(fn) {
    var this_ = this;
    return function(cluster) {
      return fn(cluster, this_);
    };
  },

  _iconPopupWrap: function(fn) {
    this.layer.on('clusterclick', function(what) {
      var padding = this.props.getPopupPadding ? this.props.getPopupPadding() : {};
      var clusterData = summarizeMarkers(what.layer.getAllChildMarkers());
      clusterData.event = what;
      var popup = sidePopup({
        maxWidth: this.props.popupMaxWidth || 385,
        autoPanPaddingTopLeft: padding.topLeft,
        autoPanPaddingBottomRight: padding.bottomRight,
      });
      what.layer.bindPopup(popup);
      this.renderPopup(popup, clusterData, fn);
      what.layer.openPopup();
      this.fixReactIds(popup);
      this.fixReactEvents(popup);
      this._addPopupOpenClass(what);

      // stupid hack because Leaflet.markercluster hates popups
      // we can't hook into any event on the icon for popupclose, so we listen
      // globally on the map, because the next one *should* be ours.
      // fingers crossed...
      this.props.getMap().once('popupclose', function() {
        this._rmPopupOpenClass(what);
      }.bind(this));

    }.bind(this));
  },

  _iconMouseoverWrap: function(fn) {
    this.layer.on('clustermouseover', fn);
  },

  _iconMouseoutWrap: function(fn) {
    this.layer.on('clustermouseout', fn);
  },

  _iconDblclick: function(fn) {
    this.layer.on('clusterdblclick', fn);
  },

  // render() comes from _LPin.mixin

});


module.exports = ClusterLayer;
