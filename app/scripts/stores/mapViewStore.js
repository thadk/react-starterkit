'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MapActions = require('../actions/mapViewActions');


module.exports = Reflux.createStore({

  listenables: MapActions,

  init: function() {
    this._intlBounds = [
      [-20.0665597, 39.985976355423105],
      [48.1606518, 202.68718509200005]
    ];
    this.data = {
      bounds: this._intlBounds,
    };
  },

  onSetInternationalBounds: function(intlBounds) {
    this._intlBounds = intlBounds;
    MapActions.resetBounds();
  },

  onResetBounds: function() {
    MapActions.changeBounds(this._intlBounds);
  },

  onChangeBounds: function(newBounds) {
    this.update({ bounds: newBounds });
  },

  onChangeBoundsUser: function(newBounds) {
    this.update({ bounds: newBounds });
  },

  update: function(assignable, options) {
    this.data = assign(this.data, assignable);
    this.emit();
  },

  emit: function() {
    this.trigger(this.data);
  },

  getInitialState: function() {
    return this.data;
  }

});
