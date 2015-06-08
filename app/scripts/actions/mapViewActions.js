'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MetaActions = require('../actions/pageMetaActions');
var getRouter = require('../routes.js');

var actions = Reflux.createActions({
  setInternationalBounds: {},
  changeBounds: {children: ['user']},
  resetBounds: {},
  changeBasemap: {},  // Only for country view
  refreshFromURL: {},
  changeThematic: {},
});


actions.changeBasemap.listen(function(basemapId) {
  var query = getRouter().getCurrentQuery();
  MetaActions.transitionTo('country', {}, assign({}, query, {bm: basemapId}));
});


module.exports = actions;
