(function() {
  'use strict';

  angular.module('DLock-Home').
  directive('dlocFileList', [FileListDirective]);

  function FileListDirective() {
    function link($scope, element, attrs) {
      $scope.files = [];
      $scope.fileSystems = [];

      $scope.$watch('files', function(newValue) {
        $scope.fileSystems.length = 0;
        createFileTree(newValue);
      });

      $scope.clickFile = function(key, file, fileSystemIndex) {
        if($scope.isDirectory(file)) {
          //Remove all old fileSystems
          $scope.fileSystems.length = fileSystemIndex + 1;

          $scope.fileSystems.push(file);
          return;
        }

        $scope.selectFile(file);
      };

      $scope.isDirectory = function(file) {
        return file.type === "dir";
      }

      var createFileTree = function(filesObj) {
        //If its a valid firebase object
        if(!filesObj.val) return;

        var files = filesObj.val();

        //No valid files
        if(files === null || files.length === 0) {
          return;
        }

        //Map all the hashes inside the file objects
        files = Object.keys(files).map(function(key) {
          var file = files[key];
          file.hash = key;
          return file;
        });

        var recurse = function(parent, path, file) {
          var slash = path.indexOf('/');
          if(slash !== -1) {
            //The name of the directory
            var dir = path.substr(0, slash);

            //The new path within the directory
            var newPath = path.substr(slash + 1);

            //Create the new directory
            if(!(dir in parent)) {
              parent[dir] = {
                type: "dir"
              };
            }
            return recurse(parent[dir], newPath, file);
          }

          file.path = path;
          parent[path] = file;
        };

        var fileSystem = {};
        for(var i = 0; i < files.length; i++) {
          recurse(fileSystem, files[i].path, files[i]);
        }

        $scope.fileSystems.push(fileSystem);
      };
    };

    return {
      link: link,
      restrict: 'E',
      scope: {
        'upload': '=',
        'files': '=',
        'selectFile': '='
      },
      templateUrl: 'components/file-list.html'
    };
  }
})();
