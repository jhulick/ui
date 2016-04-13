(function(window, document, undefined){
  'use strict';

  // Init myApp
  var myApp = angular.module('myApp', ['max-ui']);

  myApp.run(function($log) {

    $log.log('I\'m a line from myApp');

  });

})(window, document);
