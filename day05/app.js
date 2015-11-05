$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var song, fft, analyzer, gui, setts;
    var songs = {};
    var points = [];

    var Settings = function() {
      this.song = 'hello';
      this.playPause = playPause;
      this.nbrOfPoints = 100;
      this.sliceStart = 0;
      this.sliceEnd = 1000;
      this.decreaseSpeed = 0.96;
      this.amplifier = 1.5;
      this.update();
    };
    Settings.prototype.update = function () {
      this.sliceSize = this.sliceEnd - this.sliceStart;
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
      gui.add(setts, 'decreaseSpeed', 0.7, 0.99);
      gui.add(setts, 'amplifier', 0.5, 4);
      gui.add(setts, 'sliceStart', 0, 1000);
      gui.add(setts, 'sliceEnd', 0, 1000);
      gui.add(setts, 'nbrOfPoints', 5, 500);
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(0, winHeight/2);
      p.background(getFlatColor('clouds'));

      fft = new p5.FFT();
      analyzer = new p5.Amplitude();

      initSong();
    };

    p.draw = function() {
      p.background(getFlatColor('clouds'));
      var spectrum = fft.analyze();
      var amplitude = analyzer.getLevel();
      setts.update();
      spectrum = spectrum.slice(setts.sliceStart, setts.sliceEnd);
      var average = getSpectrumAverage(spectrum);
      var pIndex = p.map(average, 0, setts.sliceSize, 0, setts.nbrOfPoints);
      pIndex = Math.floor(pIndex);
      decreasePoints();
      points[pIndex] = amplitude;
      displayPoints();
    }

    function clearPoints() {
      points = [];
      for (var i = 0; i < setts.nbrOfPoints; i++) {
        points.push(0);
      }
    }

    function decreasePoints() {
      for (var i = 0; i < setts.nbrOfPoints; i++) {
        if (points[i] > 0.001) {
          points[i] = points[i] * setts.decreaseSpeed;
        } else {
          points[i] = 0;
        }
      }
    }

    function displayPoints() {
      var pointsLength = setts.nbrOfPoints;
      var elemWidth = winWidth / pointsLength;

      for (var i = 0; i < pointsLength; i++) {
        var height = p.map(points[i], 0, 1, 0, winHeight) * setts.amplifier;
        var color = p.color( p.map(i, 0, pointsLength, 0, 255) ,0 ,p.map(i, 0, pointsLength, 255, 0) );
        p.noStroke();
        p.fill(color)
        p.rect(elemWidth*i, -height/2, elemWidth, height);
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

      clearPoints();
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

    function getSpectrumAverage(spectrum) {
      var sum = 0;
      var coefs = 0;
      for (var i = 0; i < spectrum.length; i++) {
        sum += i * spectrum[i];
        coefs += spectrum[i];
      }
      return sum/coefs;
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
