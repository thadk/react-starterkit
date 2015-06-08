'use strict';

var Reflux = require('reflux');
var router = require('../routes.js');


var transitionTo = Reflux.createAction();

transitionTo.listen(function(routeNameOrPath, params, query) {
  router.get().transitionTo(routeNameOrPath, params, query);
});

module.exports = {transitionTo: transitionTo};  // just proxies to react-router
