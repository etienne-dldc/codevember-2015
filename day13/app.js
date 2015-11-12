'use strict';

$(function () {

  var winHeight = $(window).height();
  var winWidth = $(window).width();
  var halfWinHeight = winHeight/2;
  var halfWinWidth = winWidth/2;

  var planets = false;
  var rocket = false;
  var back = false;

  new p5(rocketCanvas);
  new p5(backCanvas);
  new p5(planetsCanvas);

  var Settings = function() {
  };
  var setts = new Settings();

  function planetsCanvas( p ) {


    p.setup = function setup() {
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
    };

    p.draw = function() {

    }

  };


  function backCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
      p.noLoop();

      p.background('rgb(50, 32, 88)');

      back = p;
    };
  };

  function rocketCanvas ( p ) {
    p.setup = function setup() {
      // Init canvas
      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);
      p.noLoop();

      rocket = p;
    };
  };

  /**
  * Classes
  **/
  var Planet, Rocket, WorldObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;
  var Vector = p5.Vector;

  WorldObject = (function() {
    function WorldObject() {
      this.location = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.acceleration = new Vector(0, 0);
    }

    WorldObject.prototype.update = function() {
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
    };

    return WorldObject;

  })();

  Planet = (function(superClass) {
    extend(Planet, superClass);

    function Planet() {
      return Planet.__super__.constructor.apply(this, arguments);
    }

    return Planet;

  })(WorldObject);

  Rocket = (function(superClass) {
    extend(Rocket, superClass);

    function Rocket() {
      return Rocket.__super__.constructor.apply(this, arguments);
    }

    return Rocket;

  })(WorldObject);


});
