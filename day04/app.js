'use strict';

$(function () {

  var winHeight = $(window).height();
  var winWidth = $(window).width();

  var flatColors = [
    { name: 'turquoise', color : '#1abc9c' },
    { name: 'emerland', color : '#2ecc71' },
    { name: 'peterriver', color : '#3498db' },
    { name: 'amethyst', color : '#9b59b6' },
    { name: 'wetasphalt', color : '#34495e' },
    { name: 'greensea', color : '#16a085' },
    { name: 'nephritis', color : '#27ae60' },
    { name: 'belizehole', color : '#2980b9' },
    { name: 'wisteria', color : '#8e44ad' },
    { name: 'midnightblue', color : '#2c3e50' },
    { name: 'sunflower', color : '#f1c40f' },
    { name: 'carrot', color : '#e67e22' },
    { name: 'alizarin', color : '#e74c3c' },
    { name: 'clouds', color : '#ecf0f1' },
    { name: 'concrete', color : '#95a5a6' },
    { name: 'orange', color : '#f39c12' },
    { name: 'pumpkin', color : '#d35400' },
    { name: 'pomegranate', color : '#c0392b' },
    { name: 'silver', color : '#bdc3c7' },
    { name: 'asbestos', color : '#7f8c8d' },
  ];

  var mainP5 = new p5(mainCanvas);

  function mainCanvas ( p ) {

    var Settings = function() {
      this.gridScaleY = 40;
      this.topPadding = 100;
      this.moveSpeed = 0.01;
      this.moveForce = 10;
      this.initHeight = 5;
      this.update();
    };
    Settings.prototype.update = function () {
      this.gridScaleX = this.gridScaleY * p.sqrt(3);
    };

    var setts, nbrWidth, nbrHeight, paddingLeft, paddingTop;
    var elems = [];
    var noisePosition = 0;

    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
      // dat-gui
      setts = new Settings();
      var gui = new dat.GUI();
      var controller1 = gui.add(setts, 'topPadding', 0, 400);
      controller1.onFinishChange( fitGrid );
      var controller2 = gui.add(setts, 'gridScaleY', 10, 60);
      controller2.onFinishChange( fitGrid );
      var controller3 = gui.add(setts, 'initHeight', 0, 20);
      controller3.onFinishChange( fitGrid );
      gui.add(setts, 'moveSpeed', 0.01, 0.1);
      gui.add(setts, 'moveForce', 0, 20);
      fitGrid();

    };

    p.draw = function () {
      p.background(getFlatColor('wetasphalt'));

      setts.update();

      noisePosition += setts.moveSpeed;

      for (var j = 0; j <= nbrHeight; j++) {
        for (var i = 0; i <= nbrWidth; i++) {
          if ( elems[i][j] ) {
            var elem = elems[i][j];
            var newHeight = elem.initHeight + (p.noise( (i*50.3+j) + noisePosition) * setts.moveForce);
            var coord = hexGrid(elem.x, elem.y);
            var mouseDist = p.dist(coord.x, coord.y, p.mouseX - paddingLeft, p.mouseY - paddingTop);
            if (mouseDist < 200) {
              newHeight = newHeight * (mouseDist / 200);
            }
            elem.height = newHeight;
            drawElem(elem);
          }
        }
      }

    }

    p.windowResized = function () {
      winHeight = $(window).height();
      winWidth = $(window).width();
      p.resizeCanvas(winWidth, winHeight);

      fitGrid();

    }

    function drawElem(elem) {
      var coord = hexGrid(elem.x, elem.y);
      p.noStroke();
      var height = elem.height * setts.gridScaleY;
      // Left
      var leftPoints = [
        [coord.x - setts.gridScaleX, coord.y],
        [coord.x, coord.y + setts.gridScaleY],
        [coord.x, (coord.y + setts.gridScaleY) - height],
        [coord.x - setts.gridScaleX, coord.y - height]
      ];
      drawShape(leftPoints, 'rgb(217, 217, 217)');
      // Right
      var rightPoints = [
        [coord.x + setts.gridScaleX, coord.y],
        [coord.x, coord.y + setts.gridScaleY],
        [coord.x, coord.y - setts.gridScaleY - height],
        [coord.x + setts.gridScaleX, coord.y - height]
      ];
      drawShape(rightPoints, 'rgb(148, 145, 145)');
      // Top
      var topPoints = [
        [coord.x - setts.gridScaleX, coord.y - height],
        [coord.x, coord.y - setts.gridScaleY - height],
        [coord.x + setts.gridScaleX, coord.y - height],
        [coord.x, coord.y + setts.gridScaleY - height]
      ];
      drawShape(topPoints, 'rgb(255, 255, 255)');

    }

    function drawShape(points, color) {
      p.fill(color);
      p.beginShape();
      for (var i = 0; i < points.length; i++) {
        p.vertex(points[i][0], points[i][1]);
      }
      p.endShape();
    }

    function fitGrid() {
      nbrWidth = p.floor( p.width / setts.gridScaleX ) - 3;
      nbrHeight = p.floor( (p.height - setts.topPadding) / setts.gridScaleY ) - 3;
      paddingLeft = (p.width - ( nbrWidth * setts.gridScaleX )) / 2;
      paddingTop = (p.height - ( nbrHeight * setts.gridScaleY )) / 2 + setts.topPadding;

      p.pop();
      p.push();
        p.translate(paddingLeft, paddingTop);

        elems = [];
        for (var i = 0; i <= nbrWidth; i++) {
          elems[i] = [];
          for (var j = 0; j <= nbrHeight; j++) {
            if ( (i+j)%2 === 0 ) {
              elems[i][j] = {
                initHeight: p.floor(p.random(setts.initHeight)),
                x: i,
                y: j
              }
            } else {
              elems[i][j] = false;
            }
          }
        }
    }

    function hexGrid(x, y) {
      var x = x * setts.gridScaleX;
      var y = (y) * setts.gridScaleY;
      return {x:x, y:y};
    }

    function getFlatColor(name) {
      var color = _.find(flatColors, {name: name}, 'color');
      if (color == undefined) {
        throw new Error('Can\'t find color "' + name + '"');
        return;
      }
      return color.color;
    }

    function getFlatColorArray(list) {
      var result = [];
      for (var i = 0; i < list.length; i++) {
        result.push(getFlatColor(list[i]));
      }
      return result;
    }

    function getRandomFlatColor() {
      var index = p.floor(p.random(flatColors.length));
      return flatColors[index].color;
    }

    function getOneIn(list) {
      var index = p.floor(p.random(list.length));
      return list[index];
    }

    function getOneRandomColor(list) {
      return getOneIn(getFlatColorArray(list));
    }
  };


})
