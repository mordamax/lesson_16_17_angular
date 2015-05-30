(function(angular) {
    'use strict';

    var App = angular.module('SPA', [
        'ngRoute'
    ]);

    App.run(['$rootScope', '$location', '$route',
        function($rootScope, $location, $route) {
        $rootScope.$route = $route;
        $rootScope.isActive = function(page) {
            var path = $location.path().replace('/', '');

            return path == page;
        }
    }]);

    App.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'pages/home.html',
                controller: 'HomeController'
            })
            .when('/about_us', {
                templateUrl: 'pages/about.html',
                controller: 'AboutController'
            })
            .when('/products', {
                templateUrl: 'pages/products.html',
                controller: 'ProductsController',
                resolve: {
                    products: [
                        '$http', '$q', '$location', '$timeout',
                        function($http, $q, $location, $timeout) {
                            var defer = $q.defer();

                            var products = $http.get('api/products.json');

                            products.then(function(response) {
                                $timeout(function() {
                                    defer.resolve(response.data.payload);
                                }, 1000);
                            });

                            products.catch(function() {
                                $location.path('/');
                            });

                            return defer.promise;
                        }
                    ]
                }
            })
            .when('/preferences', {
                templateUrl: 'pages/settings.html',
                controller: 'SettingsController'
            })
            .when('/contact_us', {
                templateUrl: 'pages/contacts.html',
                controller: 'ContactController'
            })

            .otherwise('/');
    }]);

    App.controller('HomeController', [
        '$scope', '$http', '$timeout',
        function($scope, $http, $timeout) {
            $scope.showUsers = function() {
                $scope.loading = true;

                $timeout(function(){
                    $http
                        .get('api/users2.json')
                        .then(function(response) {
                            $scope.users = response.data.payload;
                        })
                        .catch(function() {
                            alert('wowow');
                        })
                        .finally(function(){
                            $scope.loading = false;
                        })
                }, 1000);
            }
        }
    ]);

    App.controller('AboutController', [
        '$route', '$scope',
        function($route, $scope) {

        }
    ]);

    App.controller('ProductsController', [
        '$scope', 'products',
        function($scope, products) {
        $scope.products = products;
    }]);

    App.controller('SettingsController', [
        '$route', '$scope',
        function($scope, $route) {

        }
    ]);

    App.controller('ContactController', [
        '$route', '$scope',
        function($scope, $route) {

        }
    ]);

})(angular);