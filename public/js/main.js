angular.module('apieja', ['ngRoute', 'ngResource', 'ngMaterial', 'mdDataTable', 'oitozero.ngSweetAlert', 'countTo', 'ngMessages'])
.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('deep-orange')
})
