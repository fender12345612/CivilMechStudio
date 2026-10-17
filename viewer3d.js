/*************************************************************************
 * PART 3: 3D INTERACTIVE STRUCTURAL ANALYSIS VIEWER
 * 360° Orbit Rotation, Pan, Zoom, 3D Extruded Members & Real-Time Forces
 *************************************************************************/

let cam3D = {
  yaw: -0.62,
  pitch: 0.42,
  zoom: 62,
  panX: 0,
  panY: 40,
  source: '2d', // '2d' or '1d'
  loadFactor: 1.0,
  animating: false,
  animPhase: 0,
  animReqId: null,
  isOrbiting: false,
  isPanning: false,
  lastX: 0,
  lastY: 0
};

function set3DSource(src) {
  cam3D.source = src;
  const b2d = document.getElementById('btn3DSrc2D');
  const b1d = document.getElementById('btn3DSrc1D');
  if (b2d && b1d) {
    b2d.className = src === '2d'
      ? 'px-3 py-1 rounded-md bg-indigo-600 text-white'
      : 'px-3 py-1 rounded-md text-slate-600 dark:text-slate-400';
    b1d.className = src === '1d'
      ? 'px-3 py-1 rounded-md bg-indigo-600 text-white'
      : 'px-3 py-1 rounded-md text-slate-600 dark:text-slate-400';
  }
  render3DScene();
}

function on3DLoadFactorChange(val) {
  cam3D.loadFactor = parseFloat(val) || 1.0;
  const lbl = document.getElementById('lbl3DLoadFactor');
  if (lbl) lbl.innerText = `${cam3D.loadFactor.toFixed(1)}x`;
  render3DScene();
}

function set3DCameraPreset(preset) {
  if (preset === 'iso') { cam3D.yaw = -0.62; cam3D.pitch = 0.42; cam3D.panX = 0; cam3D.panY = 40; }
  else if (preset === 'front') { cam3D.yaw = 0.0; cam3D.pitch = 0.05; cam3D.panX = 0; cam3D.panY = 40; }
  else if (preset === 'side') { cam3D.yaw = -Math.PI / 2; cam3D.pitch = 0.08; cam3D.panX = 0; cam3D.panY = 40; }
  else if (preset === 'top') { cam3D.yaw = 0.0; cam3D.pitch = 1.45; cam3D.panX = 0; cam3D.panY = 0; }
  render3DScene();
}

function toggle3DAnimation() {
  const chk = document.getElementById('chk3DAnimate');
  cam3D.animating = chk ? chk.checked : false;
  if (cam3D.animating) {
    const step = () => {
      if (!cam3D.animating || currentWorkspace !== '3d') return;
      cam3D.animPhase += 0.06;
      render3DScene();
      cam3D.animReqId = requestAnimationFrame(step);
    };
    cam3D.animReqId = requestAnimationFrame(step);
  } else if (cam3D.animReqId) {
    cancelAnimationFrame(cam3D.animReqId);
    render3DScene();
  }
}

function resize3DCanvas() {
  const c = document.getElementById('canvas3DViewer');
  if (!c) return;
  const rect = c.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = window.devicePixelRatio || 1;
  c.width = rect.width * dpr;
  c.height = rect.height * dpr;
}

// 3D Point Projection (World X right, Y up, Z depth -> Screen X, Y, depth)
function project3D(x, y, z, cx, cy, centerModelX, centerModelY) {
  const rx = x - centerModelX;
  const ry = y - centerModelY;
  const rz = z;

  const cosY = Math.cos(cam3D.yaw), sinY = Math.sin(cam3D.yaw);
  const cosP = Math.cos(cam3D.pitch), sinP = Math.sin(cam3D.pitch);

  // Rotate around Y axis (yaw)
  const x1 = rx * cosY - rz * sinY;
  const z1 = rx * sinY + rz * cosY;

  // Rotate around X axis (pitch)
  const y2 = ry * cosP - z1 * sinP;
  const z2 = ry * sinP + z1 * cosP;

  // Perspective factor
  const fov = 950;
  const dist = fov / Math.max(200, fov + z2 * cam3D.zoom * 0.35);
  const scale = cam3D.zoom * dist;

  return {
    x: cx + cam3D.panX + x1 * scale,
    y: cy + cam3D.panY - y2 * scale,
    depth: z2
  };
}

