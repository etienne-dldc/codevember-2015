$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var song, fft, analyzer, gui, setts;
    var globalRotate = 0;
    var songs = {};
    var slow = 0;
    var points = [];

    var Settings = function() {
      this.song = 'hello';
      this.maxPointSize = 30;
      this.minPointSize = 1;
      this.maxStrokeSize = 0.5;
      this.minStrokeSize = 0.1;
      this.pointStrokeLimit = 0.25;
      this.pointPaddingX = 30;
      this.pointPaddingY = -5;
      this.initDistance = 30;
      this.speed = 50;
      this.amplifier = 4;
      this.maxPoints = 200;
      this.rotation = true;
      this.rotationInvert = true;
      this.rotationSpeed = 120;
      this.clear = clearList;
      this.playPause = playPause;
      this.update();
    };
    Settings.prototype.update = function () {
      this.maxPointSizeWithPaddingX = this.maxPointSize + (2*this.pointPaddingX);
      this.maxPointSizeWithPaddingY = this.maxPointSize + (2*this.pointPaddingY);
    };

    p.preload = function() {
      songs['of-monsters-and-men'] = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/musics/of-monsters-and-men.mp3');
      songs['hello'] = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/musics/hello.mp3');
      songs['moustache'] = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/musics/moustache.mp3');
    }

    p.setup = function setup() {
      setts = new Settings();
      // dat-gui
      gui = new dat.GUI();
      gui.add(setts, 'playPause');
      var controller = gui.add(setts, 'song', _.map(songs, function (val, key) { return key }));
      controller.onFinishChange( initSong );
      gui.add(setts, 'clear');
      gui.add(setts, 'minPointSize', 0.1, 40);
      gui.add(setts, 'maxPointSize', 0.1, 40);
      gui.add(setts, 'minStrokeSize', 0.1, 20);
      gui.add(setts, 'maxStrokeSize', 0.1, 20);
      gui.add(setts, 'pointStrokeLimit', 0, 1);
      gui.add(setts, 'amplifier', 0.5, 30);
      gui.add(setts, 'pointPaddingX', -10, 60);
      gui.add(setts, 'pointPaddingY', -10, 60);
      gui.add(setts, 'initDistance', 30, 300);
      gui.add(setts, 'maxPoints', 200, 3000);
      gui.add(setts, 'speed', 1, 100);
      gui.add(setts, 'rotationSpeed', 1, 400);
      gui.add(setts, 'rotation');
      gui.add(setts, 'rotationInvert');
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(winWidth/2, winHeight/2);
      p.background(getFlatColor('wetasphalt'));

      fft = new p5.FFT();
      analyzer = new p5.Amplitude();

      initSong();

      clearList();
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

    function initSong() {
      if (song) {
        song.stop();
      }
      song = songs[setts.song];
      song.loop();
      fft.setInput(song);
      analyzer.setInput(song);

      clearList();
    }

    function playPause() {
      if ( song.isPlaying() ) {
        song.pause();
        p.noLoop();
      } else {
        song.loop();
        p.loop();
      }
    }

    function clearList() {
      points = [];
      for (var i = 0; i < setts.maxPoints; i++) {
        points.push({
          size: 0,
          color: 'rgba(0, 0, 0, 0)'
        });
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
      if (data === null) {
        return;
      }
      if (data.size > setts.pointStrokeLimit ) {
        p.noFill();
        p.stroke(data.color);
        var strokeWeight = setts.minStrokeSize + (data.size * (setts.maxStrokeSize - setts.minStrokeSize));
        strokeWeight = strokeWeight * setts.amplifier;
        p.strokeWeight(strokeWeight);
      } else {
        p.fill(data.color);
        p.noStroke();
      }
      var size = p.map(data.size, 0, 1, setts.minPointSize, setts.maxPointSize);
      size = size * setts.amplifier;
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
      var size = amplitude;
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
