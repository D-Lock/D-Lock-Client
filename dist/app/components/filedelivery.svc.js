(function() {
  'use strict';

  angular.module('DLock-Files').
  service('FileDeliveryService', ['PackageFactory', FileDeliveryService]);

  function FileDeliveryService(PackageFactory) {
    var factory = {};
    
    factory.configure = function(socket) {
      this.socket = socket;
      this.eventReceivers = {};

      this.subscribe();
    };

    factory.on = function(event, callback) {
      if(typeof this.eventReceivers[event] === "undefined") {
        return this.eventReceivers[event] = [callback];
      }
      return this.eventReceivers[event].push(callback);
    };

    factory.publish = function(event, data) {
      var receivers = this.eventReceivers[event];
      if(typeof receivers === "undefined") return;

      receivers.forEach(function(receiver) {
        receiver(data);
      });
    };

    factory.subscribe = function() {
      var _this = this;
      this.on('file.loaded', function(filePackage) {
        _this.socket.emit('send.file', filePackage);
      });

      this.on('part.loaded', function(filePackage) {
        _this.socket.emit('send.part', filePackage);
      });

      this.socket.on('send.file', function(filePackage) {
        var params = {
          hash: filePackage.params.hash
        }
        _this.socket.emit('receive.file', params);
        _this.publish('receive.file', filePackage);
      });

      this.socket.on('send.part', function(filePackage) {
        var params = {
          partName: filePackage.name
        };
        _this.socket.emit('receive.part', params);
        _this.publish('receive.part', filePackage);
      });

      this.socket.on('receive.file', function() {
        _this.publish('success.file');
      });

      this.socket.on('receive.part', function() {
        _this.publish('success.part');
      });
    };

    factory.sendFile = function(file, params, $scope) {
      var _this = this;
      PackageFactory.create(file, params, $scope).then(function(filePackage) {
        _this.publish('file.loaded', filePackage);
      });
    };

    factory.sendPart = function(part, params, $scope) {
      var _this = this;
      PackageFactory.create(file, params, $scope).then(function(filePackage) {
        _this.publish('part.loaded', filePackage);
      });
    };

    return factory;
  }
})();
