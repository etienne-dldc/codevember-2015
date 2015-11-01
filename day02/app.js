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
    var lastTtl;

    var Settings = function() {
      this.followMouse = true;
      this.clear = clear;
      this.stop = stop;
      this.probaLeft = 0.53;
      this.probaRight = 0.53;
      this.probaTop = 0.53;
      this.probaBottom = 0.53;
      this.maxTimeToLive = 3000;
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
      gui.add(setts, 'clear');
      gui.add(setts, 'stop');
      gui.add(setts, 'maxTimeToLive', 0, 10000);
      var f1 = gui.addFolder('No follow mode');
      f1.add(setts, 'probaLeft', 0, 1);
      f1.add(setts, 'probaRight', 0, 1);
      f1.add(setts, 'probaTop', 0, 1);
      f1.add(setts, 'probaBottom', 0, 1);

      p.background(getFlatColor('wetasphalt'));

      for (var i = 0; i < p.width; i++) {
        pixGrid[i] = [];
      }

      // click
      $(p.canvas).click(function(event) {
        drawPiwel(p.mouseX, p.mouseY, 0);
      });

      p.noLoop();
    };

    p.mouseMoved = function () {
      mX = p.mouseX;
      mY = p.mouseY;
    }

    function clear() {
      p.background(getFlatColor('wetasphalt'));
      for (var i = 0; i < p.width; i++) {
        pixGrid[i] = [];
      }
    }

    function stop() {
      lastTtl = setts.maxTimeToLive;
      setts.maxTimeToLive = 0;
      window.setTimeout(function () {
         setts.maxTimeToLive = lastTtl;
      }, 100);
    }

    function drawPiwel(x, y, ttl) {
      if (x < p.width && x > 0 && y < p.height && y > 0) {
        if (pixGrid[x][y] !== 1) {
          p.noStroke();
          p.fill(getFlatColor('clouds'));
          pixGrid[x][y] = 1;
          p.rect(x, y, 1, 1);
          ttl = ttl + 1;

          if (ttl > setts.maxTimeToLive) {
            return;
          }

          (function(x, y) {
            window.setTimeout(function () {

              if (setts.followMouse) {
                var leftForce = (mX - x) / (p.width); // -1 -> 1
                var topForce = (mY - y) / (p.height); // -1 -> 1
                leftForce = p.map(leftForce, -1, 1, 1, 0);
                topForce = p.map(topForce, -1, 1, 1, 0);
                var leftProb = leftForce;
                var rightProb = 1 - leftForce;
                var topProb = topForce;
                var bottomProb = 1 - topForce;
              } else {
                var leftProb = setts.probaLeft;
                var rightProb = setts.probaRight;
                var topProb = setts.probaTop;
                var bottomProb = setts.probaBottom;
              }

              if (ttl < 20) {
                var ttlAdd = p.map(ttl/20, 0, 1, 0.2, 0 );
                leftProb = leftProb + ttlAdd;
                rightProb =  rightProb + ttlAdd;
                topProb =  topProb + ttlAdd;
                bottomProb =  bottomProb + ttlAdd;
              }
              if (ttl/setts.maxTimeToLive > 0.5) {
                var ttlMultiplier = p.map(ttl/setts.maxTimeToLive, 0.5, 1, 1, 0 );
                leftProb = leftProb * ttlMultiplier;
                rightProb =  rightProb * ttlMultiplier;
                topProb =  topProb * ttlMultiplier;
                bottomProb =  bottomProb * ttlMultiplier;
              }


              if ( leftProb > p.random() ) { drawPiwel(x-1, y, ttl) } // Left
              if ( rightProb > p.random() ) { drawPiwel(x+1, y, ttl) } // Right
              if ( topProb > p.random() ) { drawPiwel(x, y-1, ttl) } // Top
              if ( bottomProb > p.random() ) { drawPiwel(x, y+1, ttl) } // Bottom
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
