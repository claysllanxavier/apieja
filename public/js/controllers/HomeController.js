angular.module('apieja').controller('HomeController',
  function ($scope, $resource, Quantidade, AuthService) {
    $scope.init = function () {
      getAll()
    }

    function getAll() {
      Quantidade.get(
        function (quantidade) {
          $scope.quantidade = quantidade
        },
        function (erro) {
          sweetAlert('Oops...', 'Não foi possível obter a lista de Quantidade!', 'error')
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
