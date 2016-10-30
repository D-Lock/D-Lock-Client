(function() {
  'use strict';

  angular.module('DLock-Home').
  directive('dlocFileList', [FileListDirective]);

  function FileListDirective() {
    return {
      restrict: 'E',
      scope: {
        'upload': '=',
        'files': '='
      },
      templateUrl: 'components/file-list.html'
    };
  }
})();
