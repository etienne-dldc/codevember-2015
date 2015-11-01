$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var song1, song2, fft, analyzer, gui, setts;
    var globalRotate = 0;
    var slow = 0;
    var points = [];

    var Settings = function() {
      this.maxPointSize = 30;
      this.pointPaddingX = 30;
      this.pointPaddingY = -5;
      this.initDistance = 4;
      this.speed = 50;
      this.amplifier = 4;
      this.maxPoints = 200;
      this.rotation = true;
      this.rotationInvert = true;
      this.rotationSpeed = 120;
      this.pointStrokeLimitMultiplier = 0.15;
      this.playPause = function playPause() {
        if ( song.isPlaying() ) { // .isPlaying() returns a boolean
          song.pause();
          p.noLoop();
        } else {
          song.play();
          p.loop();
        }
      }
      this.update();
    };
    Settings.prototype.update = function () {
      this.maxPointSizeWithPaddingX = this.maxPointSize + (2*this.pointPaddingX);
      this.maxPointSizeWithPaddingY = this.maxPointSize + (2*this.pointPaddingY);
      this.pointStrokeLimit = this.maxPointSize * this.pointStrokeLimitMultiplier;
    };

    p.preload = function() {
      song1 = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/day-01/music-01.mp3');
      song2 = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/day-01/hello.mp3');
    }

    p.setup = function setup() {
      var song  = song2;

      setts = new Settings();
      // dat-gui
      gui = new dat.GUI();
      gui.add(setts, 'playPause');
      gui.add(setts, 'maxPointSize', 1, 40);
      gui.add(setts, 'amplifier', 0.5, 30);
      gui.add(setts, 'pointPaddingX', -10, 30);
      gui.add(setts, 'pointPaddingY', -10, 30);
      gui.add(setts, 'initDistance', 1, 300);
      gui.add(setts, 'maxPoints', 200, 3000);
      gui.add(setts, 'speed', 1, 100);
      gui.add(setts, 'rotationSpeed', 1, 400);
      gui.add(setts, 'pointStrokeLimitMultiplier', 0.01, 1);
      gui.add(setts, 'rotation');
      gui.add(setts, 'rotationInvert');
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(winWidth/2, winHeight/2);
      song.play();
      p.background(getFlatColor('wetasphalt'));
      fft = new p5.FFT();
      fft.setInput(song);
      analyzer = new p5.Amplitude();
      analyzer.setInput(song);
    };

    p.draw = function() {
      slow = slow + (setts.speed / 100);
      if (slow >= 1) {
        slow = slow % 1;
        p.background(getFlatColor('midnightblue'));
        var spectrum = fft.analyze();
        spectrum = spectrum.slice(100, 800);
        var amplitude = analyzer.getLevel();
        addPoint(amplitude, spectrum);
        setts.update();
        drawSpiral();
      }
    }

    function drawSpiral() {
      // Find final rotate angle
      p.push();
        if (setts.rotation) {
          if (setts.rotationInvert) {
            globalRotate -= (setts.rotationSpeed / 2000);
          } else {
            globalRotate += (setts.rotationSpeed / 2000);
          }
          p.rotate(globalRotate);
        }
        angle = 0;
        for (var i = 0; i < points.length; i++) {
          var nbrOrTurn = angle/(2*p.PI);
          var distance = setts.initDistance + (nbrOrTurn * setts.maxPointSizeWithPaddingX);
          var circonference = (distance*2) * p.PI;
          var nbrOfCircle = circonference / setts.maxPointSizeWithPaddingY;
          var incrementAngle = (2*p.PI) / nbrOfCircle;
          angle = angle + incrementAngle;

          var x = p.sin(angle)*distance;
          var y = p.cos(angle)*distance;
          displayPoints(points[i], x, y);
        }
      p.pop();
    }

    function displayPoints(data, x, y) {
      var size = data.size * setts.amplifier;
      if (data.size > setts.pointStrokeLimit ) {
        p.noFill();
        p.stroke(data.color);
        p.strokeWeight(p.map(setts.pointStrokeLimit, setts.maxPointSize, 1, setts.maxPointSize/2));
      } else {
        p.fill(data.color);
        p.noStroke();
      }
      p.ellipse(x,y, size, size);
    }

    function getMaxFreqGroup(data, nbrOfGroups) {
      var groupedFreq = groupFreq(data, nbrOfGroups);
      return groupedFreq.indexOf(_.max(groupedFreq));
    }

    function groupFreq(data, nbrOfGroups) {
      var result = [];
      var size = p.floor(data.length / nbrOfGroups);
      for (var i = 0; i < (data.length - size ) ; i += size) {
        var start = i;
        var end = start + size;
        var sum = 0;
        for (var j = start; j < end; j++) {
          sum += data[j];
        }
        result.push(p.floor(sum/size));
      }
      return result;
    }

    function addPoint(amplitude, spectrum) {
      var maxFreqGroup = getMaxFreqGroup(spectrum, 100);
      var colors = getFlatColorArray(['turquoise','emerland', 'peterriver', 'amethyst', 'greensea', 'nephritis', 'belizehole', 'wisteria', 'sunflower', 'carrot', 'alizarin', 'clouds', 'concrete', 'orange', 'pumpkin', 'pomegranate', 'silver', 'asbestos']);
      var colorIndex = p.floor(maxFreqGroup % colors.length);
      var color = colors[colorIndex];
      var size = p.map(amplitude, 0, 1, 0, setts.maxPointSize);
      points.push({
        size: size,
        color: color
      });
      if (points.length > setts.maxPoints) {
        points = points.slice(-setts.maxPoints);
      }
    }

    function getFlatColor(name) {
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

  };

  var myp5 = new p5(sketch);

})
