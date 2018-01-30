angular.module('apieja').controller('VideoController',
function ($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter, Video, $routeParams, Admin) {

  $scope.idconteudo = $routeParams.id;

  $scope.init = function () {
    getAll()
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
          Video.delete({idconteudo: $scope.idconteudo, idvideo: id},
            getAll,
            function (erro) {
              sweetAlert('Oops...', 'Não foi possível remover o vídeo.', 'error')
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
                    sweetAlert('Oops...', 'Não foi possível obter essas informações!', 'error')
                  })
    }

    function getAll () {
      Video.get({idconteudo: $scope.idconteudo},
        function (videos) {
          $scope.videos = videos
        },
        function (erro) {
          sweetAlert('Oops...', 'Não foi possível obter esse item.', 'error')
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
        sweetAlert('Sucesso!', 'O vídeo foi salvo com sucesso!', 'success')
        getAll()
      })
      .catch(function (erro) {
        sweetAlert('Oops...', 'Alguma coisa está errada. Refaça a operação!', 'error')
      })
    }

    function atualizaVideo (video) {
      $scope.video = new Video()
      $scope.video.data = video
      $scope.video.$update({idconteudo: $scope.idconteudo, idvideo: video._id})
      .then(function () {
        sweetAlert('Sucesso!', 'O vídeo foi atualizado com sucesso!', 'success')
        getAll()
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
