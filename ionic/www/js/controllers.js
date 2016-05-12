var serverURL = 'http://ec2-54-173-9-169.compute-1.amazonaws.com:9090';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginmodal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginmodal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginmodal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $http({
      method: 'POST',
      url: serverURL+'/login',
      data: $scope.loginData
    }).then(function successCallback(response) {
        var alertPopup = $ionicPopup.alert({
           title: 'Success',
           template: 'Successfully Login!'
        });

        alertPopup.then(function(res) {
          $scope.closeLogin();
        });

      }, function errorCallback(response) {
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: response.data
        });
      });

  };

  // Create the register modal
  $ionicModal.fromTemplateUrl('templates/newuser.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registermodal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.registermodal.hide();
  };

  // Open the login modal
  $scope.Register = function() {
    $scope.registermodal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doRegister = function() {
    $http({
      method: 'POST',
      url: serverURL+'/register',
      data: $scope.registerData
    }).then(function successCallback(response) {
        var alertPopup = $ionicPopup.alert({
           title: 'Success',
           template: 'Successfully Create the New User!'
        });

        // alertPopup.then(function(res) {
        //   $scope.closeRegister();
        //   $scope.login();
        // });

      }, function errorCallback(response) {
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: response.data
        });
      });

  };
})

.controller('PlaylistsCtrl', function($scope, $http, $cordovaMedia, $ionicLoading, $location, pass) {
    $http.get(serverURL+"/history/200")
    //$http.get("http://127.0.0.1:8000/" + "login")
      .then(function(response) {
          posts = response.data;
          $scope.playlists = posts;
    });

    $http.get(serverURL+"/show")
      .then(function(response) {
          $scope.newposts = response.data;
    });

    if ($scope.newposts) 
      $scope.HaveNewPost = true;
    else
      $scope.HaveNewPost = false;
    console.log($scope.HaveNewPost);

    $scope.play = function(src) {
      console.log(src.message);
      url = serverURL+"/audio?data="+src.message;

    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    var fileURL = "cdvfile://localhost/temporary/" + "test.mp3"

    fileTransfer.download(
        uri, fileURL,
        function(entry) {
            console.log("download complete: " + entry.toURL());
              var media = new Media("cdvfile://localhost/temporary/test.mp3", null, null, mediaStatusCallback);
              $cordovaMedia.play(media);
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        }, false,
        {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );

    }

    $scope.detail = function(obj) {
        $location.path('/app/playlists/'+obj.text);
        pass.set(obj);
    }
 
    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }
})
.controller('PlaylistCtrl', function($scope, $stateParams, pass) {
    console.log(pass.get().text);
    $scope.obj = pass.get();
})
.controller('ProfileCtrl', function($scope, $http, $window) {
  $scope.TwitterAttach = function() {

  $http.get(serverURL+"/attach/twitter")
    //$http.get("http://127.0.0.1:8000/" + "login")
      .then(function(response) {
        console.log(response.data);
        var url = 'https://api.twitter.com/oauth/authenticate?oauth_token='+response.data;
        //$window.location.href = 'http://localhost:5000/surround';
        //$http.get('http://www.google.com');
        window.open(url); 
    });

  };

});




document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(FileTransfer);
    console.log("asdkjfkdsskfksfkjkj");
}


