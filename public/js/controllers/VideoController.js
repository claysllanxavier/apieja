angular.module('apieja').controller('VideoController',
function($scope, $resource, $mdToast, $mdDialog) {

  $scope.init = function() {
    buscaVideos();

  };
  $scope.videos = [];

  $scope.filtro = '';

  var urlVideos = $resource('/api/videos');

  function buscaVideos() {
    urlVideos.query(
      function(videos) {
        $scope.videos = videos;
      },
      function(erro) {
        console.log("Não foi possível obter a lista dos videos");
        console.log(erro);
      }
    );
  }

  $scope.init();

  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'modalVideo.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

});
