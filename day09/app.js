'use strict';

$(function () {

  var winHeight = $(window).height();
  var winWidth = $(window).width();
  var halfWinHeight = winHeight/2;
  var halfWinWidth = winWidth/2;

  var back = false;
  var arrow = false;

  var backP5 = new p5(backCanvas);
  var arrowP5 = new p5(arrowCanvas);
  var blocks = new p5(blocksCanvas);

  var arrowRotation = 0;
  var arrowPosX, arrowPosY;
  var arrowRotationIncrement = 0;
  var blocksList = [];
  var distanceAnim = 0;
  var playPauseState = true;
  var lose = false;

  function blocksCanvas( p ) {

    var Settings = function() {
      this.speed = 3;
      this.arrowSpeed = 0.13;
      this.blocksDistance = 200;
      this.blockSize = 50;
      this.arrowSize = 10;
      this.playPause = playPause;
      this.arrowDistance = 100;
      this.centerSize = 70;
    };
    var setts = new Settings();
    var gui = new dat.GUI();
    $(gui.domElement).parent().css('z-index', '100');
    gui.add(setts, 'speed', 1, 20);
    gui.add(setts, 'arrowSpeed', 0.01, 0.5);
    gui.add(setts, 'blocksDistance', 20, 500);
    gui.add(setts, 'blockSize', 1, 200);
    gui.add(setts, 'arrowSize', 1, 50);
    gui.add(setts, 'arrowDistance', 50, 500);
    gui.add(setts, 'centerSize', 0, 500);
    gui.add(setts, 'playPause');

    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);

      window.myP5 = p;

      $(back.canvas).css('z-index', '10');
      $(arrow.canvas).css('z-index', '12');
      $(p.canvas).css('z-index', '11');

      $('.lose, canvas').click(restart);
    };

    p.draw = function() {

      // Update distanceAnim
      distanceAnim += setts.speed;
      if (distanceAnim > setts.blocksDistance) {
        distanceAnim = 0;
        blocksList.shift();
      }

      // Add blocks
      if (blocksList.length < 10) {
        addBlocks();
      }

      // Display blocks
      clear(p);
      displayBlocks();

      // Update arrow position
      arrowRotation = (arrowRotation + arrowRotationIncrement) % p.TWO_PI;

      // Clear arrow
      arrow.background(100);
      clear(arrow);

      // Display arrow
      arrow.fill(255);
      arrow.noStroke();
      arrowPosX = setts.arrowDistance * p.cos(arrowRotation);
      arrowPosY = setts.arrowDistance * p.sin(arrowRotation);
      arrow.ellipse(arrowPosX, arrowPosY, setts.arrowSize, setts.arrowSize);

      // detect collision
      if ( detectCollision() ) {
        p.noLoop();
        lose = true;
        $('.lose').fadeIn(300);
      }
    }

    p.keyPressed = function () {
      if (p.keyCode == p.LEFT_ARROW) {
        arrowRotationIncrement = -setts.arrowSpeed;
      } else
      if (p.keyCode == p.RIGHT_ARROW) {
        arrowRotationIncrement = setts.arrowSpeed;
      }
    }

    p.keyReleased = function () {
      arrowRotationIncrement = 0;
      if (p.keyIsPressed === true) {
        if (p.keyCode == p.LEFT_ARROW) {
          arrowRotationIncrement = -setts.arrowSpeed;
        } else
        if (p.keyCode == p.RIGHT_ARROW) {
          arrowRotationIncrement = setts.arrowSpeed;
        }
      }
    }

    function clear(p5elem) {
       p5elem.drawingContext.clearRect(-winWidth, -winHeight, 2*winWidth, 2*winHeight);
    }

    function restart() {
      $('.lose').fadeOut('400');
      blocksList = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ];
      arrowRotation = 0;
      p.loop();
    }

    function addBlocks() {
      var blocksCombo = [
        [
          [0, 1, 1, 0, 1, 1],
          [0, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1],
          [0, 1, 1, 1, 1, 1]
        ],
        [
          [0, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 1],
          [1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 0]
        ],
        [
          [1, 0, 1, 1, 0, 1],
          [0, 1, 1, 0, 1, 1],
          [1, 1, 0, 1, 1, 0],
          [1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1]
        ],
        [
          [1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1],
        ],
        [
          [1, 0, 1, 1, 0, 1],
        ],
        [
          [1, 1, 1, 1, 0, 1],
        ],
        [
          [0, 0, 1, 1, 0, 1],
        ]
      ]

      var combo = blocksCombo[Math.floor(Math.random() * blocksCombo.length)];
      for (var i = 0; i < combo.length; i++) {
        blocksList.push(combo[i]);
      }
    }

    function displayBlocks() {
      var distance = -distanceAnim;
      for (var i = 0; i < blocksList.length ; i++) {
        if (distance > 0) {
          displayBlock(blocksList[i], distance);
        }
        distance += setts.blocksDistance;
      }
      // Center
      p.noStroke();
      p.fill(255);
      p.beginShape();
      for (var i = 0; i < 6; i++) {
        var angle = i * (p.PI/3);
        var px = setts.centerSize * p.cos(angle);
        var py = setts.centerSize * p.sin(angle);
        p.vertex(px, py);
      }
      p.endShape(p.CLOSE);
    }

    function displayBlock(block, distance) {
      p.noStroke();
      p.fill(255);
      for (var i = 0; i < block.length; i++) {
        if (block[i] === 1) {
          var angleStart = i * (p.PI/3);
          var angleEnd = (i+1) * (p.PI/3);
          p.beginShape();
          var p1x = distance * p.cos(angleStart);
          var p1y = distance * p.sin(angleStart);
          p.vertex(p1x, p1y);
          var p2x = (distance + setts.blockSize) * p.cos(angleStart);
          var p2y = (distance + setts.blockSize) * p.sin(angleStart);
          p.vertex(p2x, p2y);
          var p3x = (distance + setts.blockSize) * p.cos(angleEnd);
          var p3y = (distance + setts.blockSize) * p.sin(angleEnd);
          p.vertex(p3x, p3y);
          var p4x = distance * p.cos(angleEnd);
          var p4y = distance * p.sin(angleEnd);
          p.vertex(p4x, p4y);
          p.endShape(p.CLOSE);
        }
      }
    }

    function detectCollision() {
      var x = Math.floor(arrowPosX - setts.arrowSize/2 + halfWinWidth);
      var width = setts.arrowSize;
      var y = Math.floor(arrowPosY - setts.arrowSize/2 + halfWinHeight);
      var height = setts.arrowSize;
      // var arrowPixs = arrow.canvas.getContext('2d').getImageData(x, y, width, height);
      var arrowPixs = arrow.canvas.getContext('2d').getImageData(x*2, y*2, width*2, height*2);
      var blocksPixs = p.canvas.getContext('2d').getImageData(x*2, y*2, width*2, height*2);
      for (var i = 0; i < arrowPixs.data.length; i = i + 1 ) {
        if (arrowPixs.data[i] > 0 && blocksPixs.data[i] > 0) {
          return true;
        }
      }
      return false;
    }

    function playPause() {
      if (playPauseState) {
        p.noLoop();
      } else {
        p.loop();
      }
      playPauseState = !playPauseState;
    }


  };


  function backCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
      p.noLoop();

      p.background(0);

      back = p;
    };
  };

  function arrowCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
      p.noLoop();
      arrow = p;
    };
  };

})
