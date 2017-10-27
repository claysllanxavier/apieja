angular.module('apieja', ['ngRoute', 'ngResource', 'ngStorage', 'ngMaterial', 'mdDataTable', 'oitozero.ngSweetAlert', 'countTo', 'ngMessages'])
.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('deep-orange')
})
.config(function($routeProvider, $locationProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'views/home.html',
    controller  : 'HomeController',
    activetab: 'home',
    authorize: true
  })

  .when('/conteudo', {
    templateUrl : 'views/conteudo.html',
    controller  : 'ConteudosController',
    activetab: 'conteudo',
    authorize: true
  })

  .when('/usuario', {
    templateUrl : 'views/usuario.html',
    controller  : 'UsuariosController',
    activetab: 'usuario',
    authorize: true
  })

  .when('/video', {
    templateUrl : 'views/video.html',
    controller  : 'VideoController',
    activetab: 'conteudo',
    authorize: true
  })

  .when('/quiz', {
    templateUrl : 'views/quiz.html',
    controller  : 'QuizController',
    activetab: 'conteudo',
    authorize: true
  })

  .when('/minhaconta', {
    templateUrl : 'views/minhaconta.html',
    controller  : 'ContaController',
    activetab: 'conta',
    authorize: true
  })

  .when('/admin', {
    templateUrl : 'views/admin.html',
    controller  : 'AdminController',
    activetab: 'admin',
    authorize: true
  })

  .when('/videos/:id', {
    templateUrl : 'views/video.html',
    controller  : 'VideoController',
    activetab: 'conteudo',
    authorize: true
  })

  .when('/quiz/:id', {
    templateUrl : 'views/quiz.html',
    controller  : 'QuizController',
    activetab: 'conteudo',
    authorize: true
  })
  
  .when('/logout', {
    template: '',
    controller: 'logoutController'
  })


  .otherwise({redirectTo: '/', activetab: 'home'});

  $locationProvider.html5Mode(true);

})
.run(function ($rootScope, $route) {
  $rootScope.$route = $route;
})
.factory('AuthService', function ($localStorage, $q) {
  return {
    getToken: function () {
      return $localStorage.token
    },
    setToken: function (token) {
      $localStorage.token = token
    },
    logout: function () {
      delete $localStorage.token
      $q.when()
    }
  }
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor')
})
.factory('AuthInterceptor', function ($location, AuthService, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {}

      if (AuthService.getToken()) {
        config.headers['x-access-token'] = AuthService.getToken()
      }

      return config
    },

    responseError: function (response) {
      return $q.reject(response)
    }
  }
})
.controller('logoutController',
['$scope', '$window', 'AuthService',
function ($scope, $window, $localStorage) {

  logout();

  function logout () {
    delete $localStorage.token
    $window.location = '/logout';
  }
}])
