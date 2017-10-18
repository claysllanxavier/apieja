angular.module('apieja').controller('HomeController',
function ($scope, $resource) {
  var urlQuantidade = $resource('/api/quantidade')

  $scope.init = function () {
    buscaQuantidade()
  }
  $scope.quantidade = ''

  function buscaQuantidade () {
    urlQuantidade.get(
      function (quantidade) {
        $scope.quantidade = quantidade
      },
      function (erro) {
        sweetAlert('Oops...', 'Não foi possível obter a lista de Quantidade!', 'error')
        console.log(erro)
      }
    )
  }

  $scope.init()
})
