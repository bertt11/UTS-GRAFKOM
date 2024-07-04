
function main() {
  var CANVAS = document.getElementById("myCanvas");


  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  var THETA = 0;
  var ALPHA = 0;

  var drag = false;
  var dX = 0;
  var dY = 0;


  var X_prev = 0;
  var Y_prev = 0;

//CONTROLLER
var drag = false;
var dX = 0;
var dY = 0;


var X_prev = 0;
var Y_prev = 0;

var scale_x = 1;
var scale_y = 1;
var scale_z = 1;
var rotasi_sumbu_x = 0;
var rotasi_sumbu_y = 0;
var rotasi_sumbu_z = 0;
var translasi_sumbu_x = 0;
var translasi_sumbu_y = 0;
var translasi_sumbu_z = 0;

var FRICTION = 0.02;

var keys = {};

var handleKeyDown = function (e) {
  keys[e.key] = true;
};

var handleKeyUp = function (e) {
  keys[e.key] = false;
};

var handleKeys = function () {
  if (keys["a"]) {
    rotasi_sumbu_x += 0.05;
  }
  if (keys["s"]) {
    rotasi_sumbu_x -= 0.05;
  }
  if (keys["d"]) {
    rotasi_sumbu_y += 0.05;
  }
  if (keys["d"]) {
    rotasi_sumbu_y -= 0.05;
  }
  if (keys["g"]) {
    rotasi_sumbu_z += 0.05;
  }
  if (keys["h"]) {
    rotasi_sumbu_z -= 0.05;
  }
  if (keys["j"]) {
    translasi_sumbu_x += 0.05;
  }
  if (keys["k"]) {
    translasi_sumbu_x -= 0.05;
  }
  if (keys["l"]) {
    translasi_sumbu_y += 0.05;
  }
  if (keys[";"]) {
    translasi_sumbu_y -= 0.05;
  }
  if (keys["z"]) {
    translasi_sumbu_z += 0.05;
  }
  if (keys["x"]) {
    translasi_sumbu_z -= 0.05;
  }
  if (keys["c"]) {
    scale_x += 0.01;
    scale_y += 0.01;
    scale_z += 0.01;
  }
  if (keys["v"]) {
    scale_x -= 0.01;
    scale_y -= 0.01;
    scale_z -= 0.01;
  }
};

document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);


  var mouseDown = function (e) {
    drag = true;
    X_prev = e.pageX;
    Y_prev = e.pageY;
  }


  var mouseUp = function (e) {
    drag = false;
  }


  var mouseMove = function (e) {
    if (!drag) { return false; }
    dX = e.pageX - X_prev;
    dY = e.pageY - Y_prev;
    X_prev = e.pageX;
    Y_prev = e.pageY;


    THETA += dX * 2 * Math.PI / CANVAS.width;
    ALPHA += dY * 2 * Math.PI / CANVAS.height;
  }


  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUp, false);
  CANVAS.addEventListener("mouseout", mouseUp, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);




  try {
    GL = CANVAS.getContext("webgl", { antialias: true, alpha: true });
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }
  // shaders

  var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;


      gl_PointSize=20.0;
      }`;
  var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      }`;






  // -----------------------------------------------------------------------------------


  //matrix
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();


  // ZOOM
  LIBS.translateX(VIEW_MATRIX, 0);
  LIBS.translateY(VIEW_MATRIX, 0);
  LIBS.translateZ(VIEW_MATRIX, -30);

  var main = new MyObject(vertexTabungRadiusModif(0,3,0, 2, 4, -4, 0.5803921568627451, 0.2980392156862745, 0.1411764705882353), indeksTabungRadiusModif(0,0,0, 2, 3, 5, 0, 0, 0), shader_vertex_source, shader_fragment_source);
  main.setup();
  var kepala = new MyObject(bola(0,1.98,0, 2.1, 3, 2, 100, 100, 0.5803921568627451, 0.2980392156862745, 0.1411764705882353).vertis, bola(0,4,0, 2, 3, 2, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
  kepala.setup();
  var badan = new MyObject(vertexTabungRadiusModif(0,-4,0, 2, 2, 4, 0.9568627450980393, 0.7686274509803922, 0.48627450980392156), indeksTabungRadiusModif(), shader_vertex_source, shader_fragment_source);
  badan.setup();
  var sepatuKiri = new MyObject(vertexSepatu(-2, -5.1, 2.5, 1.5, 4, 1, 0.2980392156862745, 0.23529411764705882, 0.09019607843137255), indeksSepatu(), shader_vertex_source, shader_fragment_source);
  sepatuKiri.setup();
  var sepatuKanan = new MyObject(vertexSepatu(0.3, -5.1, 2.5, 1.5, 4, 1, 0.2980392156862745, 0.23529411764705882, 0.09019607843137255), indeksSepatu(), shader_vertex_source, shader_fragment_source);
  sepatuKanan.setup();
  var mataKiri = new MyObject(bola(-0.95, 2, 2.5, 0.75, 1.1, 1, 100, 100, 1, 1, 1).vertis, bola(0,4,0, 2, 3, 2, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
  mataKiri.setup();
  var mataKanan = new MyObject(bola(0.95, 2, 2.5, 0.75, 1.1, 1, 100, 100, 1, 1, 1).vertis, bola(0,4,0, 2, 3, 2, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
  mataKanan.setup();
  var pupilKiri = new MyObject(bola(0.95, 2, 3.5, 0.2, 0.3, 0.2, 100, 100, 0, 0, 0).vertis, bola(0,4,0, 2, 3, 2, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
  pupilKiri.setup();
  var pupilKanan = new MyObject(bola(-0.95, 2, 3.5, 0.2, 0.3, 0.2, 100, 100, 0, 0, 0).vertis, bola(0,4,0, 2, 3, 2, 100, 100, 0, 0, 0).indices, shader_vertex_source, shader_fragment_source);
  pupilKanan.setup();
  var mulut = new MyObject(vertexSepatu(-2, 0, 3.5, 4, 0.2, 0.2, 1, 1, 1), indeksSepatu(), shader_vertex_source, shader_fragment_source);
  mulut.setup();

  main.child.push(kepala);
  main.child.push(badan);
  main.child.push(sepatuKiri);
  main.child.push(sepatuKanan);
  main.child.push(mataKiri);
  main.child.push(mataKanan);
  main.child.push(pupilKiri);
  main.child.push(pupilKanan);
  main.child.push(mulut);

  GL.clearColor(0, 0, 1, 0);


  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var time_prev = 0;
  var animate = function (time) {


    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
    var dt = time - time_prev;
    time_prev = time;


    if (!drag) {
      dX *= FRICTION;
      dY *= FRICTION;


      THETA += dX * 2 * Math.PI / CANVAS.width;
      ALPHA += dY * 2 * Math.PI / CANVAS.height;
    }

    // --------------------------------------------LOL---------------------------------------------------------------------------------------------------

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateX(MODEL_MATRIX, rotasi_sumbu_x);
    LIBS.rotateY(MODEL_MATRIX, rotasi_sumbu_y);
    LIBS.rotateZ(MODEL_MATRIX, rotasi_sumbu_z);
    LIBS.translateX(MODEL_MATRIX, translasi_sumbu_x);
    LIBS.translateY(MODEL_MATRIX, translasi_sumbu_y);
    LIBS.translateZ(MODEL_MATRIX, translasi_sumbu_z);
    // LIBS.scale(MODEL_MATRIX, scale_x, scale_y, scale_z);

    main.MODEL_MATRIX = MODEL_MATRIX;
    kepala.MODEL_MATRIX = MODEL_MATRIX;
    badan.MODEL_MATRIX = MODEL_MATRIX;
    sepatuKiri.MODEL_MATRIX = MODEL_MATRIX;
    sepatuKanan.MODEL_MATRIX = MODEL_MATRIX;
    mataKiri.MODEL_MATRIX = MODEL_MATRIX;
    mataKanan.MODEL_MATRIX = MODEL_MATRIX;
    pupilKiri.MODEL_MATRIX = MODEL_MATRIX;
    pupilKanan.MODEL_MATRIX = MODEL_MATRIX;
    mulut.MODEL_MATRIX = MODEL_MATRIX;

    main.render(VIEW_MATRIX, PROJECTION_MATRIX);




    window.requestAnimationFrame(animate);

    handleKeys();
  };
  animate(0);
}
window.addEventListener('load', main);