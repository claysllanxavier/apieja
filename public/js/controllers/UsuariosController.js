angular.module('apieja').controller('UsuariosController',
function($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {

  var urlUsuarios = $resource('/api/usuarios');

  $scope.init = function() {
    buscaUsuarios();
  };
  $scope.usuarios = [];

  function buscaUsuarios() {
    urlUsuarios.query(
      function(usuarios) {
        $scope.usuarios = usuarios;
      },
      function(erro) {
        sweetAlert("Oops...", "Não foi possível obter a lista de Usuários!", "error");
        console.log(erro);
      }
    );
  }

  $scope.init();
});
