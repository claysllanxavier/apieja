angular.module('apieja').controller('VideoController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {
  $scope.idconteudo = window.idconteudo

  var urlVideosbyConteudo = $resource('/api/conteudo/videos/' + $scope.idconteudo)
  var urlVideo = $resource('/api/video/:id')
  var urlVideos = $resource('/api/videos/')
  var urlDeleteVideo = $resource('/api/conteudo/:idconteudo/video/:idvideo')

  $scope.init = function () {
    buscaVideos()
  }

  $scope.videos = []

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
          urlDeleteVideo.delete({idconteudo: $scope.idconteudo, idvideo: id},
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
    if (angular.isObject(video) && !angular.isUndefined(video.nome) && !angular.isUndefined(video.url)) {
      $scope.video = new urlVideo()
      $scope.video.data = video
      $scope.video.$save({id: $scope.idconteudo})
      .then(function () {
        sweetAlert('Sucesso!', 'O vídeo foi salvo com sucesso!', 'success')
        buscaVideos()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    } else {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    }
  }

  function atualizaVideo (video) {
    if (angular.isObject(video) && !angular.isUndefined(video.nome) && !angular.isUndefined(video.url)) {
      $scope.video = new urlVideo()
      $scope.video.data = video
      $scope.video.$save({id: $scope.idconteudo})
      .then(function () {
        sweetAlert('Sucesso!', 'O vídeo foi atualizado com sucesso!', 'success')
        buscaConteudos()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    } else {
      sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
    }
  }

  $scope.init()
})
