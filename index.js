var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cryptChat = require('./lib/cryptchat');

app.use(bodyParser.json())
app.use(cryptChat());

// Allow access to the public folder.
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('./index.htm'); 
});

var port = 62889;
var server = app.listen(port, function () { 
    console.log('CryptChat started at http://%s:%s', "localhost", port);
});