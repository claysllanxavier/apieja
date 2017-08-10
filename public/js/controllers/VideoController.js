angular.module('apieja').controller('VideoController',
function($scope, $resource, $mdToast, $location) {
  $scope.init = function() {
    buscaVideos();
  };
  $scope.videos = "";

  $scope.filtro = '';


  var partUrl = window.location.pathname.split( '/' );

  var urlVideos = $resource('/api/videos/'+partUrl[2]);

  function buscaVideos() {
    urlVideos.get(
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

  $scope.init();

});
