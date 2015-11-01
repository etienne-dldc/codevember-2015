$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var song;
    var levels = [];
    var isPlaying = true;

    var Settings = function() {
      this.playPause = playPause;
      this.centerAmplitude = 1;
      this.sidesAmplitude = 1;
      this.zoom = 3;
      this.zoomVariation = 2;
    };

    p.preload = function() {
      song = p.loadSound('http://codepen.twik-labs.fr/codevember-2015/musics/moustache.mp3');
    }

    p.setup = function setup() {
      setts = new Settings();
      // dat-gui
      gui = new dat.GUI();
      gui.add(setts, 'playPause');
      gui.add(setts, 'centerAmplitude', 1, 10);
      gui.add(setts, 'sidesAmplitude', 1, 10);
      gui.add(setts, 'zoom', 1, 10);
      gui.add(setts, 'zoomVariation', 0, 5);

      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(winWidth/2, winHeight/2);
      song.loop();
      fft = new p5.FFT();
      fft.setInput(song);
      analyzer = new p5.Amplitude();
      analyzer.setInput(song);
    };

    p.draw = function() {
      p.background(getFlatColor('wetasphalt'));
      var level = analyzer.getLevel();
      levels.push(level);
      if (levels.length > 40) {
        levels = levels.slice(-40);
      }
      var zoom = 0;
      for (var i = 0; i < levels.length; i++) {
        zoom += levels[i];
      }
      zoom = zoom/levels.length;
      zoom  = zoom;


      var data = fft.analyze();
      var sum = 0;
      for (var i = 0; i < 300; i++) {
        sum += data[i];
      }
      var dist2 = p.map(sum/300, 0, 255, 0, 10);
      dist2 = dist2 * setts.centerAmplitude;

      var sum = 0;
      for (var i = 300; i < 800; i++) {
        sum += data[i];
      }
      var dist = p.map(sum/500, 0, 255, 0, 40);
      dist = dist * setts.sidesAmplitude;

      p.push()
        p.scale(setts.zoom+setts.zoomVariation*zoom, setts.zoom+setts.zoomVariation*zoom);
        p.fill(255);
        p.noStroke();
        p.beginShape();
          p.vertex(41,-4.5);
          p.bezierVertex(28.8,-13.1,8.8,-25-dist2,0,-11-dist2);
          p.bezierVertex(-8.8,-25-dist2,-28.8,-13.1,-41,-4.5);
          p.bezierVertex(-58.5,7.8,-110,-11-dist,-110,-11-dist);
          p.bezierVertex(-110,-11-dist,-82.5,17.2,-40,17);
          p.bezierVertex(-17.2,16.9,0,6-dist2,0,6-dist2);
          p.bezierVertex(0,6-dist2,17.2,16.9,40,17);
          p.bezierVertex(82.5,17.2,110,-11-dist,110,-11-dist);
          p.bezierVertex(110,-11-dist,58.5,7.8,41,-4.5);
        p.endShape();
      p.pop();
    }

    function playPause() {
      if (isPlaying) {
        isPlaying = false;
        song.pause();
      } else {
        isPlaying = true;
        song.loop();
      }
    }

    function drawMustache() {

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
