angular.module('apieja').controller('VideoController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter, Video) {
  var urlVideosbyConteudo = $resource('/api/conteudo/videos/' + 1)
  var urlVideo = $resource('/api/video/:idconteudo')

  $scope.init = function () {
    buscaVideos()
  }

  $scope.delete = function (id) {
    sweetAlert({
      title: 'Você deseja realmente deletar esse item?',
      text: 'Você não poderá recupear esse vídeo posteriormente.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Sim, eu quero deletar!',
      cancelButtonText: 'Não, cancelar por favor!',
      closeOnConfirm: false,
      closeOnCancel: false },
      function (isConfirm) {
        if (isConfirm) {
          Video.delete({idconteudo: 1, idvideo: id},
            buscaVideos,
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
      var video = $filter('filter')($scope.videos.videos, { _id: id }, true)[0]
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/modalVideos.html',
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
        templateUrl: '/views/modalVideos.html',
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

    function buscaVideos () {
      urlVideosbyConteudo.get(
        function (videos) {
          $scope.videos = videos
        },
        function (erro) {
          console.log('Não foi possível obter a lista dos videos')
          console.log(erro)
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
      $scope.video = new urlVideo()
      $scope.video.data = video
      $scope.video.$save({idconteudo: 1})
      .then(function () {
        sweetAlert('Sucesso!', 'O vídeo foi salvo com sucesso!', 'success')
        buscaVideos()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    function atualizaVideo (video) {
      $scope.video = new Video()
      $scope.video.data = video
      $scope.video.$update({idconteudo: 1, idvideo: video._id})
      .then(function () {
        sweetAlert('Sucesso!', 'O vídeo foi atualizado com sucesso!', 'success')
        buscaVideos()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
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
