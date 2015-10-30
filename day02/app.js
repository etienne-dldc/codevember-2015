$(function () {

  var sketch = function( p ) {

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

    var pixGrid = [];
    var mX = 0;
    var mY = 0;

    var Settings = function() {
      this.followMouse = true;
      this.probaLeft = 0.5;
      this.probaRight = 0.5;
      this.probaTop = 0.5;
      this.probaBottom = 0.5;
    };
    Settings.prototype.update = function () {
    };

    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      // dat-gui
      setts = new Settings();
      gui = new dat.GUI();
      gui.add(setts, 'followMouse');
      var f1 = gui.addFolder('No follow mode');
      f1.add(setts, 'probaLeft', 0, 1);
      f1.add(setts, 'probaRight', 0, 1);
      f1.add(setts, 'probaTop', 0, 1);
      f1.add(setts, 'probaBottom', 0, 1);

      console.log();

      p.background(getFlatColor('wetasphalt'));

      for (var i = 0; i < p.width; i++) {
        pixGrid[i] = [];
      }

      // click
      $(p.canvas).click(function(event) {
        var color = getFlatColor('clouds');
        drawPiwel(p.mouseX, p.mouseY, color);
      });

      p.noLoop();
    };

    p.mouseMoved = function () {
      mX = p.mouseX;
      mY = p.mouseY;
    }

    function drawPiwel(x, y) {
      if (x < p.width && x > 0 && y < p.height && y > 0) {
        if (pixGrid[x][y] !== 1) {
          p.noStroke();
          p.fill(getFlatColor('clouds'));
          pixGrid[x][y] = 1;
          p.rect(x, y, 1, 1);

          (function(x, y) {
            window.setTimeout(function () {

              if (setts.followMouse) {
                var leftForce = (mX - x) / (p.width); // -1 -> 1
                var topForce = (mY - y) / (p.height); // -1 -> 1
                leftForce = p.map(leftForce, -1, 1, 0, 1);
                topForce = p.map(topForce, -1, 1, 0, 1);
                var leftProb = leftForce;
                var rightProb = 1 - leftForce;
                var topProb = topForce;
                var bottomProb = 1 - topForce;
              } else {
                var leftProb = 1 - setts.probaLeft;
                var rightProb = 1 - setts.probaRight;
                var topProb = 1 - setts.probaTop;
                var bottomProb = 1 - setts.probaBottom;
              }
              if (p.random() > leftProb ) { drawPiwel(x-1, y) } // Left
              if (p.random() > rightProb ) { drawPiwel(x+1, y) } // Right
              if (p.random() > topProb ) { drawPiwel(x, y-1) } // Top
              if (p.random() > bottomProb ) { drawPiwel(x, y+1) } // Bottom
            }, 0);
          })(x, y);
        }
      }
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

  };

  var myp5 = new p5(sketch);

})
