angular.module('apieja').controller('VideoController',
function($scope, $resource, $mdToast, $mdDialog, SweetAlert, $filter) {

  $scope.idconteudo = window.idconteudo;
  var urlVideosbyConteudo = $resource('/api/conteudo/videos/'+$scope.idconteudo);
  var urlVideo = $resource('/api/video/:id');
  var urlVideos = $resource('/api/videos/');

  $scope.init = function() {
    buscaVideos();
  };

  $scope.videos = [];

  $scope.delete = function(){
    console.log("delete");
  };

  $scope.edit = function(){
    console.log("edit");
  };

  $scope.add = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/modalVideos.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals : {
        data : [],
        title : "Adicionar"
      },
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      salvaVideo(answer);
    });
  };

  function buscaVideos() {
    urlVideosbyConteudo.get(
      function(videos) {
        $scope.videos = videos;
      },
      function(erro) {
        console.log("Não foi possível obter a lista dos videos");
        console.log(erro);
      }
    );
  }

  function DialogController($scope, $mdDialog, title, data) {
    $scope.title = title;
    if(data.length !== 0){
      $scope.data = data;
    }
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.add = function(answer) {
      $mdDialog.hide(answer);
    };
  }

  function salvaVideo(video){
    if(angular.isObject(video) && !angular.isUndefined(video.nome) && !angular.isUndefined(video.url)){
      $scope.video = new urlVideos();
      $scope.video.data = video;
      $scope.video.$save()
      .then(function() {
        sweetAlert("Sucesso!", "O vídeo foi salvo com sucesso!", "success");
        buscaVideos();
      })
      .catch(function(erro) {
        sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
      });
    }
    else{
      sweetAlert("Oops...", "Alguma coisa está errada. Refaça a operação!", "error");
    }
  }

  $scope.init();


});
