/*
 * Leaflet popup mixin
 *
 * Doing popups declaratively is a pain. Well it's all in one place here.
 */
'use strict';

var assign = require('object-assign');
var L = window.L;  // explicitly bring into scope to not be evil
var React = require('react');
var EventConstants = require('react/lib/EventConstants');
var sidePopup = require('./leaflet.sidepopup');
var Popup = require('./popup.jsx');


// Event names to listen for on popups to proxy up back to react
var reactEventNames = Object.keys(EventConstants.topLevelTypes)
  .filter(function(eventName) {
    var isTop = (eventName.slice(0, 3) === 'top');
    if (!isTop) { console.warn('React event name didn\'t start with "top"', eventName); }
    return isTop;
  })
  .map(function(topName) {  // convert eg. `topBlur` => `blur`
    return topName.slice(3).toLowerCase();
    // var lowerFirstLetter = topName.slice(3, 4).toLowerCase();  // first letter after top
    // return lowerFirstLetter + topName.slice(4);
  });


function applyToEventEl(fn, evt) {
  function doIfNotNull(icon) {
    if (icon !== null) {
      return fn(icon);
    }
  }
  if (!evt) {
    if (evt === undefined) {
      console.warn('could not find an el to call a function on', evt);
    } else {
      doIfNotNull(evt);
    }
  } else if (evt._icon !== undefined) {
    return doIfNotNull(evt._icon);
  } else if (evt.target && evt.target._icon) {
    return doIfNotNull(evt.target._icon);
  } else if (evt.layer && evt.layer._icon) {
    return doIfNotNull(evt.layer._icon);
  } else if (evt.target && evt.target._layers) {
    return Object.keys(evt.target._layers).map(function(id) {
      return doIfNotNull(evt.target._layers[id]);
    });
  } else {
    console.warn('could not find an el to call a function on', evt);
  }
}


var pinProps = [
  'pin',
  'popup',
  'getPopupPadding',
  'popupMaxWidth',
  'dblclick',
];


var mixin = {

  _addPopupOpenClass: function(e) {
    applyToEventEl(function(el) {
      L.DomUtil.addClass(el, 'popped-up');
    }, e);
  },

  _rmPopupOpenClass: function(e) {
    applyToEventEl(function(el) {
      L.DomUtil.removeClass(el, 'popped-up');
    }, e);
  },

  getPinOptions: function(props) {
    var options = {};
    var this_ = this;

    // pin callback must give a leaflet-style maker. it would be nice to wrap
    // this in a component abstraction, but I don't know how right now.
    if (props.pin) {
      options.pointToLayer = function(featureData, latLng) {
        return props.pin(featureData, latLng, this_);
      };
    }

    var eachFeatureTasks = [];

    // popup callback should return contents as a leaflet component
    if (props.popup) {
      var padding = props.getPopupPadding ? props.getPopupPadding() : {};

      eachFeatureTasks.push(function(feature, layer) {
        // It would be nice to just `layer.bindPopup(sidePopup())` here, but a
        // bug in leaflet (https://github.com/Leaflet/Leaflet/issues/2354)
        // will stop marker events from reaching the popup and make me sad.
        //
        // Work-around: L.Popup's (so also sidePopup) second parameter is
        // source. If we just put `layer` in there, the resulting redundant-
        // looking line works and all is well in the world:
        layer.bindPopup(sidePopup({
          maxWidth: props.popupMaxWidth || 385,
          autoPanPaddingTopLeft: padding.topLeft,
          autoPanPaddingBottomRight: padding.bottomRight,
        }, layer));  // <-"layer".. works via magic (comment ^^)
        layer.on('popupopen', function(e) {
          this.renderPopup(e.popup, feature, props.popup);
          this.fixReactIds(e.popup);
          this.fixReactEvents(e.popup);
          this._addPopupOpenClass(e);  // adds .popped-up
        }.bind(this));
        layer.on('popupclose', function(e) {
          this._rmPopupOpenClass(e);  // removes .popped-up
          if (props.popupClose) {
            props.popupClose(e);
          }
        }.bind(this));
      }.bind(this));
    }

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
    };

    return options;

  },

  renderPopup: function(popup, feature, popupFn) {
    // this component renders, in react terms, _as its popup_. It's hidden from
    // the normal document flow, and copied into the open L.popup's content.
    this.popupFn = popupFn;
    this.setState(feature);  // triggers a re-render
    popup.setContent(this.getDOMNode().innerHTML);
  },

  fixReactIds: function(popup) {
    var el = popup._container;
    // replace all the `data-reactid`s so react doesn't get confused.
    var allEls = el.querySelectorAll('*');
    Array.prototype.forEach.call(allEls, function(el) {
      var reactId = el.dataset.reactid;
      if (reactId !== undefined) {  // leaflet's containers, etc.
        delete el.dataset.reactid;
        el.dataset.originalreactid = reactId;
      }
    });
  },

  /**
   * Proxy all events that react listens for from our popup that react ignores,
   * to the off-screen popup content that react listens to.
   * It's awful and it works. Though it may be pretty mouse-event-focused.
   */
  fixReactEvents: function(popup) {
    var el = popup._contentNode;
    reactEventNames.forEach(function(eventName) {
      el.addEventListener(eventName, function(e) {
        var popupEl = e.target,
            reactId = e.target.dataset.originalreactid,
            reactTarget = document.querySelector('[data-reactid="' + reactId + '"]'),
            proxiedEvent;

        if (typeof window.Event === 'function') {  // IE10+
          proxiedEvent = new Event(e.type, {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            view: e.view,
            detail: e.detail,
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            button: e.button,
            relatedTarget: e.reactTarget,
          });
        } else {  // IE9
          proxiedEvent = document.createEvent('Event');
          proxiedEvent.initEvent(
            e.type,
            e.bubbles,
            e.cancelable,
            'window',  // e.view?
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX,
            e.clientY,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            e.relatedTarget
          );
        }
        reactTarget.dispatchEvent(proxiedEvent);
      });
    });
  },

  popupFn: function() {
    // this gets overridden
    return <div></div>;
  },

    render: function() {
    var something;
    try {
      something = this.popupFn(this.state);
    } catch(err) {
      something = 
        <Popup className="popup-error">
            <Popup.Header>
              <h3 className="panel-title">Error!</h3>
            </Popup.Header>
            <p className="details">
              We're sorry, the application encountered an error and is unable to display this information. 
            </p>
        </Popup>
      console.error(err);
    }
    return (
      <div className="hidden">
        {something}
      </div>
    );
  }

};


module.exports = {
  mixin: mixin,
  props: pinProps,
};
