/**
 * main.js
 */

/**
 * Constant
 */

var LOGIN_PAGE = 0;
var ANSWER_PAGE = 1;
var MANGEMENT_PAGE = 2;

var ADMIN_USER = "admin";

var CANVAS_SIZE = 300;
var WRAP_CSNVAS_ID_PREFIX = 'wrap_canvas_';
var CSNVAS_ID_PREFIX = 'draw_';

/**
 * Global variables
 */
var wsClient;
var canvasList = new Array();

window.onload = function() {
    wsClient = new WebSocketClient(ADMIN_USER);
    wsClient.init();
    return false;
}

/******************************
 * Canvas
 ******************************/
var drawObj = function(canvasElem) {
    var _self = this;
    this.oldX;
    this.oldY;
    this.drawFlag = false;
    this.elem = canvasElem
    this.ctx;

    this.init = function() {
	var context = this.elem.getContext('2d');
	this.ctx = context;
    }

    this.start = function(data) {
	this.drawFlag = true;
	this.oldX = data.x/2;
	this.oldY = data.y/2;
    }

    this.move = function(data) {
	if (!this.drawFlag) return;

	var x = data.x/2;
	var y = data.y/2;
	this.ctx.fillStyle = "rgba(255,0,0,1)";
	this.ctx.lineWidth = 1;
	this.ctx.beginPath();
	this.ctx.moveTo(this.oldX, this.oldY);
	this.ctx.lineTo(x, y);
	this.ctx.stroke();
	this.ctx.closePath();

	this.oldX = x;
	this.oldY = y;
    }

    this.end = function() {
	this.drawFlag = false;
    }

    this.clear  = function() {
	this.elem.width = this.elem.width;
    }
}

function isExistsCanvasList(uid) {
    for (var i = 0; i < canvasList.length; i++) {
	var c = canvasList[i];
	if (c.user_id == uid)
	    return true;
    }

    return false;
}

function addToCanvasList(canvas) {
    canvasList.push(canvas)
}

function removeFromCanvasList(uid) {
    for (var i = 0; i < canvasList.length; i++) {
	var c = canvasList[i];
	if (c.user_id == uid)
	    canvasList.splice(i, 1);
    }
}

function getUserCanvas(uid) {
    for (var i = 0; i < canvasList.length; i++) {
	var c = canvasList[i];
	if (c.user_id == uid)
	    return c.draw;
    }
}

/*****
 * Handle message
 */
function messageHandler(data) {
    var msg = JSON.parse(data);
    switch(msg.data_type) {
    case DATA_TYPE.login:
	userLogin(msg);
	break;
    case DATA_TYPE.logout:
	userLogout(msg);
	break;
    case DATA_TYPE.draw_start:
	userDrawStart(msg);
	break;
    case DATA_TYPE.draw_move:
	userDrawMove(msg);
	break;
    case DATA_TYPE.draw_end:
	userDrawEnd(msg);
	break;
    case DATA_TYPE.clear:
	userClear(msg);
	break;
    case DATA_TYPE.answer_finish:
	userAnswerFinish(msg);
	break;
    case DATA_TYPE.send_result:
	userAnswerFinish(msg);
	break;
    case DATA_TYPE.send_question:
	userAnswerFinish(msg);
	break;
    default:
	break;
    }
}

function userDrawStart(msg) {
    var user_id = msg.from;
    var data = msg.data;
    var can = getUserCanvas(user_id);
    can.start(data);
}

function userDrawMove(msg) {
    var user_id = msg.from;
    var data = msg.data;
    var can = getUserCanvas(user_id);
    can.move(data);
}

function userDrawEnd(msg) {
    var user_id = msg.from;
    var can = getUserCanvas(user_id);
    can.end();
}

function userClear(msg) {
    var user_id = msg.from;
    var can = getUserCanvas(user_id);
    can.clear();
}

function userLogin(msg) {
    var user_id = msg.from;
    // canvas 作成.
    createUserCanvas(user_id);
    if (!isExistsCanvasList(user_id)) {
	var id = CSNVAS_ID_PREFIX+user_id;
	var canvasElem = doc.getElementById(id);
	var can = new drawObj(canvasElem);
	can.init();
	var obj = {'user_id':user_id, 'draw':can};
	addToCanvasList(obj);
    }
}

function userLogout(msg) {
    var user_id = msg.from;
    removerUserCanvas(user_id);
    removeFromCanvasList(user_id);
}

function removerUserCanvas(uid) {
    var answerList = doc.getElementById('answer_list');

    var id = WRAP_CSNVAS_ID_PREFIX+uid;
    var li = doc.getElementById(id);

    if (li != null) {
	answerList.removeChild(li);
    }
}

function createUserCanvas(uid) {
    var answerList = doc.getElementById('answer_list');
    var article = doc.createElement('article');
    article.id = WRAP_CSNVAS_ID_PREFIX+uid;
    article.innerText = 'User : '+uid;
    var canvasElem = doc.createElement('canvas');
    canvasElem.id = CSNVAS_ID_PREFIX+uid;
    canvasElem.width = CANVAS_SIZE;
    canvasElem.height = CANVAS_SIZE;

    article.appendChild(canvasElem);
    answerList.appendChild(article);
}
