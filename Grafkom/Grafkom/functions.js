
function vertexLengan(x, y, z, radius_awal, radius_akhir, lebar, r, g, b) {
    var vertices = [];
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  
    for (let i = 0; i <= 360; i++) {
  
      var angleInRadians = (i * Math.PI) / 180;
      var x_baru = x;
      var y_baru = y + Math.cos(angleInRadians) * radius_awal;
      var z_baru = z + Math.sin(angleInRadians) * radius_awal;
  
      vertices.push(x_baru);
      vertices.push(y_baru);
      vertices.push(z_baru);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
  
    vertices.push(x + lebar);
    vertices.push(y);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
    for (let i = 0; i <= 360; i++) {
  
      var angleInRadians = (i * Math.PI) / 180;
  
      var x_baru = x + lebar;
      var y_baru = y + Math.cos(angleInRadians) * radius_akhir;
      var z_baru = z + Math.sin(angleInRadians) * radius_akhir;
  
      vertices.push(x_baru);
      vertices.push(y_baru);
      vertices.push(z_baru);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    return vertices;
  
  }
  function vertexTabungRadiusModif(x, y, z, radius_mulai, radius_selesai, height, r, g, b) {
    var vertices = [];
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  
    for (let i = 0; i <= 360; i++) {
  
      var angleInRadians = (i * Math.PI) / 180;
      var x_baru = x + Math.cos(angleInRadians) * radius_mulai;
  
      var y_baru = y;
  
      var z_baru = z + Math.sin(angleInRadians) * radius_mulai;
  
      vertices.push(x_baru);
      vertices.push(y_baru);
      vertices.push(z_baru);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
  
    vertices.push(x);
    vertices.push(y + height);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
    for (let i = 0; i <= 360; i++) {
  
      var angleInRadians = (i * Math.PI) / 180;
  
      var newX = x + Math.cos(angleInRadians) * radius_selesai;
  
      var y_baru = y + height;
  
      var z_baru = z + Math.sin(angleInRadians) * radius_selesai;
  
      vertices.push(newX);
      vertices.push(y_baru);
      vertices.push(z_baru);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    return vertices;
  }
  function indeksTabungRadiusModif() {
    var faces = [];
  
    for (let i = 0; i <= 360; i++) {
      faces.push(0);
      faces.push(i + 1);
      faces.push(i + 2);
    }
    for (let i = 362; i < 722; i++) {
      faces.push(362);
      faces.push(i + 1);
      faces.push(i + 2);
    }
    for (let i = 1; i <= 361; i++) {
      faces.push(i);
      faces.push(360 + i);
      faces.push(361 + i);
  
      faces.push(361 + i);
      faces.push(i);
      faces.push(i + 1);
    }
    return faces;
  }
  function bola(x_awal, y_awal, z_awal, radius_x, radius_y, radius_z, latitudeBands, longitudeBands, r, g, b) {
    const vertis = [];
    const indices = [];
  
    for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = lat * Math.PI / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
  
      for (let long = 0; long <= longitudeBands; long++) {
        const phi = long * 2 * Math.PI / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
  
        const xPosition = x_awal + radius_x * cosPhi * sinTheta;
        const yPosition = y_awal + radius_y * sinPhi * sinTheta;
        const zPosition = z_awal + radius_z * cosTheta;
  
        vertis.push(xPosition, yPosition, zPosition, r, g, b);
      }
    }
  
    for (let lat = 0; lat < latitudeBands; lat++) {
      for (let long = 0; long < longitudeBands; long++) {
        const first = (lat * (longitudeBands + 1)) + long;
        const second = first + longitudeBands + 1;
  
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }
  
    return { vertis, indices };
  }
  
  function generateBSpline(controlPoint, m, degree) {
    var curves = [];
    var knotVector = [];
  
    var n = controlPoint.length / 6;
  
  
    // Calculate the knot values based on the degree and number of control points
    for (var i = 0; i < n + degree + 1; i++) {
      if (i < degree + 1) {
        knotVector.push(0);
      } else if (i >= n) {
        knotVector.push(n - degree);
      } else {
        knotVector.push(i - degree);
      }
    }
  
  
  
    var basisFunc = function (i, j, t) {
      if (j == 0) {
        if (knotVector[i] <= t && t < (knotVector[(i + 1)])) {
          return 1;
        } else {
          return 0;
        }
      }
  
      var den1 = knotVector[i + j] - knotVector[i];
      var den2 = knotVector[i + j + 1] - knotVector[i + 1];
  
      var term1 = 0;
      var term2 = 0;
  
  
      if (den1 != 0 && !isNaN(den1)) {
        term1 = ((t - knotVector[i]) / den1) * basisFunc(i, j - 1, t);
      }
  
      if (den2 != 0 && !isNaN(den2)) {
        term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i + 1, j - 1, t);
      }
  
      return term1 + term2;
    }
  
  
    for (var t = 0; t < m; t++) {
      var x = 0;
      var y = 0;
      var z = 0;
      var r = 0;
      var g = 0;
      var b = 0;
  
      var u = (t / m * (knotVector[controlPoint.length / 6] - knotVector[degree])) + knotVector[degree];
  
      //C(t)
      for (var key = 0; key < n; key++) {
  
        var C = basisFunc(key, degree, u);
        x += (controlPoint[key * 6] * C);
        y += (controlPoint[key * 6 + 1] * C);
        z += (controlPoint[key * 6 + 2] * C);
        r += (controlPoint[key * 6 + 3] * C);
        g += (controlPoint[key * 6 + 4] * C);
        b += (controlPoint[key * 6 + 5] * C);
      }
      curves.push(x);
      curves.push(y);
      curves.push(z);
      curves.push(r);
      curves.push(g);
      curves.push(b);
  
    }
    return curves;
  }
  function kurva3Dimensi(titik_kontrol, jari_jari) {
    var totalPoints = 100
  
    var vertices = [];
    var indices = [];
    var titik = generateBSpline(titik_kontrol, totalPoints, 2);
  
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        var angleInRadians = (j * Math.PI) / 180;
        var x_baru = titik[i * 6];
        var y_baru = titik[i * 6 + 1] + Math.cos(angleInRadians) * jari_jari;
        var z_baru = titik[i * 6 + 2] + Math.sin(angleInRadians) * jari_jari;
        var r = titik[i * 6 + 3]
        var g = titik[i * 6 + 4]
        var b = titik[i * 6 + 5]
        vertices.push(x_baru);
        vertices.push(y_baru);
        vertices.push(z_baru);
        vertices.push(r);
        vertices.push(g);
        vertices.push(b);
      }
    }
    for (let i = 0; i < totalPoints * 2; i++) {
      for (let j = 0; j < 360; j++) {
        indices.push(j + (i * 360));
        indices.push(j + 360 + (i * 360));
        indices.push(j + 361 + (i * 360));
  
        indices.push(j + (i * 360));
        indices.push(j + 1 + (i * 360));
        indices.push(j + 361 + (i * 360));
      }
    }
  
    return { vertices, indices };
  }
  
  function vertexSepatu(x_awal, y_awal, z_awal, panjang, lebar, tinggi, r, g, b,) {
    var vertex = [];
    vertex.push(x_awal, y_awal, z_awal, r, g, b);
    vertex.push(x_awal + panjang, y_awal, z_awal, r, g, b);
    vertex.push(x_awal + panjang, y_awal + tinggi, z_awal, r, g, b);
    vertex.push(x_awal, y_awal + tinggi, z_awal, r, g, b);
    vertex.push(x_awal, y_awal, z_awal - lebar, r, g, b);
    vertex.push(x_awal + panjang, y_awal, z_awal - lebar, r, g, b);
    vertex.push(x_awal + panjang, y_awal + tinggi, z_awal - lebar, r, g, b);
    vertex.push(x_awal, y_awal + tinggi, z_awal - lebar, r, g, b);
  
    return vertex;
  }
  function indeksSepatu() {
    var indices = [];
  
    indices.push(0);
    indices.push(1);
    indices.push(2);
  
    indices.push(2);
    indices.push(0);
    indices.push(3);
  
    indices.push(1);
    indices.push(2);
    indices.push(5);
  
    indices.push(2);
    indices.push(5);
    indices.push(6);
  
    indices.push(4);
    indices.push(5);
    indices.push(6);
  
    indices.push(4);
    indices.push(6);
    indices.push(7);
  
    indices.push(3);
    indices.push(0);
    indices.push(4);
  
    indices.push(3);
    indices.push(4);
    indices.push(7);
  
    indices.push(3);
    indices.push(2);
    indices.push(7);
  
    indices.push(2);
    indices.push(6);
    indices.push(7);
  
    indices.push(0);
    indices.push(1);
    indices.push(4);
  
    indices.push(1);
    indices.push(4);
    indices.push(5);
  
    return indices;
  }