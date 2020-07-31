/**
 * main.js
 */

/**
 * Constant
 */
var WEB_SOCKET_URL_PREFIX = "ws://";
var WEB_SOCKET_URL_PORT = 10004;

var LOGIN_PAGE = 0;
var ANSWER_PAGE = 1;
var MANGEMENT_PAGE = 2;

var ADMIN_USER = "admin";

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

/**
 * Global variables
 */
var doc = document;
var reqHost = document.location.hostname;
var connectFlag = false;

/******************************
 * WebSocket
 ******************************/
var WebSocketClient = function(userid) {
    this._self = this;
    this.ws;
    this.userId = userid;
}

WebSocketClient.prototype.init = function() {
    var wsUrl = WEB_SOCKET_URL_PREFIX + reqHost + ':' + WEB_SOCKET_URL_PORT + "?userid="+this.userId;
    this.ws = new WebSocket(wsUrl);

    //WebSocketのイベントの登録
    this.ws.addEventListener("open",this.onOpenWebSocket,false);
    this.ws.addEventListener("close",this.onCloseWebSocket,false);
    this.ws.addEventListener("message",this.onMessageWebSocket,false);
    
    //ウィンドウを閉じたり画面遷移した時にWebSokcetを切断する
    window.addEventListener("unload",this.onUnload,false);
};

WebSocketClient.prototype.onOpenWebSocket = function () {
    connectFlag = true;
    changeTitleColor(this);
};

WebSocketClient.prototype.onCloseWebSocket = function() {
    connectFlag = false;
    changeTitleColor(this);
};

WebSocketClient.prototype.onMessageWebSocket = function(e) {
    messageHandler(e.data);
};

WebSocketClient.prototype.sendMsg = function(to, type, data) {
    var sendMsg = {
	'from':this.userId,
	'to':to,
	'data_type':type, 
	'data':data
    };

    var msg = JSON.stringify(sendMsg);
    this.ws.send(msg);
};

function changeTitleColor(ws) {
    var list = doc.getElementsByClassName('title');
    switch(ws.readyState) {
    case ws.OPEN:
	for (var i = 0; i < list.length; i++) {
	    var l = list[i];
	    l.setAttribute('class', 'title connected');
	}
	break;
    case ws.CLOSE:
    default:
	for (var i = 0; i < list.length; i++) {
	    var l = list[i];
	    l.setAttribute('class', 'title');
	}
	break;
    }
}

function sleep(milliSeconds) {
    var time = new Date().getTime();
    while (new Date().getTime() < time + milliSeconds);
}
