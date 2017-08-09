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
  $scope.saveRowCallback = function(row){
    $mdToast.show(
      $mdToast.simple()
      .content('Row changed to: '+row)
      .hideDelay(3000)
    );
  };

  $scope.init();

});
