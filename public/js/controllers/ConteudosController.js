angular.module('apieja').controller('ConteudosController',
  function ($scope, $mdToast, $mdDialog, $filter, Conteudo) {
    $scope.init = function () {
      getAll()
    }

    $scope.delete = function (id) {
      swal({
        title: 'Você deseja realmente deletar esse item?',
        text: 'Você não poderá recupear esse item posteriormente.',
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: ['Não, cancelar por favor!', 'Sim, eu quero deletar!']
      })
        .then((willDelete) => {
          if (willDelete) {
            Conteudo.delete({ id: id },
              getAll,
              function (erro) {
                swal('Oops...', 'Não foi possível remover o item.', 'error')
              }
            )
            swal('Delteado!', 'Esse item foi deletado.', 'success')
          } else {
            swal('Cancelado', 'Esse item esta salvo :)', 'error')
          }
        })
        .catch(erro => {
          swal('Oops...', 'Não foi possível remover o video.', 'error')
        })
    }

    $scope.edit = function (id, ev) {
      var item = $filter('filter')($scope.data, { _id: id }, true)[0]
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modals/modalConteudos.html',
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
        templateUrl: 'views/modals/modalConteudos.html',
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


    function getAll() {
      Conteudo.query(
        function (data) {
          $scope.data = data
        },
        function (erro) {
          swal('Oops...', 'Não foi possível obter a lista de Conteúdos!', 'error')
        })
    }

    function DialogController($scope, $mdDialog, title, data) {
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

    function save(data) {
      $scope.send = new Conteudo()
      $scope.send.data = data
      $scope.send.$save()
        .then(function () {
          swal('Sucesso!', 'O conteúdo foi salvo com sucesso!', 'success')
          getAll()
        })
        .catch(function (erro) {
          swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
        })
    }

    function update(data) {
      $scope.send = new Conteudo()
      $scope.send.data = data
      $scope.send.$update({ id: data._id })
        .then(function () {
          swal('Sucesso!', 'O conteúdo foi atualizado com sucesso!', 'success')
          getAll()
        })
        .catch(function (erro) {
          swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
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
