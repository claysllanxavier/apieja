angular.module('apieja').controller('VideoController',
function ($scope, $resource, $mdToast, $mdDialog, $filter, Video, $routeParams, Admin) {

  $scope.idconteudo = $routeParams.id;

  $scope.init = function () {
    getAll()
  }

  $scope.delete = function (id) {
    swal({
      title: 'Você deseja realmente deletar esse item?',
      text: 'Você não poderá recupear esse video posteriormente.',
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: ['Não, cancelar por favor!', 'Sim, eu quero deletar!']
    })
      .then((willDelete) => {
        if (willDelete) {
          Video.delete({ idconteudo: $scope.idconteudo, idvideo: id },
            getAll,
            function (erro) {
              swal('Oops...', 'Não foi possível remover o video.', 'error')
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
      var video = $filter('filter')($scope.videos, { _id: id }, true)[0]
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modals/modalVideos.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          data: video,
          title: 'Editar'
        },
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function (answer) {
        atualizaVideo(answer)
      })
    }

    $scope.add = function (ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/views/modals/modalVideos.html',
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
        salvaVideo(answer)
      })
    }

    $scope.loadPessoas = function () {
      Admin.query(
                  function (data) {
                    $scope.admins = data
                  },
                  function (erro) {
                    swal('Oops...', 'Não foi possível obter essas informações!', 'error')
                  })
    }

    function getAll () {
      Video.query({idconteudo: $scope.idconteudo},
        function (videos) {
          $scope.videos = videos
        },
        function (erro) {
          swal('Oops...', 'Não foi possível obter esse item.', 'error')
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

    function salvaVideo (video) {
      $scope.video = new Video()
      $scope.video.data = video
      $scope.video.$save({idconteudo: $scope.idconteudo})
      .then(function () {
        swal('Sucesso!', 'O vídeo foi salvo com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    function atualizaVideo (video) {
      $scope.video = new Video()
      $scope.video.data = video
      $scope.video.$update({idconteudo: $scope.idconteudo, idvideo: video._id})
      .then(function () {
        swal('Sucesso!', 'O vídeo foi atualizado com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        swal('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    $scope.init()
  })
  .factory('Video', function ($resource) {
    return $resource('/api/conteudo/:idconteudo/video/:idvideo', { idconteudo: '@_idconteudo', idvideo : '@_idvideo' },
    {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    })
  })
