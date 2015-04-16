/*
Copyright 2015 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


'use strict';

angular.module('bcdevxApp.programs', ['ngRoute','ngResource','ngSanitize','btford.markdown'])

    .config(['$routeProvider', function($routeProvider) {

    }])

    .factory('ProgramListService', ['$resource', function($resource) {
        return $resource('/programs');
    }])

    .controller('ProgramsCtrl', ['$scope', 'ProgramListService', 'ProgramDetailsService', '$q', 'usSpinnerService',
        function($scope, ProgramListService, ProgramDetailsService, $q, usSpinnerService) {

        // Array of projects
        $scope.programs = [];
        $scope.programsLoaded = false;
        $scope.predicateTitle = '';

        // Array of alerts
        $scope.alerts = [];

        $scope.startSpin = function(){
            usSpinnerService.spin("spinner-1");
        }
        $scope.stopSpin = function(){
            usSpinnerService.stop("spinner-1");
        }

        var programListDeferred = $q.defer();
        var programPromise = projectListDeferred.promise;

        var sourceListDeferred = $q.defer();
        var sourcePromise = sourceListDeferred.promise;

        projectPromise.then(
            function(value){
                usSpinnerService.stop("spinner-projects")
            }
        );
        sourcePromise.then(
            function(value){
                usSpinnerService.stop("spinner-sources")
            }
        );

        ProgramListService.get({}, function(data) {

            $scope.programs = data.programs;
            programListDeferred.resolve("resource list length: " + data.programs.length);
            $scope.programsLoaded = true;

        }, function(error) {
            console.log(error);
            $scope.alerts.push({ type: 'warning', msg: 'There was an error accessing data from <strong>' + error.config.url + '</strong>.' });
            programListDeferred.resolve("error retrieving programs for  " + error.config.url);
            $scope.programsLoaded = true;
        });
    }]);