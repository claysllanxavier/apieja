angular.module('apieja').controller('HomeController',
function ($scope, $resource, Quantidade, AuthService) {
  $scope.init = function () {
    getToken()
    getAll()
  }

  function getAll () {
    Quantidade.get(
      function (quantidade) {
        $scope.quantidade = quantidade
      },
      function (erro) {
        sweetAlert('Oops...', 'Não foi possível obter a lista de Quantidade!', 'error')
      })
    }

    function getToken () {
      var url = $resource('/api/home')
      url.get(
        function (data) {
          AuthService.setToken(data.token)
        },
        function (erro) {
          sweetAlert('Oops...', 'Não foi possível obter essas informações!', 'error')
        })
      }

      $scope.init()
    })
    .factory('Quantidade', function ($resource) {
      return $resource('/api/quantidade/:id', { id: '@_id' }, {
        update: {
          method: 'PUT' // this method issues a PUT request
        }
      })
    })
