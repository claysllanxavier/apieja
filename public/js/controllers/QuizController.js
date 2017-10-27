angular.module('apieja').controller('QuizController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter, Quiz, $routeParams) {

  $scope.idconteudo = $routeParams.id;

  $scope.init = function () {
    getAll()
  }

  $scope.delete = function (id) {
    sweetAlert({
      title: 'Você deseja realmente deletar esse item?',
      text: 'Você não poderá recupear essa pergunta posteriormente.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Sim, eu quero deletar!',
      cancelButtonText: 'Não, cancelar por favor!',
      closeOnConfirm: false,
      closeOnCancel: false },
      function (isConfirm) {
        if (isConfirm) {
          Quiz.delete({idconteudo: $scope.idconteudo, idpergunta: id},
            getAll,
            function (erro) {
              sweetAlert('Oops...', 'Não foi possível remover o vídeo.', 'error')
              console.log(erro)
            }
          )
          SweetAlert.swal('Delteado!', 'Esse item foi deletado.', 'success')
        } else {
          SweetAlert.swal('Cancelado', 'Esse item esta salvo :)', 'error')
        }
      })
    }

    $scope.edit = function (id, ev) {
      var pergunta = $filter('filter')($scope.perguntas.perguntas, { _id: id }, true)[0]
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modals/modalQuiz.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          data: pergunta,
          title: 'Editar'
        },
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function (answer) {
        atualizaPergunta(answer)
      })
    }

    $scope.add = function (ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modals/modalQuiz.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          data: [],
          title: 'Adicionar'
        },
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function (answer) {
        answer.respostas = _.values(answer.respostas)
        salvaPergunta(answer)
      })
    }

    function getAll () {
      Quiz.get({idconteudo: $scope.idconteudo},
        function (perguntas) {
          $scope.perguntas = perguntas
        },
        function (erro) {
          sweetAlert('Oops...', 'Não foi possível obter a lista de Perguntas!', 'error')
        }
      )
    }

    function DialogController ($scope, $mdDialog, title, data) {
      $scope.title = title
      if (data.length !== 0) {
        $scope.data = data
      }
      $scope.hide = function () {
        $mdDialog.hide()
      }

      $scope.cancel = function () {
        $mdDialog.cancel()
      }

      $scope.add = function (answer) {
        $mdDialog.hide(answer)
      }
    }

    function salvaPergunta (pergunta) {
      $scope.pergunta = new Quiz()
      $scope.pergunta.data = pergunta
      $scope.pergunta.$save({idconteudo: $scope.idconteudo})
      .then(function () {
        sweetAlert('Sucesso!', 'A pergunta foi salva com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    function atualizaPergunta (pergunta) {
      $scope.pergunta = new Quiz()
      $scope.pergunta.data = pergunta
      $scope.pergunta.$update({idconteudo: $scope.idconteudo, idpergunta: pergunta._id})
      .then(function () {
        sweetAlert('Sucesso!', 'A pergunta foi atualizada com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    $scope.init()
  })
  .factory('Quiz', function ($resource) {
    return $resource('/api/conteudo/:idconteudo/pergunta/:idpergunta', { idconteudo: '@_idconteudo', idpergunta : '@_idpergunta' },
    {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    })
  })
