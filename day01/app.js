$(function () {

  var sketch = function( p ) {

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

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(winWidth/2, winHeight/2);
    };

    p.draw = function draw() {
      p.background(0);
      p.fill(255);
      p.ellipse(0,0,200, 200);
    };
  };

  var myp5 = new p5(sketch);

})
