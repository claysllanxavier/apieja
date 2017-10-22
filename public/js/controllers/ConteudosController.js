angular.module('apieja').controller('ConteudosController', function ($scope, $mdToast, $mdDialog, SweetAlert, $filter, Conteudo) {
  $scope.init = function () {
    getAll()
  }

  $scope.delete = function (id) {
    sweetAlert({
      title: 'Você deseja realmente deletar esse item?',
      text: 'Você não poderá recupear esse conteúdo posteriormente.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Sim, eu quero deletar!',
      cancelButtonText: 'Não, cancelar por favor!',
      closeOnConfirm: false,
      closeOnCancel: false },
      function (isConfirm) {
        if (isConfirm) {
          Conteudo.delete({id: id},
            getAll,
            function (erro) {
              sweetAlert('Oops...', 'Não foi possível remover o conteúdo.', 'error')
            })
          SweetAlert.swal('Delteado!', 'Esse item foi deletado.', 'success')
        } else {
          SweetAlert.swal('Cancelado', 'Esse item esta salvo :)', 'error')
        }
      })
  }

  $scope.edit = function (id, ev) {
    var item = $filter('filter')($scope.data, { _id: id }, true)[0]
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/modalConteudos.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        data: item,
        title: 'Editar'
      },
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
        .then(function (answer) {
          update(answer)
        })
  }

  $scope.add = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/modalConteudos.html',
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
          save(answer)
        })
  }

  function getAll () {
    Conteudo.query(
          function (data) {
            $scope.data = data
          },
          function (erro) {
            sweetAlert('Oops...', 'Não foi possível obter a lista de Conteúdos!', 'error')
            console.log(erro)
          })
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

  function save (data) {
    $scope.send = new Conteudo()
    $scope.send.data = data
    $scope.send.$save()
          .then(function () {
            sweetAlert('Sucesso!', 'O conteúdo foi salvo com sucesso!', 'success')
            getAll()
          })
          .catch(function (erro) {
            sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
          })
  }

  function update (data) {
    $scope.send = new Conteudo()
    $scope.send.data = data
    $scope.send.$update({id: data._id})
          .then(function () {
            sweetAlert('Sucesso!', 'O conteúdo foi atualizado com sucesso!', 'success')
            getAll()
          })
          .catch(function (erro) {
            sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
          })
  }

  $scope.init()
})
      .factory('Conteudo', function ($resource) {
        return $resource('/api/conteudo/:id', { id: '@_id' }, {
          update: {
            method: 'PUT' // this method issues a PUT request
          }
        })
      })
