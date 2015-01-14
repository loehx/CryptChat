app.controller('ChatController', ['$scope', '$routeParams', '$location',
    function ($scope, $routeParams, $location) {
        var self = this;

        // If the page gets reloaded, the nickname and password are lost,
        // so the user gets redirect to the join form.
        if (!app.settings.nickName) {
            $location.path('/');
            return;
        }

        // Overwrite the bug fix from JoinController, because we don't need it here.
        document.body.style.height = "auto";

        setupDoubleTouchMessageBoxFocus();
        setupAdvancedScrolling();

        $scope.groupName = app.settings.groupName = atob($routeParams.groupName);
        $scope.groupNameEncoded = $routeParams.groupName;
        $scope.messages = [];

        // If the chat still exists, it needs to get destroyed.
        if (app.settings.chat) {
            app.settings.chat.destroy();
            delete app.settings.chat;
        }

        // Create a Chat object.
        var chat = app.settings.chat = new CryptChat($scope.groupNameEncoded, app.settings.nickName, app.settings.password);

        // Add an event that handles the incoming messages.
        chat.on('newmessages', function (messages) {
            $scope.messages = $scope.messages.concat(messages);
            $scope.$apply();

            self._history = self._history || $('.history');
            var scrollTop = self._history[0].scrollHeight - self._history.height();
            self._history.stop().animate({
                scrollTop: scrollTop
            }, "slow");
        });


        /** --- Public methods ------------------------------------------------------------ **/

        // Send a message to the chatroom.
        $scope.send = function (messageText) {
            chat.send(messageText);
            $scope.messageText = "";
        };

        // Clear the chat locally and on the server.
        $scope.clear = function () {
            $scope.messages = [];
            chat.clear();
        };

        $scope.keypress = function (event) {
            // Ensure the possibility to insert line breaks by using SHIFT + ENTER.
            if (event.which == 13 && !event.shiftKey) {
                event.preventDefault();
                $scope.send($scope.messageText);
            }
        };


        /** --- Private methods ------------------------------------------------------------ **/

        /**
         *   FEATURE: 'Double tap'
         *   Focusses the input box if a user double taps the chat.
         */
        function setupDoubleTouchMessageBoxFocus() {
            var lastTouch = new Date();
            $(document).on('touchstart', function () {
                var time = new Date();
                console.log("Touch start", (time - lastTouch));
                if ((time - lastTouch) < 500) {
                    event.preventDefault();
                    $('.message-input').focus();
                }
                lastTouch = time;
            });
        }

        /**
         *   Organise the scrolling on mobile devices.
         *   It turns out that the iphone has problems scrolling the chat.
         *   TODO: Check on Android.
         */
        function setupAdvancedScrolling() {
            var scrollingElement = $('.history-inner')[0];
            var lastY = -1;
            var currentY = 0;

            $(document).on('touchmove', function () {
                event.preventDefault();
                var touch = event.targetTouches[0];
                var y = touch.screenY;
                var moveY = 0 - (lastY - y);

                if (lastY === -1) {
                    lastY = y;
                } else {
                    currentY += moveY;
                    currentY = Math.max(currentY, 0);
                    scrollingElement.style.webkitTransform = 'translate(0, ' + currentY + 'px)';
                    scrollingElement.style.transform = 'translate(0, ' + currentY + 'px)';
                    lastY = y;
                }

            }).on('touchend', function () {
                lastY = -1;
            });
        }
}]);