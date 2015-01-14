var app = angular.module('CryptChatApp', ['ngRoute', 'ngAnimate']);

app.settings = {};

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/view/join.htm',
                controller: 'JoinController'
            })
            .when('/:groupName', {
                templateUrl: '/view/chat.htm',
                controller: 'ChatController'
            })
            .otherwise({
                redirectTo: '/'
            });
  }]);