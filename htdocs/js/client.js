/**
 * main.js
 */

/**
 * Constant
 */
var LOGIN_PAGE = 0;
var ANSWER_PAGE = 1;
var MANGEMENT_PAGE = 2;

var CANVAS_SIZE = 300;

/**
 * Global variables
 */
var wsClient;

var drawFlag = false;
var offsetX = 0;
var offsetY = 0;
var oldX = 0;
var oldY = 0;
var canvasElem;

/******************************
 * Canvas
 ******************************/
function touchDraw(e) {
    if (!drawFlag) return;

    var x = e.touches[0].pageX - offsetX;
    var y = e.touches[0].pageY - offsetY;
    var context = canvasElem.getContext("2d");
    context.fillStyle = "rgba(255,0,0,1)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(oldX, oldY);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();

    oldX = x;
    oldY = y;

    var data = {'x':x, 'y':y};
    e.preventDefault();
}

function mouseDraw(e) {
    if (!drawFlag) return;

    var x = e.clientX - offsetX;
    var y = e.clientY - offsetY;
    var context = canvasElem.getContext("2d");
    context.fillStyle = "rgba(255,0,0,1)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(oldX, oldY);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();

    oldX = x;
    oldY = y;

    var data = {'x':x, 'y':y};
}

function clearCanvas() {
    canvasElem.width = canvasElem.width;
}

/******************************
 * Other function
 ******************************/
function addEventToCanvas() {
    if (isTouchDevice()) {
        canvasElem.addEventListener("touchmove", touchDraw, true);
        canvasElem.addEventListener("touchstart", function(e) {
            drawFlag = true;
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            oldX = x - offsetX;
            oldY = y - offsetY;
            var data = {'x':oldX, 'y':oldY};
            e.preventDefault();
        }, true);
        canvasElem.addEventListener("touchend", function() {
            drawFlag = false;
            e.preventDefault();
        }, true);
    } else {
        canvasElem.addEventListener("mousemove", mouseDraw, false);
        canvasElem.addEventListener("mousedown", function(e) {
            drawFlag = true;
            oldX = e.clientX - offsetX;
            oldY = e.clientY - offsetY;
            var data = {'x':oldX, 'y':oldY};
        }, false);
        canvasElem.addEventListener("mouseup", function() {
            drawFlag = false;
        }, false);
    }
}

function isTouchDevice() {
    var agent = navigator.userAgent;

    // is touch devices
    if (agent.search(/iPhone/) != -1 ||
        agent.search(/iPad/) != -1 ||
        agent.search(/iPod/) != -1 ||
        agent.search(/Android/) != -1) {
        return true;
    }

    return false;
}

window.onload = function() {
    console.log('start');
    var canvasWrapElem = document.getElementById('wrap_canvas');
    canvasElem = document.createElement('canvas');
    canvasElem.id = 'draw-area';

    canvasElem.width = CANVAS_SIZE;
    canvasElem.height = CANVAS_SIZE;

    canvasWrapElem.style.display = "block";
    canvasWrapElem.appendChild(canvasElem);

    offsetX = canvasElem.offsetLeft;
    offsetY = canvasElem.offsetTop;

    addEventToCanvas();
};
