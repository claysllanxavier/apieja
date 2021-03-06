angular.module('apieja').controller('ContaController',
function ($scope, $resource, $mdToast, $mdDialog, $filter, Conta, Admin, $window) {
  $scope.init = function () {
    buscar()
  }

  $scope.edit = function () {
    update($scope.admin)
  }

  $scope.changePass = function () {
    delete $scope.admin.confSenha
    $scope.send = new Conta()
    $scope.send.data = $scope.admin
    $scope.send.$update()
    .then(function () {
      swal('Sucesso!', 'Senha alterada!', 'success')
      buscar()
    })
    .catch(function (erro) {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    })
  }

  function update (data) {
    $scope.send = new Admin()
    $scope.send.data = data
    $scope.send.$update({id: data._id})
    .then(function () {
      swal('Sucesso!', 'Informações editadas com sucesso!', 'success')
      $window.location.reload();
    })
    .catch(function (erro) {
      swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    })
  }

  function buscar () {
    Conta.get(
      function (data) {
        $scope.admin = data
      },
      function (erro) {
        swal('Oops...', 'Não foi possível obter sua informação!', 'error')
      }
    )
  }

  $scope.init()
})

.directive('passwordVerify', function () {
  return {
    require: 'ngModel',
    scope: {
      passwordVerify: '='
    },
    link: function (scope, element, attrs, ctrl) {
      scope.$watch(function () {
        var combined

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue
        }
        return combined
      }, function (value) {
        if (value) {
          ctrl.$parsers.unshift(function (viewValue) {
            var origin = scope.passwordVerify
            if (origin !== viewValue) {
              ctrl.$setValidity('passwordVerify', false)
              return undefined
            } else {
              ctrl.$setValidity('passwordVerify', true)
              return viewValue
            }
          })
        }
      })
    }
  }
})
.factory('Conta', function ($resource) {
  return $resource('/api/minhaconta/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  })
})
