"use strict";
/* Draw the layered computer in an isometric projection. All coordinates are in board units. */
function drawBoard(canvas, selected = 0) {
  const rect = canvas.getBoundingClientRect(),
    ratio = Math.min(devicePixelRatio || 1, 2);
  const w = rect.width,
    h = rect.height;
  if (!w || !h) return;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  const c = canvas.getContext("2d");
  c.scale(ratio, ratio);
  c.fillStyle = "#39334f";
  c.fillRect(0, 0, w, h);
  c.fillStyle = "#797087";
  for (let y = 9; y < h; y += 14)
    for (let x = 9; x < w; x += 14) c.fillRect(x, y, 1, 1);
  const s = Math.min(w / 380, h / 265);
  const p = (x, y, z = 0) => [
    w * 0.49 + (x - y) * s,
    h * 0.63 + ((x + y) * 0.49 - z) * s,
  ];
  function path(points, fill, stroke, width = 1) {
    c.beginPath();
    points.map((v, i) => (i ? c.lineTo(...v) : c.moveTo(...v)));
    if (fill) {
      c.closePath();
      c.fillStyle = fill;
      c.fill();
    }
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = width * s;
      c.stroke();
    }
  }
  function face(pts, fill, stroke = "#c3b9d6", width = 0.7) {
    path(
      pts.map((v) => p(...v)),
      fill,
      stroke,
      width,
    );
  }
  function line(pts, color, width = 0.7) {
    face(pts, null, color, width);
  }
  function box(x, y, a, b, z, d, top, side = "#736780", edge = "#d4cbdd") {
    face(
      [
        [x, y + b, z],
        [x + a, y + b, z],
        [x + a, y + b, z + d],
        [x, y + b, z + d],
      ],
      side,
      edge,
    );
    face(
      [
        [x + a, y, z],
        [x + a, y + b, z],
        [x + a, y + b, z + d],
        [x + a, y, z + d],
      ],
      side,
      edge,
    );
    face(
      [
        [x, y, z + d],
        [x + a, y, z + d],
        [x + a, y + b, z + d],
        [x, y + b, z + d],
      ],
      top,
      edge,
    );
  }
  const ink = "#dbd2e7",
    green = "#d5eb83",
    peach = "#f5b99a";
  box(-82, -60, 160, 114, -4, 5, "#564c69", "#49405c");
  for (let i = 0; i < 11; i++) {
    let y = -50 + i * 8;
    line(
      [
        [-77, y, 2],
        [-53, y, 2],
        [-43, y + 9, 2],
        [-25, y + 9, 2],
      ],
      "#a79cb5",
      0.55,
    );
    line(
      [
        [67, y, 2],
        [60, y, 2],
        [53, y + 5, 2],
        [39, y + 5, 2],
      ],
      "#aa9db4",
      0.6,
    );
  }
  for (let k = 0; k < 4; k++) {
    const x = k % 2 ? 68 : -73,
      y = k < 2 ? -51 : 46;
    const [sx, sy] = p(x, y, 2);
    c.beginPath();
    c.ellipse(sx, sy, 3 * s, 1.65 * s, 0, 0, Math.PI * 2);
    c.strokeStyle = "#b7abc5";
    c.stroke();
  }
  // Bus connectors along the front edge.
  for (let i = 0; i < 20; i++)
    box(-66 + i * 6, 48, 3, 5, 1, 1, "#c2ad86", "#6d5e5a", "#cfbc98");
  // I/O controller and external pins.
  box(41, 7, 29, 29, 2, 7, selected === 2 ? green : "#b7a8c6", "#655b76");
  for (let i = 0; i < 7; i++) {
    line(
      [
        [38, 9 + i * 3.6, 2],
        [41, 9 + i * 3.6, 7],
      ],
      ink,
    );
    line(
      [
        [70, 9 + i * 3.6, 7],
        [73, 9 + i * 3.6, 2],
      ],
      ink,
    );
  }
  // Two DIMMs, individual memory packages and contacts.
  for (let k = 0; k < 2; k++) {
    const y = -43 + k * 13;
    box(10, y, 55, 4, 2, 20, selected === 1 ? green : "#a99bc0", "#827490");
    for (let i = 0; i < 5; i++)
      box(13 + i * 10, y + 4, 7, 1, 9, 10, "#5c526e", "#585064");
    for (let i = 0; i < 12; i++)
      line(
        [
          [12 + i * 4, y + 4, 3],
          [12 + i * 4, y + 4, 6],
        ],
        peach,
        0.9,
      );
  }
  // Exploded processor socket, substrate, carrier and die.
  box(-47, -12, 59, 53, 2, 5, "#82738f", "#51495f");
  for (let i = 0; i < 12; i++) {
    line(
      [
        [-48, -10 + i * 4, 8],
        [-53, -10 + i * 4, 3],
      ],
      ink,
    );
    line(
      [
        [-44 + i * 4.7, 42, 8],
        [-44 + i * 4.7, 46, 3],
      ],
      ink,
    );
  }
  c.setLineDash([2 * s, 3 * s]);
  for (const [x, y] of [
    [-45, -10],
    [9, -10],
    [9, 38],
    [-45, 38],
  ])
    line(
      [
        [x, y, 9],
        [x, y, 52],
      ],
      "#b8abc6",
      0.8,
    );
  c.setLineDash([]);
  box(-46, -11, 56, 50, 30, 4, "#a99abc", "#665b78");
  for (let i = 0; i < 9; i++) {
    line(
      [
        [-43 + i * 5.8, 35, 35],
        [-43 + i * 5.8, 29, 35],
        [-40 + i * 5.8, 26, 35],
      ],
      "#5b4f67",
      0.75,
    );
  }
  box(
    -39,
    -6,
    43,
    38,
    51,
    5,
    selected === 0 ? green : "#b3b09e",
    "#7b805e",
    "#dfedaa",
  );
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 4; j++)
      face(
        [
          [-35 + i * 7, -3 + j * 7, 56],
          [-29 + i * 7, -3 + j * 7, 56],
          [-29 + i * 7, 3 + j * 7, 56],
          [-35 + i * 7, 3 + j * 7, 56],
        ],
        (i + j) % 3 === 0 ? "#879c58" : "#aebe76",
        "#586647",
        0.55,
      );
  // Leader and label for the hardware being examined.
  const loc = [
    [-20, 10, 58],
    [37, -35, 22],
    [53, 19, 10],
  ][selected];
  const start = p(...loc);
  const end = [Math.min(w - 55 * s, start[0] + 72 * s), start[1] - 33 * s];
  path([start, [start[0] + 17 * s, end[1]], end], null, "#e4eabd", 0.8);
  c.fillStyle = green;
  c.beginPath();
  c.arc(...start, 2.1 * s, 0, 2 * Math.PI);
  c.fill();
  c.fillStyle = "#f8f5e9";
  c.font = "bold " + Math.max(10, 10 * s) + "px monospace";
  c.fillText(["CPU", "RAM", "I/O"][selected], end[0] + 3 * s, end[1] + 3 * s);
}
function drawMini(el, id) {
  const w = el.clientWidth,
    h = el.clientHeight,
    dpr = Math.min(devicePixelRatio || 1, 2);
  if (!w || !h) return;
  el.width = w * dpr;
  el.height = h * dpr;
  const c = el.getContext("2d");
  c.scale(dpr, dpr);
  const s = Math.min(w / 168, h / 68);
  c.translate(w * 0.5 - 78 * s, h * 0.5 - 28 * s);
  c.scale(s, s);
  c.lineWidth = 1.25;
  c.strokeStyle = "#4c4853";
  c.fillStyle = "#fefcf433";
  const path = (pts, fill = false) => {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    if (fill) {
      c.closePath();
      c.fill();
    }
    c.stroke();
  };
  if (id === 0) {
    for (let k = 0; k < 3; k++) {
      let x = 14 + k * 43,
        y = 11 + k * 4;
      c.fillStyle = k === 2 ? "#a1a873" : "#e9efcc";
      c.fillRect(x, y, 39, 28);
      c.strokeRect(x, y, 39, 28);
      path([
        [x, y + 7],
        [x + 39, y + 7],
      ]);
      path([
        [x + 6, y + 12],
        [x + 11, y + 16],
        [x + 6, y + 20],
      ]);
      path([
        [x + 15, y + 20],
        [x + 22, y + 20],
      ]);
    }
  }
  if (id === 1) {
    for (let k = 0; k < 3; k++) {
      let x = 23 + k * 36,
        y = 14 + (k % 2) * 9;
      c.beginPath();
      c.ellipse(x + 20, y + 16, 19, 6, 0, 0, 7);
      c.fill();
      c.stroke();
      path([
        [x + 1, y],
        [x + 1, y + 16],
      ]);
      path([
        [x + 39, y],
        [x + 39, y + 16],
      ]);
      c.beginPath();
      c.ellipse(x + 20, y, 19, 6, 0, 0, 7);
      c.fillStyle = ["#d7c3ea", "#cec0df", "#d7c3ea"][k];
      c.fill();
      c.stroke();
    }
  }
  if (id === 2) {
    for (let k = 2; k >= 0; k--) {
      let y = 6 + k * 7;
      c.fillStyle = ["#f1caac", "#dec4b1", "#c6ac99"][k];
      path(
        [
          [24, y + 19],
          [91, y],
          [135, y + 14],
          [68, y + 34],
        ],
        true,
      );
    }
    for (let i = 0; i < 5; i++)
      path([
        [38 + i * 11, 22 - i * 3.1],
        [66 + i * 11, 31 - i * 3.1],
      ]);
  }
  if (id === 3) {
    for (let k = 0; k < 3; k++) {
      let y = 10 + k * 14;
      path([
        [12, y],
        [42, y],
        [58, 38 - k * 13],
        [93, 38 - k * 13],
        [112, y],
        [146, y],
      ]);
      for (let x of [12, 146]) {
        c.beginPath();
        c.arc(x, y, 2.6, 0, 7);
        c.fillStyle = "#808e9b";
        c.fill();
        c.stroke();
      }
    }
  }
}
