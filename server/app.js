/**
 * app.js
 */

console.log('start');

const SERVER_PORT = 8080;
const WSSERVER_PORT = 7070;
const DOC_ROOT = `${__dirname}/../htdocs`;

const connect = require('connect');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');

// for websocket server.
const http = require('http');
const socketio = require('socket.io');

const webServer = new WebServer(DOC_ROOT);
webServer.start();

const webSocketServer = new WebSocketServer();
webSocketServer.start();

function WebServer(docRoot) {
    'use strict';
    var self = this;
    var app = connect();

    // 静的ファイル返却用
    app.use(serveStatic(docRoot));

    /**
     * WebServer 起動
     */
    self.start = function() {
        app.listen(SERVER_PORT);
        console.log(`WebServer Start. port=${SERVER_PORT}, docRoot=${docRoot}`);
    };
}

function WebSocketServer() {
    let self = this;
    self.server = null;
    self.io = null;

    self.start = function() {
        self.server = http.createServer();
        self.io = socketio(self.server);

        self.io.set('heartbeat timeout', 9000);
        self.io.set('heartbeat interval', 4000);

        self.server.listen(WSSERVER_PORT);
        console.log(`WebSocketServer Start. port=${WSSERVER_PORT}`);
    };
}
