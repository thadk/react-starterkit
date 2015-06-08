'use strict';

var assign = require('object-assign');
var L = window.L;


L.SidePopup = L.Popup.extend({
  initialize: function(options, source) {
    options = assign({
      minWidth: 300,
      closeButton: false,
    }, options);
    return L.Popup.prototype.initialize.call(this, options, source);
  },

  _updatePosition: function() {
    if (!this._map) { return; }
    L.Popup.prototype._updatePosition.apply(this);

    var rightOffset = 18,
        topOffset = 25;

    // this._adjustPan ensures the popup opens on-screen using these:
    this._containerBottom = -this._container.scrollHeight + topOffset;
    this._containerLeft = -this._containerWidth - rightOffset;

    // position from the top-right instead of centred on the bottom
    this._container.style.bottom = '';
    this._container.style.left = '';
    this._container.style.top = -topOffset + 'px';
    this._container.style.right = rightOffset + 'px';
  },
});

L.sidePopup = function(options, source) {
  return new L.SidePopup(options, source);
};


module.exports = L.sidePopup;
