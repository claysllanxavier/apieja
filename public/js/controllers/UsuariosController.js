angular.module('apieja').controller('UsuariosController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter, Usuario) {
  $scope.init = function () {
    getAll()
  }

  function getAll () {
    Usuario.query(
      function (usuarios) {
        $scope.usuarios = usuarios
      },
      function (erro) {
        sweetAlert('Oops...', 'Não foi possível obter a lista de Usuários!', 'error')
      }
    )
  }

  $scope.init()
})
.factory('Usuario', function ($resource) {
  return $resource('/api/usuario/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  })
})
