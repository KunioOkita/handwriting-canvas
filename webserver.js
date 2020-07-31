/*
 * webserver
 */

/**
 * Module dependencies.
 */
var log4js = require('log4js');
var connect = require('connect');

/**
 * Logger
 */
var logger = log4js.getLogger();

/**
 * Module exports.
 */
module.exports = webServer;

/**
 * Constructor. HTTP Server.
 *
 * @param {int} port listen port
 * @api public
 */
function webServer(port) {
    this.port = port;
    this.docroot = __dirname + "/htdocs";
    this.Server = connect.createServer(
	connect.static(this.docroot)
    );
    logger.debug('WebServer Constructor [port='+port+', docroot='+this.docroot+']');
}

/**
 * Startup HTTP Server
 * @api public
 */
webServer.prototype.startup = function() {
    this.Server.listen(this.port);
}
