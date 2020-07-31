/**
 * main app
 */ 

/**
 * Module dependencies.
 */
var log4js = require('log4js');
exports.webServer = require('./webserver');
exports.webSocketServer = require('./socketserver');

/**
 * Logger
 */
var logger = log4js.getLogger();

/**
 * Constant
 */
var HTTP_SERVER_PORT = 8080;
var WEBSOCKET_SERVER_PORT = 7070;

/**
 * Startup Servers
 */
var webServer = new exports.webServer(HTTP_SERVER_PORT);
webServer.startup();
logger.info('Startup WebServer [port=' + HTTP_SERVER_PORT + ']');

var webSocketServer = new exports.webSocketServer(WEBSOCKET_SERVER_PORT);
webSocketServer.startup();
logger.info('Startup WebSocketServer [port=' + WEBSOCKET_SERVER_PORT + ']');

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
});