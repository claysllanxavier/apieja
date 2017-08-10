angular.module('apieja').controller('VideoController',
function($scope, $resource, $mdToast) {
  $scope.init = function() {
    buscaConteudos();

  };
  $scope.conteudos = [];

  $scope.filtro = '';

  var urlConteudos = $resource('/api/conteudos');

  function buscaConteudos() {
    urlConteudos.query(
      function(conteudos) {
        $scope.conteudos = conteudos;
      },
      function(erro) {
        console.log("Não foi possível obter a lista dos conteudos");
        console.log(erro);
      }
    );
  }

  $scope.delete = function(id){
    console.log("delete" + id);
  };

  $scope.edit = function(id){
    console.log("edit" + id);
  };

  $scope.add = function() {
    console.log("add");
  };

  $scope.init();

});