// Helper to draw a 3D Arrow with label
function draw3DArrow(ctx, pStart, pEnd, color, labelText) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(pStart.x, pStart.y);
  ctx.lineTo(pEnd.x, pEnd.y);
  ctx.stroke();

  const ang = Math.atan2(pEnd.y - pStart.y, pEnd.x - pStart.x);
  const headLen = 9;
  ctx.beginPath();
  ctx.moveTo(pEnd.x, pEnd.y);
  ctx.lineTo(pEnd.x - headLen * Math.cos(ang - 0.4), pEnd.y - headLen * Math.sin(ang - 0.4));
  ctx.lineTo(pEnd.x - headLen * Math.cos(ang + 0.4), pEnd.y - headLen * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();

  if (labelText) {
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.textAlign = 'center';
    const tx = pStart.x + (pStart.x - pEnd.x) * 0.22;
    const ty = pStart.y + (pStart.y - pEnd.y) * 0.22 - 4;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    const wText = ctx.measureText(labelText).width + 8;
    ctx.fillRect(tx - wText / 2, ty - 11, wText, 15);
    ctx.fillStyle = color;
    ctx.fillText(labelText, tx, ty);
  }
  ctx.restore();
}

// Draw a 3D Extruded Structural Member Box/I-Beam between 3D points A and B
function draw3DExtrudedMember(ctx, A, B, projFn, widthZ, heightY, baseColor, isTruss) {
  const dx = B.x - A.x, dy = B.y - A.y, dz = B.z - A.z;
  const L = Math.hypot(dx, dy, dz) || 1;
  // Normal in XY plane
  const nx = -dy / L, ny = dx / L;
  const hz = isTruss ? widthZ * 0.55 : widthZ;
  const hy = isTruss ? heightY * 0.55 : heightY;

  // 4 corners at start A and 4 corners at end B
  const cA = [
    projFn(A.x + nx * hy, A.y + ny * hy, A.z - hz),
    projFn(A.x + nx * hy, A.y + ny * hy, A.z + hz),
    projFn(A.x - nx * hy, A.y - ny * hy, A.z + hz),
    projFn(A.x - nx * hy, A.y - ny * hy, A.z - hz)
  ];
  const cB = [
    projFn(B.x + nx * hy, B.y + ny * hy, B.z - hz),
    projFn(B.x + nx * hy, B.y + ny * hy, B.z + hz),
    projFn(B.x - nx * hy, B.y - ny * hy, B.z + hz),
    projFn(B.x - nx * hy, B.y - ny * hy, B.z - hz)
  ];

  // Draw 4 side faces of the 3D member prism
  const faces = [
    [cA[0], cA[1], cB[1], cB[0]],
    [cA[1], cA[2], cB[2], cB[1]],
    [cA[2], cA[3], cB[3], cB[2]],
    [cA[3], cA[0], cB[0], cB[3]]
  ];

  faces.forEach((f, idx) => {
    ctx.beginPath();
    ctx.moveTo(f[0].x, f[0].y);
    ctx.lineTo(f[1].x, f[1].y);
    ctx.lineTo(f[2].x, f[2].y);
    ctx.lineTo(f[3].x, f[3].y);
    ctx.closePath();
    ctx.fillStyle = baseColor;
    ctx.globalAlpha = idx % 2 === 0 ? 0.82 : 0.62;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function render3DScene() {
  const canvas = document.getElementById('canvas3DViewer');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const cx = W / 2;
  const cy = H / 2;

  // Deep Engineering 3D Viewport Background
  const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(W, H) * 0.75);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const dynFactor = cam3D.loadFactor * (cam3D.animating ? (0.65 + 0.35 * Math.sin(cam3D.animPhase)) : 1.0);
  const showDefl = document.getElementById('chk3DDeformed')?.checked;

  if (cam3D.source === '2d' && frame2D.nodes.length > 0) {
    // Center of 2D model
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    frame2D.nodes.forEach(n => {
      if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const proj = (x, y, z) => project3D(x, y, z, cx, cy, centerX, centerY);

    // Draw 3D Ground Reference Grid Plane at Y = 0
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.55)';
    ctx.lineWidth = 1;
    for (let gx = Math.floor(minX) - 2; gx <= Math.ceil(maxX) + 2; gx += 1) {
      const p1 = proj(gx, 0, -2.5), p2 = proj(gx, 0, 2.5);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    for (let gz = -2; gz <= 2; gz += 1) {
      const p1 = proj(minX - 2, 0, gz), p2 = proj(maxX + 2, 0, gz);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    const nodeMap = {};
    frame2D.nodes.forEach(n => { nodeMap[n.id] = n; });
    const deflScale = showDefl && frame2D.maxDelta > 0 ? (0.45 / (frame2D.maxDelta / 1000)) * dynFactor : 0;

    // 1. Draw 3D Extruded Members (with front and optional rear 3D bay frame extrusion)
    const bayDepthZ = 1.2; // 3D bay depth in meters
    const chkSec = document.getElementById('chk3DSecondaryBay');
    const showSecondary = chkSec ? chkSec.checked : true;
    const zPlanes = showSecondary ? [-bayDepthZ / 2, bayDepthZ / 2] : [-bayDepthZ / 2];

    zPlanes.forEach((zPlane, planeIdx) => {
      frame2D.members.forEach(m => {
        const n1 = nodeMap[m.n1], n2 = nodeMap[m.n2];
        if (!n1 || !n2) return;
        const A = {
          x: n1.x + (n1.ux || 0) * deflScale,
          y: n1.y + (n1.uy || 0) * deflScale,
          z: zPlane
        };
        const B = {
          x: n2.x + (n2.ux || 0) * deflScale,
          y: n2.y + (n2.uy || 0) * deflScale,
          z: zPlane
        };

        // Color code by Axial Force N (Sky Blue = Tension/Flexure, Amber = Compression)
        const Nval = (m.N || 0) * dynFactor;
        const col = Nval < -0.5 ? '#f59e0b' : '#38bdf8';
        draw3DExtrudedMember(ctx, A, B, proj, 0.11, 0.12, planeIdx === 0 ? col : '#475569', m.type === 'truss');

        // Member Force Label on front plane
        if (planeIdx === 0) {
          const midP = proj((A.x + B.x) / 2, (A.y + B.y) / 2, zPlane);
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText(`M${m.id}: N=${Units.force(Nval).toFixed(1)}${Units.uForce()}`, midP.x, midP.y - 6);
        }
      });
    });

    // Connect front and rear 3D frames with transverse purlins at elevated nodes (only if secondary bay enabled)
    if (showSecondary) {
      frame2D.nodes.forEach(n => {
        const xDef = n.x + (n.ux || 0) * deflScale;
        const yDef = n.y + (n.uy || 0) * deflScale;
        if (n.y > 0.1) {
          const pFront = proj(xDef, yDef, -bayDepthZ / 2);
          const pBack = proj(xDef, yDef, bayDepthZ / 2);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(pFront.x, pFront.y);
          ctx.lineTo(pBack.x, pBack.y);
          ctx.stroke();
        }
      });
    }

    // 2. Draw 3D Supports, Applied Loads & Live Support Reactions on Front Frame
    const zFront = -bayDepthZ / 2;
    frame2D.members.forEach(m => {
      if (m.w && Math.abs(m.w) > 0) {
        const n1 = nodeMap[m.n1], n2 = nodeMap[m.n2];
        if (!n1 || !n2) return;
        const wScaled = m.w * dynFactor;
        for (let k = 0; k <= 4; k++) {
          const t = k / 4;
          const wx = n1.x + (n2.x - n1.x) * t + ((n1.ux || 0) * (1 - t) + (n2.ux || 0) * t) * deflScale;
          const wy = n1.y + (n2.y - n1.y) * t + ((n1.uy || 0) * (1 - t) + (n2.uy || 0) * t) * deflScale;
          const pTop = proj(wx, wy + 0.9, zFront);
          const pBot = proj(wx, wy + 0.15, zFront);
          draw3DArrow(ctx, pTop, pBot, '#f43f5e', k === 2 ? `${Units.dist(wScaled).toFixed(2)} ${Units.uDist()}` : '');
        }
      }
    });

    frame2D.nodes.forEach(n => {
      const xDef = n.x + (n.ux || 0) * deflScale;
      const yDef = n.y + (n.uy || 0) * deflScale;
      const pNode = proj(xDef, yDef, zFront);

      // Node Sphere
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pNode.x, pNode.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Nodal Point Loads
      if (n.fy && Math.abs(n.fy) > 0) {
        const fyVal = n.fy * dynFactor;
        const pStart = proj(xDef, yDef + 1.25, zFront);
        const pEnd = proj(xDef, yDef + 0.15, zFront);
        draw3DArrow(ctx, pStart, pEnd, '#f43f5e', `${Units.force(Math.abs(fyVal)).toFixed(1)} ${Units.uForce()}`);
      }
      if (n.fx && Math.abs(n.fx) > 0) {
        const fxVal = n.fx * dynFactor;
        const pStart = proj(xDef - 1.2 * Math.sign(fxVal), yDef, zFront);
        const pEnd = proj(xDef - 0.15 * Math.sign(fxVal), yDef, zFront);
        draw3DArrow(ctx, pStart, pEnd, '#f43f5e', `${Units.force(Math.abs(fxVal)).toFixed(1)} ${Units.uForce()}`);
      }

      // Support Reactions in 3D
      if (n.support && n.support !== 'none') {
        const ryVal = (n.ry || 0) * dynFactor;
        const pStart = proj(n.x, n.y - 1.15, zFront);
        const pEnd = proj(n.x, n.y - 0.12, zFront);
        draw3DArrow(ctx, pStart, pEnd, '#10b981', `Ry=${Units.force(ryVal).toFixed(1)}${Units.uForce()}`);
      }
    });

    const hudEl = document.getElementById('hud3DSummary');
    if (hudEl) {
      hudEl.innerHTML = `
        <div>Model: <strong>${frame2D.title}</strong></div>
        <div>Load Multiplier: <strong>${dynFactor.toFixed(2)}x</strong></div>
        <div>Max Axial |N|: <strong>${Units.force(frame2D.maxN * dynFactor).toFixed(2)} ${Units.uForce()}</strong></div>
        <div>Max Moment |M|: <strong>${Units.mom(frame2D.maxM * dynFactor).toFixed(2)} ${Units.uMom()}</strong></div>
        <div>Max Deflection |δ|: <strong>${Units.defl(frame2D.maxDelta * dynFactor).toFixed(3)} ${Units.uDefl()}</strong></div>
      `;
    }
  } else {
    // 1D BEAM MODEL IN 3D
    const L = model.length;
    const proj = (x, y, z) => project3D(x, y, z, cx, cy, L / 2, 0);
    const maxAbsD = Math.max(0.01, Math.abs(solution.maxDelta.val));
    const defScale = showDefl ? (0.45 / maxAbsD) * dynFactor : 0;

    // Draw 3D Beam Segments along X
    const step = 12;
    for (let i = 0; i < solution.samples.length - step; i += step) {
      const s1 = solution.samples[i];
      const s2 = solution.samples[Math.min(solution.samples.length - 1, i + step)];
      const A = { x: s1.x, y: s1.defl * defScale, z: 0 };
      const B = { x: s2.x, y: s2.defl * defScale, z: 0 };
      const col = Math.abs(s1.M) > Math.abs(solution.maxM.val) * 0.6 ? '#a855f7' : '#38bdf8';
      draw3DExtrudedMember(ctx, A, B, proj, 0.16, 0.18, col, false);
    }

    // Supports & Reactions in 3D
    solution.reactions.forEach(r => {
      const ryVal = r.Ry * dynFactor;
      const pStart = proj(r.x, -1.1, 0);
      const pEnd = proj(r.x, -0.2, 0);
      draw3DArrow(ctx, pStart, pEnd, '#10b981', `R=${Units.force(ryVal).toFixed(2)}${Units.uForce()}`);
    });

    // Loads in 3D
    model.loads.forEach(l => {
      if (l.type === 'point') {
        const pVal = l.P * dynFactor;
        const pStart = proj(l.x, 1.2, 0);
        const pEnd = proj(l.x, 0.2, 0);
        draw3DArrow(ctx, pStart, pEnd, '#f43f5e', `${Units.force(pVal).toFixed(1)}${Units.uForce()}`);
      }
    });

    const hudEl = document.getElementById('hud3DSummary');
    if (hudEl) {
      const secDesc = model.ignoreSection
        ? (currentLang === 'th' ? 'ไม่คิดหน้าตัด • EI คงที่' : 'No Section • Const EI')
        : model.sectionName;
      const deflDesc = model.ignoreSection
        ? `<div>Max |EIδ|: <strong>${Units.eiDelta(solution.maxDelta.val * dynFactor).toFixed(3)} ${Units.uEIDelta()}</strong></div>`
        : `<div>Max Deflection |δ|: <strong>${Units.defl(solution.maxDelta.val * dynFactor).toFixed(3)} ${Units.uDefl()}</strong></div>`;
      hudEl.innerHTML = `
        <div>1D Beam: <strong>${model.name} (${secDesc})</strong></div>
        <div>Load Multiplier: <strong>${dynFactor.toFixed(2)}x</strong></div>
        <div>Max Shear |V|: <strong>${Units.force(Math.abs(solution.maxV.val) * dynFactor).toFixed(2)} ${Units.uForce()}</strong></div>
        <div>Max Moment |M|: <strong>${Units.mom(Math.abs(solution.maxM.val) * dynFactor).toFixed(2)} ${Units.uMom()}</strong></div>
        ${deflDesc}
      `;
    }
  }

  ctx.restore();
}

window.zoom3DMobile = function(factor) {
  cam3D.zoom = Math.max(22, Math.min(160, cam3D.zoom * factor));
  render3DScene();
};

window.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('canvas3DViewer');
  if (!c) return;

  c.addEventListener('mousedown', e => {
    if (e.button === 2 || e.button === 1 || e.shiftKey) {
      cam3D.isPanning = true;
    } else {
      cam3D.isOrbiting = true;
    }
    cam3D.lastX = e.clientX;
    cam3D.lastY = e.clientY;
  });

  window.addEventListener('mousemove', e => {
    if (!cam3D.isOrbiting && !cam3D.isPanning) return;
    const dx = e.clientX - cam3D.lastX;
    const dy = e.clientY - cam3D.lastY;
    cam3D.lastX = e.clientX;
    cam3D.lastY = e.clientY;

    if (cam3D.isOrbiting) {
      cam3D.yaw += dx * 0.008;
      cam3D.pitch = Math.max(-1.2, Math.min(1.45, cam3D.pitch + dy * 0.008));
    } else if (cam3D.isPanning) {
      cam3D.panX += dx;
      cam3D.panY += dy;
    }
    render3DScene();
  });

  window.addEventListener('mouseup', () => {
    cam3D.isOrbiting = false;
    cam3D.isPanning = false;
  });

  // Mobile Touch Support: 1-finger Orbit, 2-finger Pan + Pinch-to-Zoom
  let touch3DLastDist = 0;
  let touch3DLastMidX = 0;
  let touch3DLastMidY = 0;

  c.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      cam3D.isOrbiting = true;
      cam3D.isPanning = false;
      cam3D.lastX = e.touches[0].clientX;
      cam3D.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      cam3D.isOrbiting = false;
      cam3D.isPanning = true;
      const t1 = e.touches[0], t2 = e.touches[1];
      touch3DLastDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touch3DLastMidX = (t1.clientX + t2.clientX) / 2;
      touch3DLastMidY = (t1.clientY + t2.clientY) / 2;
    }
  }, { passive: false });

  c.addEventListener('touchmove', e => {
    if (e.touches.length === 1 && cam3D.isOrbiting) {
      e.preventDefault();
      const dx = e.touches[0].clientX - cam3D.lastX;
      const dy = e.touches[0].clientY - cam3D.lastY;
      cam3D.lastX = e.touches[0].clientX;
      cam3D.lastY = e.touches[0].clientY;
      cam3D.yaw += dx * 0.009;
      cam3D.pitch = Math.max(-1.2, Math.min(1.45, cam3D.pitch + dy * 0.009));
      render3DScene();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      if (touch3DLastDist > 10) {
        const scale = dist / touch3DLastDist;
        cam3D.zoom = Math.max(22, Math.min(160, cam3D.zoom * scale));
      }
      cam3D.panX += (midX - touch3DLastMidX);
      cam3D.panY += (midY - touch3DLastMidY);

      touch3DLastDist = dist;
      touch3DLastMidX = midX;
      touch3DLastMidY = midY;
      render3DScene();
    }
  }, { passive: false });

  c.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
      cam3D.isOrbiting = false;
      cam3D.isPanning = false;
    } else if (e.touches.length === 1) {
      cam3D.isPanning = false;
      cam3D.isOrbiting = true;
      cam3D.lastX = e.touches[0].clientX;
      cam3D.lastY = e.touches[0].clientY;
    }
  });

  c.addEventListener('contextmenu', e => e.preventDefault());
  c.addEventListener('wheel', e => {
    e.preventDefault();
    cam3D.zoom = Math.max(22, Math.min(160, cam3D.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
    render3DScene();
  }, { passive: false });
});

