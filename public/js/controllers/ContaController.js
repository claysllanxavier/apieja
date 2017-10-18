angular.module('apieja').controller('ContaController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {
  var url = $resource('/api/minhaconta')
  var pass = $resource('/api/minhaconta/senha')

  $scope.init = function () {
    buscar()
  }
  $scope.admin = ''

  $scope.edit = function () {
    salva($scope.admin)
  }

  $scope.changePass = function () {
    delete $scope.admin.confSenha
    $scope.send = new pass()
    $scope.send.data = $scope.admin
    $scope.send.$save()
    .then(function () {
      sweetAlert('Sucesso!', 'Senha alterada!', 'success')
      buscar()
    })
    .catch(function (erro) {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    })
  }

  function salva (data) {
    if (angular.isObject(data) && !angular.isUndefined(data.nome) && !angular.isUndefined(data.email)) {
      $scope.send = new url()
      $scope.send.data = data
      $scope.send.$save()
      .then(function () {
        sweetAlert('Sucesso!', 'Informações editadas com sucesso!', 'success')
        buscar()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    } else {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    }
  }

  function buscar () {
    url.get(
      function (data) {
        $scope.admin = data
      },
      function (erro) {
        sweetAlert('Oops...', 'Não foi possível obter sua informação!', 'error')
        console.log(erro)
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
