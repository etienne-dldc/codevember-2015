$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
    };

    p.draw = function draw() {
      p.background(0);
    };
  };

  var myp5 = new p5(sketch);

})
