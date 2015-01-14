app.controller('JoinController', ['$scope', '$location',
    function ($scope, $location) {

        // Sync the body height with the window height.
        // This was implemented causing problems with the input and control panel of the iPhone.
        var bodyHeight = Math.max(window.screen.height, window.innerHeight);
        if (bodyHeight)
            document.body.style.height = bodyHeight + 'px';

        // Try to get the input fields from cookie.
        if ($.cookie) {
            $scope.groupName = $.cookie('group-name');
            $scope.nickName = $.cookie('nick-name');
        }

        // If there is still a chat opened -> destroy it.
        if (app.settings.chat) {
            app.settings.chat.destroy();
            delete app.settings.chat;
        }


        /** --- Public methods ------------------------------------------------------------ **/

        /**
         * Joins a group
         */
        $scope.join = function (groupName, password, nickName) {
            $.cookie('group-name', groupName);
            $.cookie('nick-name', nickName);
            
            app.settings.groupName = groupName;
            app.settings.nickName = nickName;
            app.settings.password = password;

            $location.path('/' + btoa(groupName));
        };
}]);