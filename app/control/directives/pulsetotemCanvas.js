'use strict';

/**
 * @ngdoc directive
 * @name pulsetotemGuestBookClientApp.directive:pulsetotemCanvas
 * @description
 * # pulsetotemCanvas
 */
angular.module('PulseTotemControl')
  .directive('pulsetotemCanvas', [ '$timeout', '$mdSidenav', function($timeout, $mdSidenav) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        afterEachEndDraw: '&'
      },
      link : function(scope, element) {
        //NavBar

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        var debounce = function(func, wait, context) {
          var timer;
          return function debounced() {
            var context = scope,
              args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
              timer = undefined;
              func.apply(context, args);
            }, wait || 10);
          };
        };

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        var buildToggler = function(navID) {
          return debounce(function() {
            $mdSidenav(navID).
              toggle();
          }, 200);
        };

        scope.toggleToolsPanel = buildToggler('toolsPanel');


        //Canvas
        var isTouch = !!('ontouchstart' in window);

        var drawStartEvent = isTouch ? 'touchstart' : 'mousedown';
        var drawMoveEvent = isTouch ? 'touchmove' : 'mousemove';
        var drawEndEvent = isTouch ? 'touchend' : 'mouseup';

        var width = $(element).parent().first().width();
        var height = $(element).parent().first().height();

        var canvas = $("<canvas>");
        canvas.attr("width",  width + "px");
        canvas.attr("height", height + "px");
        $(element).first().append(canvas);

        // Creating a tmp canvas
        var tmp_canvas = $("<canvas>");
        tmp_canvas.attr("width",  width + "px");
        tmp_canvas.attr("height", height + "px");
        tmp_canvas.css("position", "absolute");
        tmp_canvas.css("top", 0);
        tmp_canvas.css("right", 0);
        tmp_canvas.css("bottom", 0);
        tmp_canvas.css("left", 0);
        tmp_canvas.css("cursor", "crosshair");
        $(element).first().append(tmp_canvas);

        //Function called after each 'end drawing' or 'end erasing'
        var endDrawing = function() {
          var theDataURL = canvas[0].toDataURL();
          scope.afterEachEndDraw()(theDataURL);
        };

        var ctx = canvas[0].getContext('2d');
        var tmp_ctx = tmp_canvas[0].getContext('2d');

        scope.drawMode = true;
        scope.eraseMode = false;
        scope.lineWidth = 5;
        scope.color = 'blue';

        scope.goToDrawMode = function() {
          scope.drawMode = true;
          scope.eraseMode = false;

          // Show Tmp Canvas
          tmp_canvas.show();
        };

        scope.changeColor = function(newColor) {
          scope.color = newColor;
        };

        scope.eraseAll = function() {
          // Clearing canvas
          ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        };

        scope.goToEraseMode = function() {
          scope.drawMode = false;
          scope.eraseMode = true;

          // Hide Tmp Canvas
          tmp_canvas.hide();
        };

        var mouse = {x: 0, y: 0};

        var getOffset = function(elem) {
          var offsetTop = 0;
          var offsetLeft = 0;
          do {
            if ( !isNaN( elem.offsetLeft ) )
            {
              offsetTop += elem.offsetTop;
              offsetLeft += elem.offsetLeft;
            }
            elem = elem.offsetParent;
          } while( elem );
          return {
            left:offsetLeft,
            top: offsetTop
          };
        };

        var updateMousePos = function(e) {
          if(isTouch){
            mouse.x = e.originalEvent.changedTouches[0].pageX - getOffset(e.target).left;
            mouse.y = e.originalEvent.changedTouches[0].pageY - getOffset(e.target).top;
          } else {
            mouse.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
            mouse.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
          }
        };

        // Pencil Points
        var ppts = [];

        /* Mouse Capturing Work */
        tmp_canvas.on(drawMoveEvent, function(e) {
          if(e){
            e.preventDefault();
            updateMousePos(e);
          }
        });

        canvas.on(drawMoveEvent, function(e) {
          if(e){
            e.preventDefault();
            updateMousePos(e);
          }
        });

        /* Drawing on Paint App */
        tmp_ctx.lineWidth = scope.lineWidth;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = scope.color;
        tmp_ctx.fillStyle = scope.color;

        tmp_canvas.on(drawStartEvent, function(e) {
          tmp_canvas.on(drawMoveEvent, onPaint);
          if(e){
            e.preventDefault();
            updateMousePos(e);
          }

          ppts.push({x: mouse.x, y: mouse.y});

          onPaint();
        });

        tmp_canvas.on(drawEndEvent, function(e) {
          tmp_canvas.off(drawMoveEvent, onPaint);

          ctx.globalCompositeOperation = 'source-over';

          // Writing down to real canvas now
          ctx.drawImage(tmp_canvas[0], 0, 0);
          // Clearing tmp canvas
          tmp_ctx.clearRect(0, 0, tmp_canvas[0].width, tmp_canvas[0].height);

          // Emptying up Pencil Points
          ppts = [];

          endDrawing();
        });

        var onPaint = function() {
          tmp_ctx.strokeStyle = scope.color;
          tmp_ctx.fillStyle = scope.color;
          tmp_ctx.lineWidth = scope.lineWidth;

          // Saving all the points in an array
          ppts.push({x: mouse.x, y: mouse.y});

          if (ppts.length < 3) {
            var b = ppts[0];
            tmp_ctx.beginPath();
            //ctx.moveTo(b.x, b.y);
            //ctx.lineTo(b.x+50, b.y+50);
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();

            return;
          }

          // Tmp canvas is always cleared up before drawing.
          tmp_ctx.clearRect(0, 0, tmp_canvas[0].width, tmp_canvas[0].height);

          tmp_ctx.beginPath();
          tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

          for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
          }

          // For the last 2 points
          tmp_ctx.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
          );
          tmp_ctx.stroke();
        };

        canvas.on(drawStartEvent, function(e) {
          canvas.on(drawMoveEvent, onErase);

          if(e){
            e.preventDefault();
            updateMousePos(e);
          }

          ppts.push({x: mouse.x, y: mouse.y});

          onErase();
        });

        canvas.on(drawEndEvent, function(e) {
          canvas.off(drawMoveEvent, onErase);

          // Emptying up Pencil Points
          ppts = [];

          endDrawing();
        });

        var onErase = function() {

          // Saving all the points in an array
          ppts.push({x: mouse.x, y: mouse.y});

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(0,0,0,1)';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.lineWidth = scope.lineWidth;

          if (ppts.length < 3) {
            var b = ppts[0];
            ctx.beginPath();
            ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            ctx.fill();
            ctx.closePath();

            return;
          }

          ctx.beginPath();
          ctx.moveTo(ppts[0].x, ppts[0].y);

          for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
          }

          // For the last 2 points
          ctx.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
          );
          ctx.stroke();
        };

      },
      templateUrl: 'control/views/pulsetotem-canvas/pulsetotem-canvas.html'
    };
  }
  ]);
