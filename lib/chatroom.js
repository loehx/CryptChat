var ChatRoom = module.exports = function (name) {
    var messages = [];

    this.created = new Date();
    this.modified = new Date();
    this.currentPosition = 0;

    this.addMessage = function (message) {
        message.received = new Date();
        message.position = ++this.currentPosition;
        messages.push(message);
        this.modified = new Date();
    }

    this.hasNews = function (position) {
        return this.currentPosition > position;
    }

    this.getMessages = function () {
        return messages;
    }

    this.removeAllMessages = function () {
        messages = [];
    }
}

ChatRoom.rooms = {};
ChatRoom.get = function (name) {
    var room = ChatRoom.rooms[name];
    if (!room) {
        room = new ChatRoom(name);
        ChatRoom.rooms[name] = room;
    }
    return room;
};