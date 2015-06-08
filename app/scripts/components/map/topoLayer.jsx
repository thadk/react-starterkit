/*
 * Topojson layer for boundaries
 */

'use strict';

var React = require('react/addons');
var topojson = require('topojson');
var LReactMapLayerMixin = require('./_LReactMapLayer');


function topoToGeo(topoData, options) {
  var geo = L.geoJson(null, options);
  for (var i in topoData.objects) {
    var ft = topojson.feature(topoData, topoData.objects[i]);
    geo.addData(ft.features || ft);
  }
  return geo;
}


module.exports = React.createClass({

  mixins: [LReactMapLayerMixin],

  // TODO: add required component props

  addLayerToMap: function(props) {
    // remove any existing layer so we can render fresh
    if (this.props.getMap().hasLayer(this.layer)) {
      this.props.getMap().removeLayer(this.layer);
    }

    var options = {};  // options for L.geoJson

    if (props.style) {
      options.style = props.style;
    }

    var eachFeatureTasks = [];

    // optionally do something on marker double-click (like navigate to a page)
    if (props.dblclick) {
      eachFeatureTasks.push(function(feature, layer) {
        layer.on('dblclick', function(e) {
          // pass in a ref to the feature, since that's probably the most useful
          props.dblclick(feature, layer, e);
        }.bind(this));
      }.bind(this));
    }

    options.onEachFeature = function(feature, layer) {
      eachFeatureTasks.forEach(function(task) {
        task(feature, layer);
      }.bind(this))
    }

    this.layer = topoToGeo(props.topojson, options);
    this.props.getMap().addLayer(this.layer);
  },

  render: function() {
    // no DOM-y stuff to show (unless popups are implemented later?)
    return <div className="hidden"></div>;
  }

});
