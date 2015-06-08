/*
 * Leaflet raw map component used by ./map.jsx (use that if you want a map)
 */

'use strict';

var assign = require('object-assign');
var L = window.L;  // explicitly bring into scope to not be evil
require('./_hotfix');  // fix leaflet bugs
var React = require('react/addons');
var Reflux = require('reflux');


// L.map -> (bounds -> ()) -> (event -> ())
function getSimpleBounds(map, boundsChangeHandler) {
  return function(/* leafletEvent */) {  // don't need anything from the event
    var Lbounds = map.getBounds(),
        simpleBounds = [
          [Lbounds.getNorth(), Lbounds.getEast()],
          [Lbounds.getSouth(), Lbounds.getWest()]
        ];
    boundsChangeHandler(simpleBounds);
  };
}


module.exports = React.createClass({

  mixins: [Reflux.ListenerMixin],

  componentDidMount: function() {
    var containerNode = this.getDOMNode();

    this.map = L.map(containerNode, assign({}, this.props.normalLMapConfig, {
      zoomControl: false,  // don't put it in the top-left, we'll re-add it if it was true
    }));

    if (this.props.extraClassName) {
      containerNode.classList.add(this.props.extraClassName);
    }

    if (this.props.normalLMapConfig.zoomControl !== false) {
      // add the zoom control bottom-right
      L.control.zoom({position: 'topright'}).addTo(this.map);
    }

    // send map events back to handlers in ./map.jsx
    if (this.props.onMapMove) {
      // `moveend` seems to cover all types of moves including zooms 
      this.map.on('moveend', getSimpleBounds(this.map, this.props.onMapMove));
    }

    // leaflet requires a view of the map to show
    if (this.props.bounds) {
      this.map.fitBounds(this.props.bounds);
    } else {
      this.map.fitWorld();
    }
    if (this.props.changeBounds) {
      this.listenTo(this.props.changeBounds, function(newBounds, options) {
        this.map.fitBounds(newBounds, options);
      });
    }
  },

  componentWillUnmount: function() {
    this.map.off();  // remove all event listeners
    this.map.remove();  // clean up the rest of the map stuff
    delete this.map;  // clear our ref so the map can be garbage collected
  },

  // () -> `L.map` instance or `undefined` if the component has not mounted yet
  getLeafletMap: function() {
    return this.map;
  },

  render: function() {
    return <div className="map react-leaflet-map"></div>
  }
});
