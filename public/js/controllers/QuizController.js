angular.module('apieja').controller('QuizController',
function($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {

  var urlPerguntas = $resource('/api/perguntas');
  var urlPergunta = $resource('/api/pergunta/:id');

  $scope.init = function() {
    buscaPerguntas();
  };
  $scope.perguntas = [];

  $scope.delete = function(id){
    sweetAlert({
      title: "Você deseja realmente deletar esse item?",
      text: "Você não poderá recupear essa pergunta posteriormente.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, eu quero deletar!",
      cancelButtonText: "Não, cancelar por favor!",
      closeOnConfirm: false,
      closeOnCancel: false },
      function(isConfirm){
        if (isConfirm) {
          urlPergunta.delete({id: id},
            buscaPerguntas,
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
      var pergunta = $filter('filter')($scope.perguntas, { _id: id  }, true)[0];
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modalQuiz.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals : {
          data : pergunta,
          title : "Editar"
        },
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        atualizaPergunta(answer);
      });
    };

    $scope.add = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modalQuiz.html',
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
        answer.respostas = _.values(answer.respostas)
        salvaPergunta(answer);
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

    function salvaPergunta(pergunta){
      if(angular.isObject(pergunta) && !angular.isUndefined(pergunta.pergunta) && !angular.isUndefined(pergunta.respostaCerta) &&  angular.isObject(pergunta.respostas)){
        $scope.pergunta = new urlPerguntas();
        $scope.pergunta.data = pergunta;
        $scope.pergunta.$save()
        .then(function() {
          sweetAlert("Sucesso!", "A pergunta foi salva com sucesso!", "success");
          buscaPerguntas();
        })
        .catch(function(erro) {
          sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
        });
      }
      else{
        sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
      }
    }

    function atualizaPergunta(pergunta){
      if(angular.isObject(pergunta) && !angular.isUndefined(pergunta.pergunta) && !angular.isUndefined(pergunta.respostaCerta) &&  angular.isObject(pergunta.respostas)){
        $scope.pergunta = new urlPergunta();
        $scope.pergunta.data = pergunta;
        $scope.pergunta.$save({id: pergunta._id})
        .then(function() {
          sweetAlert("Sucesso!", "A pergunta foi atualizada com sucesso!", "success");
          buscaPerguntas();
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
