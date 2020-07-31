/*
 * webserver
 */

/**
 * Module dependencies.
 */
var http = require('http');
var log4js = require('log4js');
var ws = require('websocket.io');
var queryString = require('querystring');

/**
 * Logger
 */
var logger = log4js.getLogger();

/**
 * Module exports.
 */
module.exports = webSocketServer;

/**
 * Constructor. WebSocket Server.
 *
 * @param {int} port listen port
 * @api public
 */
function webSocketServer(port) {
    var _self = this;
    var ADMIN = 'admin';
    var DATA_TYPE = {
	'login': 0,
	'logout' : 1,
	'draw_start': 2,
	'draw_move': 3,
	'draw_end': 4,
	'clear' : 5,
	'answer_finish':6,
	'send_result':7,
	'send_question': 8
    }

    this.port = port;
    this.connectClients =  new Array();

    this.httpServer = http.createServer();
    var server = ws.attach(
	this.httpServer
    );

    server.on('connection', function(clientSocket) {
	logger.debug(clientSocket);

	var req = clientSocket.req;
	var query = req.url.split('?')[1];
	var params = queryString.parse(query);
	var user_id = params.userid;

	// Added Client List
	if (!_self.isExistsUser(user_id)) {
	    var client = {'user_id':user_id,
			  'socket':clientSocket};
	    _self.addUser(client);
	    logger.debug(_self.getConnectUsers());
	}

	if (user_id != ADMIN) {
	    var sendMsg = {
		'from':user_id,
		'to':ADMIN,
		'data_type':DATA_TYPE.login, 
		'data': ''};

	    logger.info('send login message');
	    _self.sendMsg(ADMIN, sendMsg);
	}

	clientSocket.on('message', function(msg) {
            logger.info('Recive message : ' + msg);
	    var rMsg = JSON.parse(msg);
	    _self.sendMsg(rMsg.to, rMsg);
	});

	// Socket Close Event
	clientSocket.on('close', function(err) {
	    var sendMsg = {
		'from':user_id,
		'to':ADMIN,
		'data_type':DATA_TYPE.logout,
		'data': ''};
	    _self.sendMsg(ADMIN, sendMsg);
	    _self.removeUser(user_id);
	    logger.debug(_self.getConnectUsers());
	});
    });
}

/**
 * Startup HTTP Server
 * @api public
 */
webSocketServer.prototype.startup = function() {
    this.httpServer.listen(this.port);
}

webSocketServer.prototype.sendMsg = function(toUser, data) {
    var client = this.getClient(toUser);
    var sendData = JSON.stringify(data);
    if (client) {
        client.socket.send(sendData);
    }
}

webSocketServer.prototype.isExistsUser = function(uid){
    for (var i = 0; i < this.connectClients.length; i++) {
	var c = this.connectClients[i];
	if (c.user_id == uid)
	    return true;
    }

    return false;
}

webSocketServer.prototype.addUser = function(user) {
    this.connectClients.push(user);
}

webSocketServer.prototype.removeUser = function(uid) {
    for (var i = 0; i < this.connectClients.length; i++) {
	var c = this.connectClients[i];
	if (c.user_id == uid)
	    this.connectClients.splice(i, 1);
    }
}

webSocketServer.prototype.getConnectUsers = function() {
    var users = new Array();

    for (var i = 0; i < this.connectClients.length; i++) {
	var c = this.connectClients[i];
	users.push(c.user_id);
    }

    return users;
}

webSocketServer.prototype.getClient = function(uid) {
    for (var i = 0; i < this.connectClients.length; i++) {
	var c = this.connectClients[i];
	if (c.user_id == uid)
	    return c;
    }
}
