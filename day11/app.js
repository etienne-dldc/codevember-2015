/**
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *
 *	A general perpose camera, for setting FOV, Lens Focal Length,
 *		and switching between perspective and orthographic views easily.
 *		Use this only if you do not wish to manage
 *		both a Orthographic and Perspective Camera
 *
 */


THREE.CombinedCamera = function ( width, height, fov, near, far, orthoNear, orthoFar ) {

	THREE.Camera.call( this );

	this.fov = fov;

	this.left = -width / 2;
	this.right = width / 2
	this.top = height / 2;
	this.bottom = -height / 2;

	// We could also handle the projectionMatrix internally, but just wanted to test nested camera objects

	this.cameraO = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 	orthoNear, orthoFar );
	this.cameraP = new THREE.PerspectiveCamera( fov, width / height, near, far );

	this.zoom = 1;

	this.toPerspective();

	var aspect = width/height;

};

THREE.CombinedCamera.prototype = Object.create( THREE.Camera.prototype );

THREE.CombinedCamera.prototype.toPerspective = function () {

	// Switches to the Perspective Camera

	this.near = this.cameraP.near;
	this.far = this.cameraP.far;

	this.cameraP.fov =  this.fov / this.zoom ;

	this.cameraP.updateProjectionMatrix();

	this.projectionMatrix = this.cameraP.projectionMatrix;

	this.inPerspectiveMode = true;
	this.inOrthographicMode = false;

};

THREE.CombinedCamera.prototype.toOrthographic = function () {

	// Switches to the Orthographic camera estimating viewport from Perspective

	var fov = this.fov;
	var aspect = this.cameraP.aspect;
	var near = this.cameraP.near;
	var far = this.cameraP.far;

	// The size that we set is the mid plane of the viewing frustum

	var hyperfocus = ( near + far ) / 2;

	var halfHeight = Math.tan( fov / 2 ) * hyperfocus;
	var planeHeight = 2 * halfHeight;
	var planeWidth = planeHeight * aspect;
	var halfWidth = planeWidth / 2;

	halfHeight /= this.zoom;
	halfWidth /= this.zoom;

	this.cameraO.left = -halfWidth;
	this.cameraO.right = halfWidth;
	this.cameraO.top = halfHeight;
	this.cameraO.bottom = -halfHeight;

	// this.cameraO.left = -farHalfWidth;
	// this.cameraO.right = farHalfWidth;
	// this.cameraO.top = farHalfHeight;
	// this.cameraO.bottom = -farHalfHeight;

	// this.cameraO.left = this.left / this.zoom;
	// this.cameraO.right = this.right / this.zoom;
	// this.cameraO.top = this.top / this.zoom;
	// this.cameraO.bottom = this.bottom / this.zoom;

	this.cameraO.updateProjectionMatrix();

	this.near = this.cameraO.near;
	this.far = this.cameraO.far;
	this.projectionMatrix = this.cameraO.projectionMatrix;

	this.inPerspectiveMode = false;
	this.inOrthographicMode = true;

};


THREE.CombinedCamera.prototype.setSize = function( width, height ) {

	this.cameraP.aspect = width / height;
	this.left = -width / 2;
	this.right = width / 2
	this.top = height / 2;
	this.bottom = -height / 2;

};


THREE.CombinedCamera.prototype.setFov = function( fov ) {

	this.fov = fov;

	if ( this.inPerspectiveMode ) {

		this.toPerspective();

	} else {

		this.toOrthographic();

	}

};

// For mantaining similar API with PerspectiveCamera

THREE.CombinedCamera.prototype.updateProjectionMatrix = function() {

	if ( this.inPerspectiveMode ) {

		this.toPerspective();

	} else {

		this.toPerspective();
		this.toOrthographic();

	}

};

/*
* Uses Focal Length (in mm) to estimate and set FOV
* 35mm (fullframe) camera is used if frame size is not specified;
* Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
*/
THREE.CombinedCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	if ( frameHeight === undefined ) frameHeight = 24;

	var fov = 2 * THREE.Math.radToDeg( Math.atan( frameHeight / ( focalLength * 2 ) ) );

	this.setFov( fov );

	return fov;
};


THREE.CombinedCamera.prototype.setZoom = function( zoom ) {

	this.zoom = zoom;

	if ( this.inPerspectiveMode ) {

		this.toPerspective();

	} else {

		this.toOrthographic();

	}

};

