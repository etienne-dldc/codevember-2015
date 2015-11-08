'use strict';

$(function () {

  var winHeight = $(window).height();
  var winWidth = $(window).width();
  var halfWinHeight = winHeight/2;
  var halfWinWidth = winWidth/2;

  var mainP5 = new p5(mainCanvas);

  function mainCanvas( p ) {

    var Settings = function() {
    };
    var setts = new Settings();
    var gui = new dat.GUI();

    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
    };

    p.draw = function() {
      
    }

  };

})
