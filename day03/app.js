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

  var Settings = function() {
    this.mode = 'video';
    this.size = 800;
  };
  Settings.prototype.update = function () {
  };

  var main = false;
  var work = false;
  var captureFlow;
  var capture = false;
  var ratio = false;
  var pixModelImage;
  var result;

  var workP5 = new p5(workCanvas);
  var mainP5 = new p5(mainCanvas);

  function mainCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      main = p;
      p.createCanvas(winWidth, winHeight);
      p.translate(winWidth/2, winHeight/2);
      p.scale(-1, 1);
      // dat-gui
      setts = new Settings();
      gui = new dat.GUI();
      gui.add(setts, 'mode', ['video', 'recursiveVideo'])
      gui.add(setts, 'size', 200, 1000)

      captureFlow = p.createCapture(p.VIDEO);
      captureFlow.hide();

      $(p.canvas).click(function() {
        setts.mode = (setts.mode == 'video') ? 'recursiveVideo' : 'video';
      });

    };

    p.draw = function () {
      p.background(getFlatColor('wetasphalt'));

      if (captureFlow.time() > 0) {
        if (ratio === false) {
          ratio = captureFlow.width / captureFlow.height;
        }
        capture = captureFlow.get();
        if (setts.mode === 'video') {
          p.image(capture, -setts.size/2, -(setts.size/ratio)/2, setts.size, setts.size/ratio );
        } else
        if (setts.mode === 'recursiveVideo') {
          createPixModel(20, 20);
          result = generateRecursive(capture, setts.size, setts.size/ratio);
          p.image(result, -result.width/2, -result.height/2);
        }
      }

    }

    function createPixModel(width, height) {
      work.image(capture, 0, 0, width, height);
      pixModelImage = work.get(0, 0, width, height);
    }

    function generateRecursive(source, width, height) {
      var pixelWidth = width / pixModelImage.width;
      var pixelHeight = height / pixModelImage.height;
      // Create pixelImageResized
      work.image(source, 0, 0, pixelWidth, pixelHeight);
      var pixelImageResized = work.get(0, 0, pixelWidth, pixelHeight);

      work.resizeCanvas(width, height);
      for (var i = 0; i < pixModelImage.width; i++) {
        for (var j = 0; j < pixModelImage.height; j++) {
          var left = i * pixelWidth;
          var top = j * pixelHeight;
          var colorPix = pixModelImage.get(i, j);
          var color = work.color(colorPix[0], colorPix[1], colorPix[2] );
          work.fill(color);
          work.noTint();
          work.rect(left, top, pixelWidth, pixelHeight);
          work.tint(255, 128);
          work.image(pixelImageResized, left, top, pixelWidth, pixelHeight);
        }
      }
      return work.get(0, 0, width, height);
    }
  };

  function workCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      work = p;
      $(p.canvas).css('display', 'none');
      p.noLoop();
      p.noStroke();
    };
  };

})
