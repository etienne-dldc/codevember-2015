$(function () {

  var sketch = function( p ) {

    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var halfWinHeight = winHeight/2;
    var halfWinWidth = winWidth/2;

    var cube, cubeBis, mainCamera;
    var rotationX = 0;
    var rotationY = 0;
    var orientationX = 0;
    var orientationY = 0;
    var move = false;

    var Settings = function() {
      this.perspective = 72;
      this.cubeCenterZ = 200;
      this.cubeRedCenterZ = 200;
      this.cubeSize = 100;
      this.turnAround = true;
    };

    p.setup = function setup() {
      setts = new Settings();
      gui = new dat.GUI();
      gui.add(setts, 'perspective', 0, 150);
      gui.add(setts, 'cubeRedCenterZ', -300, 1000);
      gui.add(setts, 'cubeCenterZ', -300, 1000);
      gui.add(setts, 'cubeSize', 50, 500);
      gui.add(setts, 'turnAround');

      p.createCanvas(winWidth, winHeight);
      p.push();
      p.translate(halfWinWidth, halfWinHeight);

      mainCamera = new Camera();
      mainCamera.setCenter(0, 0, -2000);

      cube = new Cube();
      cube.setCenter(-200, 0, 0);
      cube.setSize(100);
      mainCamera.addSubElement(cube);

      cubeBis = new Cube();
      cubeBis.setCenter(200, 0, 0);
      cubeBis.setSize(100);
      mainCamera.addSubElement(cubeBis);

      $(p.canvas).on('mousedown', function() {
        move = true;
      });

    };

    p.draw = function() {
      p.background(255)

      cube.setCenter(0, 0, setts.cubeCenterZ);
      cube.setSize(setts.cubeSize);

      cubeBis.center.z = setts.cubeRedCenterZ;

      mainCamera.setPerspective(setts.perspective);

      // cube.setRotationY( p.map(p.mouseX, 0, winWidth, p.PI, -p.PI) );
      // cube.setRotationX( p.map(p.mouseY, 0, winHeight, -p.PI, p.PI) );
      //

      if (move) {
        orientationX = p.map(p.mouseY, 0, winHeight, p.PI/3, -p.PI/3);
        orientationY = p.map(p.mouseX, 0, winWidth, -p.PI/3, p.PI/3);
      }
      if (setts.turnAround) {
        rotationX = orientationX;
        rotationY = orientationY;
      } else {
        rotationX = 0;
        rotationY = 0;
      }
      mainCamera.setOrientationX( orientationX );
      mainCamera.setOrientationY( orientationY );
      mainCamera.setRotationX( rotationX );
      mainCamera.setRotationY( rotationY );

      // draw
      p.noFill();
      p.strokeCap(p.ROUND);
      p.strokeWeight(1);

      p.stroke(0, 0, 0);
      cube.draw(mainCamera);

      p.stroke(255, 0, 0);
      cubeBis.draw(mainCamera);

    }

    p.mouseReleased = function () {
      move = false;
    }

    // Add 3D rotation to p5.Vector
    p5.Vector.prototype.rotateX = function (angle) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      this.y = y * Math.cos(angle) - z * Math.sin(angle);
      this.z = y * Math.sin(angle) + z * Math.cos(angle);
    };
    p5.Vector.prototype.rotateY = function (angle) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      this.x = x * Math.cos(angle) + z * Math.sin(angle);
      this.z = -x * Math.sin(angle) + z * Math.cos(angle);
    };
    p5.Vector.prototype.rotateZ = function (angle) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      this.x = x * Math.cos(angle) - y * Math.sin(angle);
      this.y = x * Math.sin(angle) + y * Math.cos(angle);
    };
    p5.Vector.prototype.setParent = function (parent) {
      this.parent = parent;
    };

    var extend = function(child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }

    var SpaceElement = (function() {
      function SpaceElement(name) {
        this.center = p.createVector(0, 0, 0);
        this.rotation = p.createVector(0, 0, 0);
        this.elements = [];
        this.parent = false;
      }
      SpaceElement.prototype.setCenter = function (x, y, z) {
        this.center = p.createVector(x, y, z);
      };
      SpaceElement.prototype.addSubElement = function (element) {
        element.setParent(this);
        this.elements.push(element);
      };
      SpaceElement.prototype.setParent = function (parent) {
        this.parent = parent;
      };
      SpaceElement.prototype.draw = function (camera) {
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].draw(camera);
        }
      };
      SpaceElement.prototype.rotateX = function (angle) {
        this.rotation.x = (this.rotation.x + angle) % (Math.PI*2);
      };
      SpaceElement.prototype.rotateY = function (angle) {
        this.rotation.y = (this.rotation.y + angle) % (Math.PI*2);
      };
      SpaceElement.prototype.rotateZ = function (angle) {
        this.rotation.z = (this.rotation.z + angle) % (Math.PI*2);
      };
      SpaceElement.prototype.setRotation = function (rotationVector) {
        this.rotation = rotationVector;
      };
      SpaceElement.prototype.setRotationX = function (angle) {
        this.rotation.x = (angle) % (Math.PI*2);
      };
      SpaceElement.prototype.setRotationY = function (angle) {
        this.rotation.y = (angle) % (Math.PI*2);
      };
      SpaceElement.prototype.setRotationZ = function (angle) {
        this.rotation.z = (angle) % (Math.PI*2);
      };
      SpaceElement.prototype.applyRotationAndPosition = function (vector) {
        vector.rotateX(this.rotation.x);
        vector.rotateY(this.rotation.y);
        vector.rotateZ(this.rotation.z);
        vector.add(this.center);
        if (this.parent) {
          return this.parent.applyRotationAndPosition(vector);
        } else {
          return vector;
        }
      };
      return SpaceElement;
    })();


    var Shape = (function(superClass) {
      extend(Shape, superClass);
      function Shape() {
        return Shape.__super__.constructor.apply(this, arguments);
      }
      Shape.prototype.addPoint = function (x, y, z) {
        this.addSubElement(p.createVector(x, y, z));
      };
      Shape.prototype.draw = function (camera) {
        p.beginShape();
        for (var i = 0; i < this.elements.length; i++) {
          var point = this.elements[i].copy();
          this.applyRotationAndPosition(point);
          point = camera.projection(point);
          p.vertex(point.x, point.y);
        }
        p.endShape(p.CLOSE);
      };
      return Shape;
    })(SpaceElement);


    var Cube = (function(superClass) {
      extend(Cube, superClass);
      function Cube() {
        this.size = 50;
        this.createFaces();
        return Cube.__super__.constructor.apply(this, arguments);
      }
      Cube.prototype.setSize = function (size) {
        this.size = size;
        this.createFaces();
      };
      Cube.prototype.createFaces = function () {
        this.elements = [];
        var s = this.size;
        var Xplus = new Shape();
        Xplus.setCenter(s, 0, 0);
        Xplus.addPoint(0, -s, -s);
        Xplus.addPoint(0,  s, -s);
        Xplus.addPoint(0,  s,  s);
        Xplus.addPoint(0, -s,  s);
        this.addSubElement(Xplus);
        Xmoins = new Shape();
        Xmoins.setCenter(-s, 0, 0);
        Xmoins.addPoint(0, -s, -s);
        Xmoins.addPoint(0, -s,  s);
        Xmoins.addPoint(0,  s,  s);
        Xmoins.addPoint(0,  s, -s);
        this.addSubElement(Xmoins);
        Yplus = new Shape();
        Yplus.setCenter(0, s, 0);
        Yplus.addPoint(-s, 0, -s);
        Yplus.addPoint( s, 0, -s);
        Yplus.addPoint( s, 0,  s);
        Yplus.addPoint(-s, 0,  s);
        this.addSubElement(Yplus);
        Ymoins = new Shape();
        Ymoins.setCenter(0, -s, 0);
        Ymoins.addPoint(-s, 0, -s);
        Ymoins.addPoint( s, 0, -s);
        Ymoins.addPoint( s, 0,  s);
        Ymoins.addPoint(-s, 0,  s);
        this.addSubElement(Ymoins);
      };
      return Cube;
    })(SpaceElement);


    var Camera = (function(superClass) {
      extend(Camera, superClass);
      function Camera() {
        this.setPerspective(50);
        this.renderWidth = 500;
        this.renderHeight = 500;
        this.orientation = p.createVector(0, 0, 0);
        return Camera.__super__.constructor.apply(this, arguments);
      }
      Camera.prototype.setPerspective = function (perspective) {
        this.perspective = perspective;
        this.renderDistance = Math.pow(1.1, this.perspective);
      };
      Camera.prototype.render = function () {
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].draw(this);
        }
      };
      Camera.prototype.addSubElement = function (element) {
        this.elements.push(element);
      };
      Camera.prototype.projection = function (vector) {
        var result = vector.copy();
        var cameraOrigin = this.center.copy();
        cameraOrigin.rotateX(this.rotation.x);
        cameraOrigin.rotateY(this.rotation.y);
        cameraOrigin.rotateZ(this.rotation.z);

        result.sub(cameraOrigin);
        //result.normalize();
        result.rotateX(-this.orientation.x);
        result.rotateY(-this.orientation.y);
        result.rotateZ(-this.orientation.z);
        result.mult(this.renderDistance / result.z);
        return result
      };
      Camera.prototype.setOrientationX = function (angle) {
        this.orientation.x = (angle) % (Math.PI*2);
      };
      Camera.prototype.setOrientationY = function (angle) {
        this.orientation.y = (angle) % (Math.PI*2);
      };
      Camera.prototype.setOrientationZ = function (angle) {
        this.orientation.z = (angle) % (Math.PI*2);
      };
      return Camera;
    })(SpaceElement);


  };

  var myp5 = new p5(sketch);

})
