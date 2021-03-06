(function() {
  'use strict';

  angular.module('DLock-Home').
  directive('dlocFileViewer', ['FileService', FileViewerDirective]);

  function FileViewerDirective(FileService) {
    function link($scope, element, attrs) {
      $scope.humanFileSize = function(bytes) {
        var thresh = 1000;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
      }

      $scope.download = function() {
        console.log("Requested file download", $scope.file);
        FileService.requestFile($scope.file.hash);
      }
    };

    return {
      link: link,
      restrict: 'E',
      scope: {
        'file': '='
      },
      templateUrl: 'components/file-viewer.html'
    };
  }
})();
