/*
 * Hot-patch leaflet around its bugs
 *
 * Map freeze bug
 * https://github.com/Leaflet/Leaflet/pull/3270
 * hotpatch based on that pull:
 * https://github.com/Leaflet/Leaflet/pull/3270/files
 */

'use strict';

var assign = require('object-assign');
var L = window.L;  // explicitly bring into scope to not be evil


var zoomAnimated = L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.mobileOpera;


if (zoomAnimated) {
  L.Map.addInitHook(function () {
    // don't animate on browsers without hardware-accelerated transitions or old Android/Opera
    this._zoomAnimated = this.options.zoomAnimation;

    // zoom transitions run with the same duration for all layers, so if one of transitionend events
    // happens after starting zoom animation (propagating to the map pane), we know that it ended globally
    if (this._zoomAnimated) {

      this._createAnimProxy();

      L.DomEvent.on(this._proxy, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
    }
  });
}


L.Map.include(!zoomAnimated ? {} : {
  _createAnimProxy: function () {
    var proxy = this._proxy = L.DomUtil.create('div', 'leaflet-proxy leaflet-zoom-animated');
    this._panes.mapPane.appendChild(proxy);

    this.on('zoomanim', function (e) {
      var prop = L.DomUtil.TRANSFORM,
        transform = proxy.style[prop];

      L.DomUtil.setTransform(proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

      // workaround for case when transform is the same and so transitionend event is not fired
      if (transform === proxy.style[prop] && this._animatingZoom) {
        this._onZoomTransitionEnd();
      }
    }, this);

    this.on('load moveend', function () {
      var c = this.getCenter(),
        z = this.getZoom(),
        p = this.project(c, z),
        zs = this.getZoomScale(z, 1);
      L.DomUtil.setTransform(proxy, p, zs);
    }, this);
  },
});


assign(L.DomUtil, {
  setTransform: function (el, offset, scale) {
    var pos = offset || new L.Point(0, 0);

    el.style[L.DomUtil.TRANSFORM] =
      'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
  }
});
