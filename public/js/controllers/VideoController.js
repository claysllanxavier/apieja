angular.module('apieja').controller('VideoController',
function($scope, $resource, $mdToast) {
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
  $scope.delete = function(){
    console.log("delete");
  };

  $scope.edit = function(){
    console.log("edit");
  };

  $scope.add = function() {
    console.log("add");
  };

  $scope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  }

  $scope.init();

});
