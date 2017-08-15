angular.module('apieja').controller('QuizController',
function($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {

  var urlPerguntas = $resource('/api/perguntas');
  var urlConteudo = $resource('/api/conteudo/:id');

  $scope.init = function() {
    buscaPerguntas();
  };
  $scope.perguntas = [];

  $scope.delete = function(id){
    sweetAlert({
      title: "Você deseja realmente deletar esse item?",
      text: "Você não poderá recupear esse conteúdo e seus vídeos posteriormente.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, eu quero deletar!",
      cancelButtonText: "Não, cancelar por favor!",
      closeOnConfirm: false,
      closeOnCancel: false },
      function(isConfirm){
        if (isConfirm) {
          urlConteudo.delete({id: id},
            buscaConteudos,
            function(erro) {
              sweetAlert("Oops...", "Não foi possível remover o conteúdo.", "error");
              console.log(erro);
            }
          );
          SweetAlert.swal("Delteado!", "Esse item foi deletado.", "success");
        } else {
          SweetAlert.swal("Cancelado", "Esse item esta salvo :)", "error");
        }
      });
    };

    $scope.edit = function(id, ev){
      var conteudo = $filter('filter')($scope.conteudos, { _id: id  }, true)[0];
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modalConteudos.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals : {
          data : conteudo,
          title : "Editar"
        },
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        atualizaConteudo(answer);
      });
    };

    $scope.add = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modalConteudos.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals : {
          data : [],
          title : "Adicionar"
        },
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        salvaConteudo(answer);
      });
    };

    function buscaPerguntas() {
      urlPerguntas.query(
        function(perguntas) {
          $scope.perguntas = perguntas;
        },
        function(erro) {
          sweetAlert("Oops...", "Não foi possível obter a lista de Perguntas!", "error");
          console.log(erro);
        }
      );
    }

    function DialogController($scope, $mdDialog, title, data) {
      $scope.title = title;
      if(data.length !== 0){
        $scope.data = data;
      }
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

    function salvaConteudo(conteudo){
      if(angular.isObject(conteudo) && !angular.isUndefined(conteudo.conteudo) && !angular.isUndefined(conteudo.informacao)){
        $scope.conteudo = new urlConteudos();
        $scope.conteudo.data = conteudo;
        $scope.conteudo.$save()
        .then(function() {
          sweetAlert("Sucesso!", "O conteúdo foi salvo com sucesso!", "success");
          buscaConteudos();
        })
        .catch(function(erro) {
          sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
        });
      }
      else{
        sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
      }
    }

    function atualizaConteudo(conteudo){
      if(angular.isObject(conteudo) && !angular.isUndefined(conteudo.conteudo) && !angular.isUndefined(conteudo.informacao)){
        $scope.conteudo = new urlConteudo();
        $scope.conteudo.data = conteudo;
        $scope.conteudo.$save({id: conteudo._id})
        .then(function() {
          sweetAlert("Sucesso!", "O conteúdo foi atualizado com sucesso!", "success");
          buscaConteudos();
        })
        .catch(function(erro) {
          sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
        });
      }
      else{
        sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
      }
    }

    $scope.init();
  });
