(function() {
    "use strict";

    angular.module("app", ['ngRoute'])
        .config(RouteCfg)
        .controller("MealListCtrl", MealListCtrl)
        .controller("PersonListCtrl", PersonListCtrl)
        .service("PersonService", PersonService)
    ;

    function PersonService($http)
    {
        this.getEmployees = function(test) {
            return $http.get('/api/persons.json')
                .then(function(response) {
                    return response.data;
                });
        }
    }

    function RouteCfg($routeProvider)
    {
        $routeProvider.
        when('/', {
            templateUrl: 'partials/phone-list.html',
            controller: 'PhoneListCtrl'
        }).
        when('/phones/:phoneId', {
            templateUrl: 'partials/phone-detail.html',
            controller: 'PhoneDetailCtrl'
        });
    }

    function MealListCtrl($http)
    {
        var vm = this;
        var list = []

        $http.get('/api/meals.json')
            .then(function(response) {
                vm.list = response.data;
            });
    }

    function PersonListCtrl($http, PersonService)
    {
        var vm = this;
        var list = []
        var active;

        PersonService.getEmployees()
            .then(function(employees) {
                vm.list = employees;
            });

        vm.select = function(person) {
            vm.active = person;
        };
    }
    
})();