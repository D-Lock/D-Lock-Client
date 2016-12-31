'use strict';

describe('Module: DLock', function () {
  var $stateProvider;

  beforeEach(module('ui.router', function(_$stateProvider_) {
    $stateProvider = _$stateProvider_;
    spyOn($stateProvider, 'state').and.callThrough();
  }, 'DLock'));

  // Trigger the modules
  beforeEach(inject(function(){

  }));

  it('should define states', function () {
    expect($stateProvider.state).toHaveBeenCalled();
  });
});
