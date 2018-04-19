var app = angular.module('apieja', ['ngRoute', 'ngResource', 'ngStorage', 'ngMaterial', 'mdDataTable', 'countTo', 'ngMessages']), dados;

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
})
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        activetab: 'home',
        authorize: true,
        title: 'Inicio'
      })

      .when('/conteudo', {
        templateUrl: 'views/conteudo.html',
        controller: 'ConteudosController',
        activetab: 'conteudo',
        authorize: true,
        title: 'Conteúdos'
      })

      .when('/usuario', {
        templateUrl: 'views/usuario.html',
        controller: 'UsuariosController',
        activetab: 'usuario',
        authorize: true,
        title: 'Usuários'
      })

      .when('/video', {
        templateUrl: 'views/video.html',
        controller: 'VideoController',
        activetab: 'conteudo',
        authorize: true,
        title: 'Vídeos'
      })

      .when('/quiz', {
        templateUrl: 'views/quiz.html',
        controller: 'QuizController',
        activetab: 'conteudo',
        authorize: true,
        title: 'Quiz'
      })

      .when('/minhaconta', {
        templateUrl: 'views/minhaconta.html',
        controller: 'ContaController',
        activetab: 'conta',
        authorize: true,
        title: 'Minha Conta'
      })

      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController',
        activetab: 'admin',
        authorize: true,
        title: 'Professores'

      })

      .when('/videos/:id', {
        templateUrl: 'views/video.html',
        controller: 'VideoController',
        activetab: 'conteudo',
        authorize: true,
        title: 'Vídeos'
      })

      .when('/quiz/:id', {
        templateUrl: 'views/quiz.html',
        controller: 'QuizController',
        activetab: 'conteudo',
        authorize: true,
        title: 'Quiz'
      })

      .when('/logout', {
        template: '',
        controller: 'logoutController'
      })


      .otherwise({ redirectTo: '/', activetab: 'home' });

    $locationProvider.html5Mode(true);

  })
  .run(function ($rootScope, $route, AuthService) {
    $rootScope.$route = $route;
    $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
      $rootScope.title = $route.current.title;
    });
    AuthService.setToken(dados.token)
  })
  .run(function ($rootScope, $location, AuthService, $window) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.authorize) {
        if (!AuthService.getToken()) {
          $rootScope.$evalAsync(function () {
            $window.location = '/login'
          })
        }
      }
    })
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

        function logout() {
          delete $localStorage.token
          $window.localStorage.clear();
          $window.location = '/logout';
        }
      }])
angular.element(document).ready(function () {
  $.get('/api/get/token')
    .then(function (data) {
      dados = data;
      angular.bootstrap(document, ['apieja']);
    });
});