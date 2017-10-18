angular.module('apieja').controller('AdminController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {
  var urlAdmins = $resource('/api/admin')

  $scope.init = function () {
    buscaAdmins()
  }
  $scope.admins = []

  $scope.add = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/modalAdmins.html',
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
      salva(answer)
    })
  }

  function salva (data) {
    if (angular.isObject(data) && !angular.isUndefined(data.nome) && !angular.isUndefined(data.email) && !angular.isUndefined(data.senha) && !angular.isUndefined(data.confirmarSenha)) {
      if (data.senha === data.confirmarSenha) {
        delete data.confirmarSenha
        $scope.send = new urlAdmins()
        $scope.send.data = data
        $scope.send.$save()
        .then(function () {
          sweetAlert('Sucesso!', 'O administrador foi salvo com sucesso!', 'success')
          buscaAdmins()
        })
        .catch(function (erro) {
          sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
        })
      } else {
        sweetAlert('Oops...', 'Senhas não conferem. Refaça a operação!', 'error')
      }
    } else {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    }
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

  function buscaAdmins () {
    urlAdmins.query(
      function (data) {
        $scope.admins = data
      },
      function (erro) {
        sweetAlert('Oops...', 'Não foi possível obter a lista de Administradores!', 'error')
        console.log(erro)
      }
    )
  }

  $scope.init()
})
