angular.module('apieja').controller('AdminController',
function ($scope, $resource, $mdToast, $mdDialog, $filter, Admin) {
  $scope.init = function () {
    getAll()
  }

  $scope.add = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/modals/modalAdmins.html',
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
    if (data.senha === data.confirmarSenha) {
      delete data.confirmarSenha
      $scope.send = new Admin()
      $scope.send.data = data
      $scope.send.$save()
      .then(function () {
        swal('Sucesso!', 'O administrador foi salvo com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    } else {
      swal('Oops...', 'Senhas não conferem. Refaça a operação!', 'error')
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


  function getAll () {
    Admin.query(
      function (data) {
        $scope.data = data
      },
      function (erro) {
        swal('Oops...', 'Não foi possível obter a lista de Administradores!', 'error')
      }
    )
  }

  $scope.init()
})
.factory('Admin', function ($resource) {
  return $resource('/api/admin/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  })
})
