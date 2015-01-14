var CryptChat = function (groupName, nickName, password) {
    var self = this;
    var lastServerRequest = new Date();
    var lastMessageReceivement = new Date();
    var position = 0;

    this.events = {}; // contains all events


    // Start the auto updater
    var autoUpdateInterval = setInterval(_autoUpdate, 500);
    setTimeout(_autoUpdate, 0);

    
    /** --- Public methods ------------------------------------------------------------ **/

    /**
     *   Starts a new server request that asks for new messages.
     */
    this.update = function () {
        query({
            position: position
        });
    };


    /**
     *   Sends a message to the server.
     *   Also handles new messages from the server.
     */
    this.send = function (messageText) {
        if (!messageText)
            return;

        if (!password)
            throw "Please enter a password first!";

        var request = {
            message: {
                text: encrypt(messageText),
                sender: encrypt(nickName)
            },
            position: position
        };

        query(request);
    };


    /**
     *   Requests the server to clear the chatroom.
     */
    this.clear = function () {
        query({
            clear: true
        });
    };


    /**
     *   Adds a new event.
     */
    this.on = function (eventName, callback) {
        this.events = this.events || [];
        if (!this.events[eventName])
            this.events[eventName] = [];

        this.events[eventName].push(callback);
    }

    /**
     *   Triggers an event.
     */
    this.trigger = function (eventName, data) {
        var events = this.events[eventName] || [];
        for (var i in events) {
            events[i](data);
        }
    }

    /**
     *   (Destructor)
     *   Does the following:
     *   - Stops the auto updater
     */
    this.destroy = function () {
        if (autoUpdateInterval) {
            clearInterval(autoUpdateInterval);
            autoUpdateInterval = null;
        }
    };



    /** --- Private methods ------------------------------------------------------------ **/

    /**
     *   Sends data to the server.
     *   Server response gets handled by handleServerResponse().
     */
    function query(jsonObject, callback) {
        
        if (self._xhr)
            self._xhr.abort();
        
        self._xhr = $.ajax({
            url: './' + groupName,
            data: jsonObject ? JSON.stringify(jsonObject) : null,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            success: handleServerResponse,
            error: function () {
                handleServerResponse(false);
            }
        });
    }

    /**
     *   Handles the server response after every query.
     *   Decrypts the nicknames and messages by the password the user has entered.
     *   Triggers Event: 'newmessages' (arg: [messages])
     */
    function handleServerResponse(response) {
        lastServerRequest = new Date();

        if (response.messages && response.messages.length > 0) {

            for (var i in response.messages) {
                var msg = response.messages[i];

                msg.sender = decrypt(msg.sender);
                msg.text = decrypt(msg.text);
                msg.own = nickName == msg.sender;
            }

            position = response.newPosition;
            self.trigger('newmessages', response.messages);
            lastMessageReceivement = new Date();
            console.log(response.messages.length + ' messages received.');
        }
    }


    /**
     *   Encrypts a text using the password the user has entered.
     */
    function encrypt(text) {
        return password ? CryptoJS.AES.encrypt(text, password).toString() : text;
    }

    /**
     *   Decrypts a text using the password the user has entered.
     *   If it fails (because of a wrong password) it returns encrypted input.
     */
    function decrypt(text) {
        try {
            return password ? CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8) : text;
        } catch (e) {
            return '';
        }
    }

    /**
     *   Automatically updates the chat.
     *   Gets called every 1000 milliseconds.
     */
    function _autoUpdate() {
        var date = new Date();
        var lastRequest = (date - lastServerRequest);

        // If the last receivement was less than 10 seconds ago,
        // the request interval changes from 5 to 1 second.
        if ((date - lastMessageReceivement) <= 10000 && lastRequest > 1000) {
            console.log("Update chat ...");
            self.update();
        } else if (lastRequest > 5000) {
            console.log("Update chat ...");
            self.update();
        }
    }
};