THREE.CombinedCamera.prototype.getZoom = function() {

	return this.zoom;

};


THREE.CombinedCamera.prototype.toFrontView = function() {

	this.rotation.x = 0;
	this.rotation.y = 0;
	this.rotation.z = 0;

	// should we be modifing the matrix instead?

	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toBackView = function() {

	this.rotation.x = 0;
	this.rotation.y = Math.PI;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toLeftView = function() {

	this.rotation.x = 0;
	this.rotation.y = - Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toRightView = function() {

	this.rotation.x = 0;
	this.rotation.y = Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toTopView = function() {

	this.rotation.x = - Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toBottomView = function() {

	this.rotation.x = Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

// Tween JS
// tween.js - http://github.com/sole/tween.js
'use strict';var TWEEN=TWEEN||function(){var a=[];return{REVISION:"7",getAll:function(){return a},removeAll:function(){a=[]},add:function(c){a.push(c)},remove:function(c){c=a.indexOf(c);-1!==c&&a.splice(c,1)},update:function(c){if(0===a.length)return!1;for(var b=0,d=a.length,c=void 0!==c?c:Date.now();b<d;)a[b].update(c)?b++:(a.splice(b,1),d--);return!0}}}();
TWEEN.Tween=function(a){var c={},b={},d=1E3,e=0,f=null,h=TWEEN.Easing.Linear.None,r=TWEEN.Interpolation.Linear,k=[],l=null,m=!1,n=null,p=null;this.to=function(a,c){null!==c&&(d=c);b=a;return this};this.start=function(d){TWEEN.add(this);m=!1;f=void 0!==d?d:Date.now();f+=e;for(var g in b)if(null!==a[g]){if(b[g]instanceof Array){if(0===b[g].length)continue;b[g]=[a[g]].concat(b[g])}c[g]=a[g]}return this};this.stop=function(){TWEEN.remove(this);return this};this.delay=function(a){e=a;return this};this.easing=
function(a){h=a;return this};this.interpolation=function(a){r=a;return this};this.chain=function(){k=arguments;return this};this.onStart=function(a){l=a;return this};this.onUpdate=function(a){n=a;return this};this.onComplete=function(a){p=a;return this};this.update=function(e){if(e<f)return!0;!1===m&&(null!==l&&l.call(a),m=!0);var g=(e-f)/d,g=1<g?1:g,i=h(g),j;for(j in c){var s=c[j],q=b[j];a[j]=q instanceof Array?r(q,i):s+(q-s)*i}null!==n&&n.call(a,i);if(1==g){null!==p&&p.call(a);g=0;for(i=k.length;g<
i;g++)k[g].start(e);return!1}return!0}};
TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return 1>(a*=2)?0.5*a*a:-0.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a:0.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*
a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return 0.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:1>(a*=2)?0.5*Math.pow(1024,a-1):0.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-
Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return 1>(a*=2)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return-(b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4))},Out:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return b*Math.pow(2,-10*a)*Math.sin((a-c)*
2*Math.PI/0.4)+1},InOut:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return 1>(a*=2)?-0.5*b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4):0.5*b*Math.pow(2,-10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4)+1}},Back:{In:function(a){return a*a*(2.70158*a-1.70158)},Out:function(a){return--a*a*(2.70158*a+1.70158)+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*(3.5949095*a-2.5949095):0.5*((a-=2)*a*(3.5949095*a+2.5949095)+2)}},Bounce:{In:function(a){return 1-
TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+0.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+0.9375:7.5625*(a-=2.625/2.75)*a+0.984375},InOut:function(a){return 0.5>a?0.5*TWEEN.Easing.Bounce.In(2*a):0.5*TWEEN.Easing.Bounce.Out(2*a-1)+0.5}}};
TWEEN.Interpolation={Linear:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.Linear;return 0>c?f(a[0],a[1],d):1<c?f(a[b],a[b-1],b-d):f(a[e],a[e+1>b?b:e+1],d-e)},Bezier:function(a,c){var b=0,d=a.length-1,e=Math.pow,f=TWEEN.Interpolation.Utils.Bernstein,h;for(h=0;h<=d;h++)b+=e(1-c,d-h)*e(c,h)*a[h]*f(d,h);return b},CatmullRom:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[b]?(0>c&&(e=Math.floor(d=b*(1+c))),f(a[(e-
1+b)%b],a[e],a[(e+1)%b],a[(e+2)%b],d-e)):0>c?a[0]-(f(a[0],a[0],a[1],a[1],-d)-a[0]):1<c?a[b]-(f(a[b],a[b],a[b-1],a[b-1],d-b)-a[b]):f(a[e?e-1:0],a[e],a[b<e+1?b:e+1],a[b<e+2?b:e+2],d-e)},Utils:{Linear:function(a,c,b){return(c-a)*b+a},Bernstein:function(a,c){var b=TWEEN.Interpolation.Utils.Factorial;return b(a)/b(c)/b(a-c)},Factorial:function(){var a=[1];return function(c){var b=1,d;if(a[c])return a[c];for(d=c;1<d;d--)b*=d;return a[c]=b}}(),CatmullRom:function(a,c,b,d,e){var a=0.5*(b-a),d=0.5*(d-c),f=
e*e;return(2*c-2*b+a+d)*e*f+(-3*c+3*b-2*a-d)*f+a*e+c}}};


