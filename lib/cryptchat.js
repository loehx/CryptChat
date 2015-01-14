var express = require('express');
var ChatRoom = require('./chatroom');

module.exports = function () {
    var router = new express.Router();

    router.post('/:chatRoom', function (req, res, next) {
        var room = ChatRoom.get(req.params.chatRoom);
        var newPosition;
        
        if (req.body.message) {
            room.addMessage(req.body.message);
        }
        else if (req.body.clear) {
            room.removeAllMessages();
        }
        
        if (!room.hasNews(req.body.position)) {
            res.json({ noNews: true }).end();
            return;
        }
        
        var messages = room.getMessages().filter(function(message) {
            newPosition = message.position;
            return message.position > req.body.position;
        });
        
        var response = {
            messages: messages,
            newPosition: newPosition
        };
        
        res.end(JSON.stringify(response));
    });
    
    return router;
}