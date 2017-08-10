angular.module('apieja').controller('ConteudosController',
function($scope, $resource, $mdToast, $mdDialog, SweetAlert) {
  $scope.init = function() {
    buscaConteudos();

  };
  $scope.conteudos = [];

  $scope.filtro = '';

  var urlConteudos = $resource('/api/conteudos');

  $scope.delete = function(id){
    console.log("delete" + id);
  };

  $scope.edit = function(id){
    console.log("edit" + id);
  };

  $scope.add = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/modalConteudos.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      if(angular.isObject(answer) && !angular.isUndefined(answer.conteudo) && !angular.isUndefined(answer.descricao)){
      console.log(answer);
      }
      else{
      sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
      }
    });
  };


  $scope.init();


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

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.add = function(answer) {
      $mdDialog.hide(answer);
    };
  }
});