// Render, Scene, Ligth
var WIDTH = window.innerWidth,
    HEIGHT = 500;
var VIEW_ANGLE = 30,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

var renderer = new THREE.WebGLRenderer({ alpha: true });

var scene = new THREE.Scene();

var camera = new THREE.CombinedCamera( WIDTH / 2, HEIGHT / 2, 70, 1, 1000, - 500, 500 );
camera.toOrthographic();
camera.setZoom(9);

scene.add(camera);

camera.position.z = 0;

renderer.setSize(WIDTH, HEIGHT);

var $container = $('#container');
$container.append(renderer.domElement);

var lightAmbient = new THREE.AmbientLight( 0xE84C3C );
scene.add( lightAmbient );

var dirLight = new THREE.DirectionalLight( 0x3d3d3d, 0.4 );
dirLight.position.set( 20, 20, 20 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

// Render !
var render = function () {
	requestAnimationFrame(render);

	TWEEN.update();

	renderer.render(scene, camera);
};

/**
* SIZE
**/

var nx = 1.62;
var ny = Math.sqrt( (2*nx*2*nx) - (nx*nx) );



/**
* CUBES
**/

var isometricAngle = new THREE.Object3D();
var cubeGroup = new THREE.Object3D();
var cubes = new Array();
var geometry = new THREE.BoxGeometry( 4, 4, 4 );
var cubeMaterial = new THREE.MeshLambertMaterial( {color: 0xE84C3C, side: THREE.DoubleSide} );
for (var i = 0; i < 14; i++) {
  cubes[i] = new THREE.Mesh( geometry, cubeMaterial );
  cubeGroup.add( cubes[i] );
}

isometricAngle.add(cubeGroup);

isometricAngle.rotation.z = -7*Math.PI/6;
isometricAngle.position.x = -nx;
isometricAngle.position.y = -ny;

cubeGroup.rotation.x = 0.615472907;
cubeGroup.rotation.y = 3*Math.PI/4;

scene.add(isometricAngle);



/**
* TRIANGLES
**/

var geometry = new THREE.Geometry();
geometry.vertices.push(
  new THREE.Vector3( ny,  nx, 0 ),
  new THREE.Vector3( 0, 2*nx, 0 ),
  new THREE.Vector3( 0, 0, 0 )
);
geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

var triangleMaterial1 = new THREE.MeshBasicMaterial( {color: 0xC03A29} );
triangleMaterial1.side = THREE.DoubleSide;

var triangleMaterial2 = new THREE.MeshBasicMaterial( {color: 0xE84C3C} );
triangleMaterial2.side = THREE.DoubleSide;

var triangleUnit = new THREE.Object3D();
var triangleTemp = new THREE.Mesh( geometry, triangleMaterial1 );
triangleTemp.position.z = -0.01;
triangleUnit.add( triangleTemp );
triangleUnit.add( new THREE.Mesh( geometry, triangleMaterial2 ) );
triangleUnit.rotation.z = Math.PI/6;

var triangleUnit2 = new THREE.Object3D();
triangleTemp = new THREE.Mesh( geometry, triangleMaterial2 );
triangleTemp.position.z = -0.01;
triangleUnit2.add( triangleTemp );
triangleUnit2.add( new THREE.Mesh( geometry, triangleMaterial2 ) );
triangleUnit2.rotation.z = Math.PI/6;

var triGroup = new THREE.Object3D();
triGroup.position.z = 20;


/**
* TRIANGLES - BASE
**/

var triGroupLeftTop = new THREE.Object3D();

for (var i = 0; i < 18; i++) {
  curentTriangle = triangleUnit.clone();
  if (i%2 == 0) { curentTriangle.rotation.z += Math.PI; };
  triGroupLeftTop.add( curentTriangle );
}

triGroupLeftTop.children[0].position.set( 0, 2*ny, 0);
triGroupLeftTop.children[1].position.set( nx, ny, 0);
triGroupLeftTop.children[2].position.set( 2*nx, 2*ny, 0);
triGroupLeftTop.children[3].position.set( 2*nx, 0, 0);
triGroupLeftTop.children[4].position.set( 3*nx, ny, 0);
triGroupLeftTop.children[5].position.set( 3*nx, -ny, 0);
triGroupLeftTop.children[6].position.set( 2*nx, 0, 0);
triGroupLeftTop.children[7].position.set( 2*nx, -2*ny, 0);
triGroupLeftTop.children[8].position.set( nx, -ny, 0);
triGroupLeftTop.children[9].position.set( 0, -2*ny, 0);
triGroupLeftTop.children[10].position.set( -nx, -ny, 0);
triGroupLeftTop.children[11].position.set( -2*nx, -2*ny, 0);
triGroupLeftTop.children[12].position.set( -2*nx, 0, 0);
triGroupLeftTop.children[13].position.set( -3*nx, -ny, 0);
triGroupLeftTop.children[14].position.set( -3*nx, ny, 0);
triGroupLeftTop.children[15].position.set( -2*nx, 0, 0);
triGroupLeftTop.children[16].position.set( -2*nx, 2*ny, 0);
triGroupLeftTop.children[17].position.set( -nx, ny, 0);

triGroup.add(triGroupLeftTop);



/**
* TRIANGLES - TOP
**/

var triGroupTop = new THREE.Object3D();
var triGroupTopFirst = new THREE.Object3D();
var triGroupTopMiddle = new THREE.Object3D();
var triGroupTopLast = new THREE.Object3D();

triGroupTop.add( triGroupTopFirst.add( triangleUnit2.clone() ) );
triGroupTopFirst.position.set( -nx, ny, 0);
triGroupTopFirst.rotation.z = Math.PI/3;
triGroupTopFirst.children[0].rotation.z += Math.PI/3;

for (var i = 0; i < 3; i++) {
  curentTriangle = triangleUnit.clone();
  if (i%2 == 0) { curentTriangle.rotation.z += Math.PI; };
  triGroupTopMiddle.add( curentTriangle );
}

triGroupTopMiddle.children[0].position.set( -nx, ny, 0);
triGroupTopMiddle.children[1].position.set( 0, 0, 0);
triGroupTopMiddle.children[2].position.set( nx, ny, 0);
triGroupTop.add( triGroupTopMiddle );


triGroupTop.add( triGroupTopLast.add( triangleUnit2.clone() ) );
triGroupTopLast.position.set( nx, ny, 0);
triGroupTopLast.rotation.z = -Math.PI/3;
triGroupTopLast.children[0].rotation.z += -Math.PI/3;

triGroupTop.position.set( 0, 2*ny, 0);
triGroup.add(triGroupTop);



/**
* TRIANGLES - LEFT-TOP
**/

var triGroupLeftTop = new THREE.Object3D();
var triGroupLeftTopAng = new THREE.Object3D();

for (var i = 0; i < 5; i++) {
  curentTriangle = triangleUnit2.clone();
  if (i%2 == 1) { curentTriangle.rotation.z += Math.PI; };
  triGroupLeftTopAng.add( curentTriangle );
}

triGroupLeftTopAng.children[0].position.set( -2*nx, 0, 0);
triGroupLeftTopAng.children[1].position.set( -nx, ny, 0);
triGroupLeftTopAng.children[2].position.set( 0, 0, 0);
triGroupLeftTopAng.children[3].position.set( nx, ny, 0);
triGroupLeftTopAng.children[4].position.set( 2*nx, 0, 0);

triGroupLeftTop.add(triGroupLeftTopAng);
triGroupLeftTop.position.set( -3*nx, ny, 1);
triGroupLeftTop.rotation.z = Math.PI/3;

triGroup.add(triGroupLeftTop);



/**
* TRIANGLES - RIGTH-TOP
**/

var triGroupRigthTop = new THREE.Object3D();
var triGroupRigthTopAng = new THREE.Object3D();

for (var i = 0; i < 5; i++) {
  curentTriangle = triangleUnit2.clone();
  if (i%2 == 1) { curentTriangle.rotation.z += Math.PI; };
  triGroupRigthTopAng.add( curentTriangle );
}

triGroupRigthTopAng.children[0].position.set( -2*nx, 0, 0);
triGroupRigthTopAng.children[1].position.set( -nx, ny, 0);
triGroupRigthTopAng.children[2].position.set( 0, 0, 0);
triGroupRigthTopAng.children[3].position.set( nx, ny, 0);
triGroupRigthTopAng.children[4].position.set( 2*nx, 0, 0);

triGroupRigthTop.add(triGroupRigthTopAng);
triGroupRigthTop.position.set( 3*nx, ny, 0.2);
triGroupRigthTop.rotation.z = -Math.PI/3;

triGroup.add(triGroupRigthTop);



/**
* TRIANGLES - LEFT-BOT
**/

var triGroupLeftBot = new THREE.Object3D();
var triGroupLeftBotMiddle = new THREE.Object3D();
var triGroupLeftBotLast = new THREE.Object3D();
var triGroupLeftBotAng = new THREE.Object3D();

for (var i = 0; i < 4; i++) {
  curentTriangle = triangleUnit.clone();
  if (i%2 == 1) { curentTriangle.rotation.z += Math.PI; };
  triGroupLeftBotMiddle.add( curentTriangle );
}

triGroupLeftBotMiddle.children[0].position.set( -2*nx, 0, 0);
triGroupLeftBotMiddle.children[1].position.set( -nx, ny, 0);
triGroupLeftBotMiddle.children[2].position.set( 0, 0, 0);
triGroupLeftBotMiddle.children[3].position.set( nx, ny, 0);
triGroupLeftBotAng.add( triGroupLeftBotMiddle );

triGroupLeftBotAng.add( triGroupLeftBotLast.add( triangleUnit.clone() ) );
triGroupLeftBotLast.position.set( nx, ny, 0);
triGroupLeftBotLast.rotation.z = -Math.PI/3;
triGroupLeftBotLast.children[0].rotation.z += -Math.PI/3;

triGroupLeftBot.add(triGroupLeftBotAng);
triGroupLeftBot.position.set( -3*nx, -ny, 0);
triGroupLeftBot.rotation.z = 2*(Math.PI/3);

triGroup.add(triGroupLeftBot);



/**
* TRIANGLES - RIGTH-BOT
**/

var triGroupRigthBot = new THREE.Object3D();
var triGroupRigthBotFirst = new THREE.Object3D();
var triGroupRigthBotMiddle = new THREE.Object3D();
var triGroupRigthBotAng = new THREE.Object3D();

triGroupRigthBotAng.add( triGroupRigthBotFirst.add( triangleUnit.clone() ) );
triGroupRigthBotFirst.position.set( -nx, ny, 0);
triGroupRigthBotFirst.rotation.z = Math.PI/3;
triGroupRigthBotFirst.children[0].rotation.z += Math.PI/3;

for (var i = 0; i < 4; i++) {
  curentTriangle = triangleUnit.clone();
  if (i%2 == 0) { curentTriangle.rotation.z += Math.PI; };
  triGroupRigthBotMiddle.add( curentTriangle );
}

triGroupRigthBotMiddle.children[0].position.set( -nx,ny, 0);
triGroupRigthBotMiddle.children[1].position.set( 0, 0, 0);
triGroupRigthBotMiddle.children[2].position.set( nx, ny, 0);
triGroupRigthBotMiddle.children[3].position.set( 2*nx, 0, 0);
triGroupRigthBotAng.add( triGroupRigthBotMiddle );

triGroupRigthBot.add(triGroupRigthBotAng);
triGroupRigthBot.position.set( 3*nx, -ny, 0);
triGroupRigthBot.rotation.z = -2*(Math.PI/3);

triGroup.add(triGroupRigthBot);



/**
* TRIANGLES - BOTTOM
**/

var triGroupBottom = new THREE.Object3D();
var triGroupBottomFirst = new THREE.Object3D();
var triGroupBottomFirstAng = new THREE.Object3D();
var triGroupBottomMiddle = new THREE.Object3D();
var triGroupBottomLast = new THREE.Object3D();
var triGroupBottomLastAng = new THREE.Object3D();

for (var i = 0; i < 3; i++) {
  curentTriangle = triangleUnit.clone();
  if (i%2 == 0) { curentTriangle.rotation.z += Math.PI; };
  triGroupBottomFirstAng.add( curentTriangle );
}

triGroupBottomFirstAng.children[0].position.set( -nx, ny, 0);
triGroupBottomFirstAng.children[1].position.set( 0, 0, 0);
triGroupBottomFirstAng.children[2].position.set( nx, ny, 0);
triGroupBottomFirst.add(triGroupBottomFirstAng);

triGroupBottomFirst.position.set( -nx, ny, 0);
triGroupBottomFirst.rotation.z = Math.PI/3;
triGroupBottom.add(triGroupBottomFirst);

for (var i = 0; i < 4; i++) {
  curentTriangle = triangleUnit2.clone();
  if (i%2 == 0) { curentTriangle.rotation.z += Math.PI; };
  triGroupBottomMiddle.add( curentTriangle );
}

triGroupBottomMiddle.children[0].position.set( -nx,ny, 0);
triGroupBottomMiddle.children[1].position.set( 0, 0, 0);
triGroupBottomMiddle.children[2].position.set( nx, ny, 0);
triGroupBottomMiddle.children[3].position.set( 0, 2*ny, 0);
triGroupBottomMiddle.children[3].rotation.z += Math.PI;
triGroupBottomMiddle.position.set( 0, 0, -0.6);
triGroupBottom.add( triGroupBottomMiddle );

triGroupBottomLastAng = triGroupBottomFirstAng.clone();
triGroupBottomLast.add(triGroupBottomLastAng);

triGroupBottomLast.position.set( nx, ny, 0);
triGroupBottomLast.rotation.z = -Math.PI/3;
triGroupBottom.add(triGroupBottomLast);

triGroupBottom.position.set( 0, -2*ny, 0);
triGroupBottom.rotation.z = Math.PI;

triGroup.add(triGroupBottom);



/**
* TRIANGLE - ADD TO SCENE
**/
triGroup.visible = false;
scene.add(triGroup);


/**
* CUBE
**/

var cubePositionTargetBis = {
  x0:-6, y0:-6, z0:-2,
	x1:-6, y1:-6, z1:-6,
	x2:-2, y2:-6, z2:-6,
	x3:2, y3:-6, z3:-6,
	x4:2, y4:-2, z4:-6,
	x5:2, y5:2, z5:-6,
	x6:2, y6:6, z6:-6,
	x7:2, y7:2, z7:-2,
	x8:2, y8:2, z8:2,
	x9:6, y9:2, z9:2,
	x10:-2, y10:2, z10:2,
	x11:-6, y11:2, z11:2,
	x12:-6, y12:-2, z12:2,
	x13:-6, y13:-6, z13:2
};

var cubePositionTarget = {
  x0:-10, y0:-10, z0:-10,
  x1:-10, y1:-10, z1:10,
  x2:-10, y2:10, z2:-10,
  x3:-10, y3:10, z3:10,
  x4:10, y4:-10, z4:10,
  x5:10, y5:-10, z5:-10,
  x6:10, y6:10, z6:-10,
  x7:10, y7:10, z7:10,
  x8:10, y8:0, z8:0,
  x9:-10, y9:0, z9:0,
  x10:0, y10:10, z10:0,
  x11:0, y11:-10, z11:0,
  x12:0, y12:0, z12:10,
  x13:0, y13:0, z13:-10
};

var cubePosition = {
  x0:0, y0:0, z0:0,
  x1:0, y1:0, z1:0,
  x2:0, y2:0, z2:0,
  x3:0, y3:0, z3:0,
  x4:0, y4:0, z4:0,
  x5:0, y5:0, z5:0,
  x6:0, y6:0, z6:0,
  x7:0, y7:0, z7:0,
  x8:0, y8:0, z8:0,
  x9:0, y9:0, z9:0,
  x10:0, y10:0, z10:0,
  x11:0, y11:0, z11:0,
  x12:0, y12:0, z12:0,
  x13:0, y13:0, z13:0
};

var cubeTween = new TWEEN.Tween(cubePosition).to(cubePositionTarget, 1500);
cubeTween.easing(TWEEN.Easing.Elastic.Out);
cubeTween.delay(500);
cubeTween.onUpdate(function(){
  $.each(cubes, function(k, v) {
    v.position.x = cubePosition["x"+k];
    v.position.y = cubePosition["y"+k];
    v.position.z = cubePosition["z"+k];
  })
});


var cubeTweenBis = new TWEEN.Tween(cubePositionTarget).to(cubePositionTargetBis, 1500);
cubeTweenBis.easing(TWEEN.Easing.Elastic.Out);
cubeTweenBis.delay(200);
cubeTweenBis.onUpdate(function(){
  $.each(cubes, function(k, v) {
    v.position.x = cubePositionTarget["x"+k];
    v.position.y = cubePositionTarget["y"+k];
    v.position.z = cubePositionTarget["z"+k];
  })
});



/**
* ISOMETRIC ANGLE
**/

var isoAngRotateTarget = { y : 8*Math.PI };
var isoAngRotate = { y : 0 };

var isoAngTween = new TWEEN.Tween(isoAngRotate).to(isoAngRotateTarget, 3000);
isoAngTween.easing(TWEEN.Easing.Circular.Out);
isoAngTween.onUpdate(function(){
  isometricAngle.rotation.y = isoAngRotate.y;
});



/**
* DIRECTIONNAL LIGTH
**/

var dirLigIntensityTarget = { intensity : 0 };
var dirLigIntensityTarget2 = { intensity : 1 };
var dirLigIntensity = { intensity : dirLight.intensity };

var dirLigTween = new TWEEN.Tween(dirLigIntensity).to(dirLigIntensityTarget, 400);
dirLigTween.onUpdate(function() {
  dirLight.intensity = dirLigIntensity.intensity;
});
dirLigTween.onComplete(function() {
	cubeGroup.visible = false;
	triGroup.visible = true;
});

var dirLigTweenReverse = new TWEEN.Tween(dirLigIntensityTarget).to(dirLigIntensityTarget2, 400);
dirLigTweenReverse.onUpdate(function() {
  dirLight.intensity = dirLigIntensityTarget.intensity;
});



/**
* TRIANGLES
**/

var triRotateTarget = { x : Math.PI };
var triRotate = { x : 0 };

var triRotateLinear = new TWEEN.Tween(triRotate).to(triRotateTarget, 500);
triRotateLinear.easing(TWEEN.Easing.Cubic.InOut);
triRotateLinear.delay(200);
triRotateLinear.onUpdate(function(){
  triGroupTop.rotation.x = triRotate.x;
  triGroupTopFirst.children[0].rotation.x = -triRotate.x;
  triGroupTopLast.children[0].rotation.x = -triRotate.x;
  triGroupRigthBotAng.rotation.x = triRotate.x;
  triGroupLeftBotAng.rotation.x = triRotate.x;
  triGroupBottomFirstAng.rotation.x = triRotate.x;
  triGroupBottomLastAng.rotation.x = triRotate.x;
});

var triRotateLog = new TWEEN.Tween(triRotate).to(triRotateTarget, 500);
triRotateLog.easing(TWEEN.Easing.Cubic.InOut);
triRotateLog.delay(600);
triRotateLog.onUpdate(function(){
  triGroupLeftTopAng.rotation.x = triRotate.x;
  triGroupRigthTopAng.rotation.x = triRotate.x;
  triGroupBottom.rotation.x = -triRotate.x;
});



/**
* CAMERA
**/

var camZoomTarget = { zoom : 35 };
var camZoom = { zoom : camera.zoom };

var camZoomTween = new TWEEN.Tween(camZoom).to(camZoomTarget, 500);
camZoomTween.easing(TWEEN.Easing.Cubic.InOut);
camZoomTween.delay(300);
camZoomTween.onUpdate(function() {
  camera.setZoom(camZoom.zoom);
});
camZoomTween.onComplete(function() {

});



/**
* CHAIN / START
**/

isoAngTween.chain(dirLigTween);
cubeTween.chain(cubeTweenBis);
dirLigTween.chain(dirLigTweenReverse, triRotateLinear, triRotateLog);
dirLigTweenReverse.chain(camZoomTween);

window.setTimeout(function() {
  cubeTween.start();
  isoAngTween.start();
}, 500)


render();
