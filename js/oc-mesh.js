/* Continuous 2D deformation: one connected mesh avoids gaps between body parts. */
(function () {
  'use strict';
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function RigMesh(canvas, texture, width, height) {
    this.canvas = canvas; this.texture = texture; this.w = width; this.h = height; this.top = 112;
    canvas.width = width; canvas.height = height + this.top;
    canvas.style.aspectRatio = width + ' / ' + canvas.height;
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, powerPreference: 'low-power' }); } catch (_) {}
    if (gl) {
      try { this.initGL(gl); this.gl = gl; } catch (_) { gl = null; }
    }
    if (!gl) {
      // A failed GL context cannot become a 2D context on the same element.
      var replacement = canvas.cloneNode(); canvas.replaceWith(replacement); this.canvas = replacement;
      this.context = replacement.getContext('2d');
    }
    this.cols = this.gl ? 40 : 18; this.rows = this.gl ? 36 : 18;
    this.vertices = []; this.indices = []; this.positions = new Float32Array((this.cols + 1) * (this.rows + 1) * 2);
    var uv = [];
    for (var row = 0; row <= this.rows; row++) {
      for (var col = 0; col <= this.cols; col++) {
        var x = col / this.cols * width, y = row / this.rows * height;
        var braidCenter = 415 - Math.max(0, y - 650) * .40;
        var braidL = smooth(625, 820, y) * (1 - smooth(42, 103, Math.abs(x - braidCenter)));
        var braidR = smooth(625, 820, y) * (1 - smooth(42, 103, Math.abs(x - (1374 - braidCenter))));
        this.vertices.push({ x: x, y: y, head: 1 - smooth(613, 745, y),
          left: braidL, right: braidR,
          tuft: (1 - smooth(78, 110, y)) * smooth(635, 675, x) * (1 - smooth(817, 858, x)),
          pad: smooth(730, 785, y) * (1 - smooth(936, 1030, y)) * (1 - smooth(172, 265, Math.abs(x - 686))),
          face: smooth(425, 465, x) * (1 - smooth(910, 960, x)) * smooth(300, 410, y) * (1 - smooth(590, 645, y))
        });
        uv.push(col / this.cols, row / this.rows);
        if (row < this.rows && col < this.cols) {
          var a = row * (this.cols + 1) + col, b = a + this.cols + 1;
          this.indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    if (this.gl) {
      gl = this.gl;
      this.vertexBuffer = gl.createBuffer(); this.uvBuffer = gl.createBuffer(); this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
      this.imageTexture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  }
  RigMesh.prototype.initGL = function (gl) {
    function shader(type, text) {
      var s = gl.createShader(type); gl.shaderSource(s, text); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('mesh shader'); return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, 'attribute vec2 position;attribute vec2 uv;uniform vec2 resolution;varying vec2 vUV;void main(){vUV=uv;gl_Position=vec4(position.x/resolution.x*2.0-1.0,1.0-position.y/resolution.y*2.0,0.,1.);}'));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec2 vUV;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,vUV);}'));
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('mesh program');
    this.program = p; this.positionLocation = gl.getAttribLocation(p, 'position'); this.uvLocation = gl.getAttribLocation(p, 'uv');
    this.resolutionLocation = gl.getUniformLocation(p, 'resolution'); this.imageLocation = gl.getUniformLocation(p, 'image');
  };
  RigMesh.prototype.draw = function (pose) {
    var co = Math.cos(pose.body), si = Math.sin(pose.body), hc = Math.cos(pose.head), hs = Math.sin(pose.head);
    var lc = Math.cos(pose.hairL), ls = Math.sin(pose.hairL), rc = Math.cos(pose.hairR), rs = Math.sin(pose.hairR);
    var tc = Math.cos(pose.tuft), ts = Math.sin(pose.tuft), pc = Math.cos(pose.pad), ps = Math.sin(pose.pad);
    var positions = this.positions, top = this.top;
    this.vertices.forEach(function (v, i) {
      var x = v.x, y = v.y;
      // Local motion first, followed by the parent head and torso transforms.
      var hx = x - 415, hy = y - 655;
      var rx = x - 959;
      x += (hx * lc - hy * ls - hx) * v.left + (rx * rc - hy * rs - rx) * v.right;
      y += (hx * ls + hy * lc - hy) * v.left + (rx * rs + hy * rc - hy) * v.right;
      var tx = v.x - 696, ty = v.y - 94;
      x += (tx * tc - ty * ts - tx) * v.tuft; y += (tx * ts + ty * tc - ty) * v.tuft;
      var px = v.x - 686, py = v.y - 850;
      x += (px * pc - py * ps - px) * v.pad;
      y += (px * ps + py * pc - py + pose.padY) * v.pad;
      // Soft yaw / pitch gives the face depth while the continuous neck stays attached.
      x += (pose.yaw * 9 + (v.x - 686) * (pose.faceWidth - 1)) * v.face;
      y += pose.pitch * 3 * v.face;
      hx = x - 686; hy = y - 657;
      x += (hx * hc - hy * hs - hx + pose.headX) * v.head;
      y += (hx * hs + hy * hc - hy + pose.headY + hy * pose.pitch * -.012) * v.head;
      // Breathing expands the chest more than the anchored lower torso.
      x += (x - 686) * pose.breath * .003 * (1 - v.head);
      y += pose.breath * -6 * (1 - smooth(880, 1147, v.y));
      y = 1000 + (y - 1000) * (1 + (pose.stretch || 0));
      var bx = x - 686, by = y - 1090;
      positions[i * 2] = 686 + bx * co - by * si + pose.x;
      positions[i * 2 + 1] = 1090 + bx * si + by * co + pose.y + pose.rise + top;
    });
    if (this.gl) this.drawGL(); else this.draw2D();
  };
  RigMesh.prototype.drawGL = function () {
    var gl = this.gl; if (gl.isContextLost()) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program); gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.positionLocation); gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer); gl.enableVertexAttribArray(this.uvLocation); gl.vertexAttribPointer(this.uvLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.texture); gl.uniform1i(this.imageLocation, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  };
  RigMesh.prototype.draw2D = function () {
    var g = this.context, v = this.vertices, p = this.positions;
    g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.indices.length; i += 3) {
      var ia = this.indices[i], ib = this.indices[i + 1], ic = this.indices[i + 2];
      var a = v[ia], b = v[ib], c = v[ic];
      var ux = b.x - a.x, uy = b.y - a.y, vx = c.x - a.x, vy = c.y - a.y, det = ux * vy - vx * uy;
      var ax = p[ia * 2], ay = p[ia * 2 + 1], bx = p[ib * 2], by = p[ib * 2 + 1], cx = p[ic * 2], cy = p[ic * 2 + 1];
      var ma = ((bx - ax) * vy - (cx - ax) * uy) / det, mc = (ux * (cx - ax) - vx * (bx - ax)) / det;
      var mb = ((by - ay) * vy - (cy - ay) * uy) / det, md = (ux * (cy - ay) - vx * (by - ay)) / det;
      g.save(); g.beginPath();
      var mx = (ax + bx + cx) / 3, my = (ay + by + cy) / 3;
      g.moveTo(ax + (ax - mx) * .007, ay + (ay - my) * .007);
      g.lineTo(bx + (bx - mx) * .007, by + (by - my) * .007);
      g.lineTo(cx + (cx - mx) * .007, cy + (cy - my) * .007); g.closePath(); g.clip();
      g.transform(ma, mb, mc, md, ax - ma * a.x - mc * a.y, ay - mb * a.x - md * a.y);
      // Sample past the cell boundary too, so expanded clips cannot reveal hairline gaps.
      var sx = Math.max(0, Math.min(a.x, b.x, c.x) - 2), sy = Math.max(0, Math.min(a.y, b.y, c.y) - 2);
      var sw = Math.min(this.w, Math.max(a.x, b.x, c.x) + 2) - sx, sh = Math.min(this.h, Math.max(a.y, b.y, c.y) + 2) - sy;
      g.drawImage(this.texture, sx, sy, sw, sh, sx, sy, sw, sh); g.restore();
    }
  };
  window.OCMesh = RigMesh;
})();
