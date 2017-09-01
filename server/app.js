/**
 * app.js
 */

console.log('start');

const SERVER_PORT = 8080;
const DOC_ROOT = `${__dirname}/../htdocs`;

const connect = require('connect');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');

const webServer = new WebServer(DOC_ROOT);
webServer.start();

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
