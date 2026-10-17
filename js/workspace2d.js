/*************************************************************************
 * PART 2: 2D STRUCTURAL ANALYSIS — FRAME & TRUSS INTERACTIVE WORKSPACE
 * Real-Time 2D Direct Stiffness Method (DSM) FEA Solver + CAD Canvas
 *************************************************************************/

let frame2D = {
  title: 'Braced two-storey frame',
  E: 200e6,       // kN/m² (200 GPa)
  A_frame: 0.0065, // m² (65 cm²)
  I_frame: 0.00012,// m⁴ (12,000 cm⁴)
  A_truss: 0.0025, // m² (25 cm²)
  I_truss: 1e-7,   // m⁴ (pin-ended release)
  nodes: [],
  members: [],
  solved: false,
  maxN: 0,
  maxV: 0,
  maxM: 0,
  maxDelta: 0
};

let tool2D = 'select';       // 'select', 'node', 'member_frame', 'member_truss', 'support', 'load', 'erase'
let overlay2D = 'none';      // 'none', 'axial', 'shear', 'moment', 'deflection'
let show2DReactions = true;

// Camera & Mouse Interaction State
let cam2D = {
  offsetX: 0,
  offsetY: 0,
  scale: 68, // pixels per meter
  zoomPct: 100
};

let mouse2D = {
  worldX: 0,
  worldY: 0,
  snapX: 0,
  snapY: 0,
  hoveredNodeId: null,
  hoveredMemberId: null,
  selectedNodeId: null,
  selectedMemberId: null,
  draggingNodeId: null,
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
  memberStartNodeId: null
};

// Active category focus tab from the left rail (Nodes, Members, Supports, Loads)
let active2DFocusTab = null;

// Undo / Redo & Version Checkpoints History
let history2D = [];
let redoStack2D = [];

function record2DHistory(actionLabel) {
  const snapshot = JSON.stringify({
    title: frame2D.title,
    nodes: frame2D.nodes.map(n => ({ id: n.id, x: n.x, y: n.y, support: n.support, fx: n.fx, fy: n.fy, mz: n.mz })),
    members: frame2D.members.map(m => ({ id: m.id, n1: m.n1, n2: m.n2, type: m.type, w: m.w }))
  });
  history2D.unshift({
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    label: actionLabel,
    data: snapshot
  });
  if (history2D.length > 25) history2D.pop();
  render2DActivityHistory();
}

function save2DCheckpoint(customLabel) {
  record2DHistory(customLabel || 'Saved Checkpoint');
  showNotification('บันทึก Checkpoint 2D แล้ว', `บันทึกสถานะ "${frame2D.title}" ลงในประวัติเวอร์ชันเรียบร้อย`);
}

function undo2D() {
  if (history2D.length <= 1) return;
  const current = history2D.shift();
  redoStack2D.push(current);
  const prev = JSON.parse(history2D[0].data);
  frame2D.title = prev.title;
  frame2D.nodes = prev.nodes;
  frame2D.members = prev.members;
  solve2DFrame();
  render2DActivityHistory();
}

function redo2D() {
  if (redoStack2D.length === 0) return;
  const next = redoStack2D.pop();
  history2D.unshift(next);
  const state = JSON.parse(next.data);
  frame2D.title = state.title;
  frame2D.nodes = state.nodes;
  frame2D.members = state.members;
  solve2DFrame();
  render2DActivityHistory();
}

function restore2DHistoryByIndex(idx) {
  const item = history2D[idx];
  if (!item) return;
  const state = JSON.parse(item.data);
  frame2D.title = state.title;
  frame2D.nodes = state.nodes;
  frame2D.members = state.members;
  solve2DFrame();
  showNotification('กู้คืนเวอร์ชัน 2D', `กู้คืนโมเดลไปยัง "${item.label}" (${item.time})`);
}

function render2DActivityHistory() {
  const el = document.getElementById('list2DActivityHistory');
  if (!el) return;
  el.innerHTML = history2D.slice(0, 10).map((h, idx) => `
    <div onclick="restore2DHistoryByIndex(${idx})" class="cursor-pointer p-1.5 rounded-lg border ${idx === 0 ? 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300 font-semibold' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70 text-slate-600 dark:text-slate-400'} hover:border-teal-500 flex items-center justify-between transition">
      <span class="truncate"><i class="fa-solid fa-code-commit mr-1.5 text-teal-500"></i>${h.label}</span>
      <span class="font-mono text-[10px] opacity-75 ml-2 shrink-0">${h.time}</span>
    </div>
  `).join('');
}

/*************************************************************************
 * 2D STRUCTURAL PRESET TEMPLATES (INCLUDING EXACT SCREENSHOT 4 MODEL)
 *************************************************************************/
function load2DPreset(presetName) {
  mouse2D.selectedNodeId = null;
  mouse2D.selectedMemberId = null;
  mouse2D.memberStartNodeId = null;

  if (presetName === 'braced_two_storey') {
    // Exact replica of Screenshot 4: "Braced two-storey frame"
    // 7 Nodes: N1(0,0), N2(0,3), N3(0,6), N4(5,0), N5(5,3), N6(5,6), N7(2.5, 4.5)
    // 10 Members: M1..M6 frame + M7..M10 diagonal X-bracing (length = sqrt(2.5^2 + 1.5^2) = 2.915 m!)
    frame2D.title = 'Braced two-storey frame';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 0.0, y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 0.0, y: 6.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 5.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 5.0, y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 5.0, y: 6.0, support: 'none',   fx: 0, fy: -18.0, mz: 0 },
      { id: 7, x: 2.5, y: 4.5, support: 'none',   fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'frame', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'frame', w: 0 },
      { id: 3,  n1: 4, n2: 5, type: 'frame', w: 0 },
      { id: 4,  n1: 5, n2: 6, type: 'frame', w: 0 },
      { id: 5,  n1: 2, n2: 5, type: 'frame', w: 0 },
      { id: 6,  n1: 3, n2: 6, type: 'frame', w: 7.0 }, // 7 kN/m downward UDL on top beam M6
      { id: 7,  n1: 2, n2: 7, type: 'truss', w: 0 },   // 2.915 m pin-ended brace
      { id: 8,  n1: 7, n2: 6, type: 'truss', w: 0 },   // 2.915 m pin-ended brace
      { id: 9,  n1: 3, n2: 7, type: 'truss', w: 0 },   // 2.915 m pin-ended brace
      { id: 10, n1: 7, n2: 5, type: 'truss', w: 0 }    // 2.915 m pin-ended brace
    ];
  } else if (presetName === 'portal_frame') {
    frame2D.title = 'Single-Bay Rigid Portal Frame';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 0.0, y: 4.5, support: 'none',  fx: 15.0, fy: 0, mz: 0 },
      { id: 3, x: 6.0, y: 4.5, support: 'none',  fx: 0, fy: -25.0, mz: 0 },
      { id: 4, x: 6.0, y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1, n1: 1, n2: 2, type: 'frame', w: 0 },
      { id: 2, n1: 2, n2: 3, type: 'frame', w: 12.0 },
      { id: 3, n1: 4, n2: 3, type: 'frame', w: 0 }
    ];
  } else if (presetName === 'pratt_truss') {
    frame2D.title = 'Pratt Roof Truss (8m Span)';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 2.0, y: 0.0, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 3, x: 4.0, y: 0.0, support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 4, x: 6.0, y: 0.0, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 5, x: 8.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 2.0, y: 1.5, support: 'none',   fx: 0, fy: -12.0, mz: 0 },
      { id: 7, x: 4.0, y: 3.0, support: 'none',   fx: 0, fy: -25.0, mz: 0 },
      { id: 8, x: 6.0, y: 1.5, support: 'none',   fx: 0, fy: -12.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 4,  n1: 4, n2: 5, type: 'truss', w: 0 },
      { id: 5,  n1: 1, n2: 6, type: 'truss', w: 0 },
      { id: 6,  n1: 6, n2: 7, type: 'truss', w: 0 },
      { id: 7,  n1: 7, n2: 8, type: 'truss', w: 0 },
      { id: 8,  n1: 8, n2: 5, type: 'truss', w: 0 },
      { id: 9,  n1: 2, n2: 6, type: 'truss', w: 0 },
      { id: 10, n1: 3, n2: 7, type: 'truss', w: 0 },
      { id: 11, n1: 4, n2: 8, type: 'truss', w: 0 },
      { id: 12, n1: 6, n2: 3, type: 'truss', w: 0 },
      { id: 13, n1: 8, n2: 3, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'warren_truss') {
    frame2D.title = 'Warren Bridge Truss (9m Span)';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 3.0, y: 0.0, support: 'none',   fx: 0, fy: -35.0, mz: 0 },
      { id: 3, x: 6.0, y: 0.0, support: 'none',   fx: 0, fy: -35.0, mz: 0 },
      { id: 4, x: 9.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 1.5, y: 2.5, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 4.5, y: 2.5, support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 7, x: 7.5, y: 2.5, support: 'none',   fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 4,  n1: 5, n2: 6, type: 'truss', w: 0 },
      { id: 5,  n1: 6, n2: 7, type: 'truss', w: 0 },
      { id: 6,  n1: 1, n2: 5, type: 'truss', w: 0 },
      { id: 7,  n1: 5, n2: 2, type: 'truss', w: 0 },
      { id: 8,  n1: 2, n2: 6, type: 'truss', w: 0 },
      { id: 9,  n1: 6, n2: 3, type: 'truss', w: 0 },
      { id: 10, n1: 3, n2: 7, type: 'truss', w: 0 },
      { id: 11, n1: 7, n2: 4, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'gable_frame') {
    frame2D.title = 'Industrial Pitched Gable Frame';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 0.0, y: 4.0, support: 'none',   fx: 12.0, fy: 0, mz: 0 },
      { id: 3, x: 4.0, y: 6.0, support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 4, x: 8.0, y: 4.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 8.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1, n1: 1, n2: 2, type: 'frame', w: 0 },
      { id: 2, n1: 2, n2: 3, type: 'frame', w: 8.0 },
      { id: 3, n1: 3, n2: 4, type: 'frame', w: 8.0 },
      { id: 4, n1: 5, n2: 4, type: 'frame', w: 0 }
    ];
  } else if (presetName === 'howe_truss') {
    frame2D.title = 'Howe Roof Truss (8m Span)';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 2.0, y: 0.0, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 3, x: 4.0, y: 0.0, support: 'none',   fx: 0, fy: -25.0, mz: 0 },
      { id: 4, x: 6.0, y: 0.0, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 5, x: 8.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 2.0, y: 1.8, support: 'none',   fx: 0, fy: -10.0, mz: 0 },
      { id: 7, x: 4.0, y: 2.8, support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 8, x: 6.0, y: 1.8, support: 'none',   fx: 0, fy: -10.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 4,  n1: 4, n2: 5, type: 'truss', w: 0 },
      { id: 5,  n1: 1, n2: 6, type: 'truss', w: 0 },
      { id: 6,  n1: 6, n2: 7, type: 'truss', w: 0 },
      { id: 7,  n1: 7, n2: 8, type: 'truss', w: 0 },
      { id: 8,  n1: 8, n2: 5, type: 'truss', w: 0 },
      { id: 9,  n1: 2, n2: 6, type: 'truss', w: 0 },
      { id: 10, n1: 3, n2: 7, type: 'truss', w: 0 },
      { id: 11, n1: 4, n2: 8, type: 'truss', w: 0 },
      { id: 12, n1: 1, n2: 6, type: 'truss', w: 0 },
      { id: 13, n1: 2, n2: 7, type: 'truss', w: 0 },
      { id: 14, n1: 4, n2: 7, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'triangular_roof_truss') {
    frame2D.title = 'Triangular Pitch Roof Truss (10m Span)';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 2.5, y: 0.0, support: 'none',   fx: 0, fy: -10.0, mz: 0 },
      { id: 3, x: 5.0, y: 0.0, support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 4, x: 7.5, y: 0.0, support: 'none',   fx: 0, fy: -10.0, mz: 0 },
      { id: 5, x: 10.0,y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 2.5, y: 1.5, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 7, x: 5.0, y: 3.0, support: 'none',   fx: 0, fy: -30.0, mz: 0 },
      { id: 8, x: 7.5, y: 1.5, support: 'none',   fx: 0, fy: -15.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 4,  n1: 4, n2: 5, type: 'truss', w: 0 },
      { id: 5,  n1: 1, n2: 6, type: 'truss', w: 0 },
      { id: 6,  n1: 6, n2: 7, type: 'truss', w: 0 },
      { id: 7,  n1: 7, n2: 8, type: 'truss', w: 0 },
      { id: 8,  n1: 8, n2: 5, type: 'truss', w: 0 },
      { id: 9,  n1: 2, n2: 6, type: 'truss', w: 0 },
      { id: 10, n1: 3, n2: 7, type: 'truss', w: 0 },
      { id: 11, n1: 4, n2: 8, type: 'truss', w: 0 },
      { id: 12, n1: 2, n2: 7, type: 'truss', w: 0 },
      { id: 13, n1: 4, n2: 7, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'fink_truss') {
    // Reference: McCormac & Csernak - Structural Steel Design / AISC Roof Truss
    frame2D.title = 'Fink Roof Truss (12m Pitch Span) [Ref: McCormac]';
    frame2D.nodes = [
      { id: 1,  x: 0.0,  y: 0.0,   support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2,  x: 3.0,  y: 0.0,   support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3,  x: 6.0,  y: 0.0,   support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4,  x: 9.0,  y: 0.0,   support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 5,  x: 12.0, y: 0.0,   support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6,  x: 1.5,  y: 0.875, support: 'none',   fx: 0, fy: -12.0, mz: 0 },
      { id: 7,  x: 3.0,  y: 1.75,  support: 'none',   fx: 0, fy: -18.0, mz: 0 },
      { id: 8,  x: 4.5,  y: 2.625, support: 'none',   fx: 0, fy: -12.0, mz: 0 },
      { id: 9,  x: 6.0,  y: 3.5,   support: 'none',   fx: 0, fy: -25.0, mz: 0 },
      { id: 10, x: 7.5,  y: 2.625, support: 'none',   fx: 0, fy: -12.0, mz: 0 },
      { id: 11, x: 9.0,  y: 1.75,  support: 'none',   fx: 0, fy: -18.0, mz: 0 },
      { id: 12, x: 10.5, y: 0.875, support: 'none',   fx: 0, fy: -12.0, mz: 0 }
    ];
    frame2D.members = [
      // Bottom Chord
      { id: 1,  n1: 1,  n2: 2,  type: 'truss', w: 0 },
      { id: 2,  n1: 2,  n2: 3,  type: 'truss', w: 0 },
      { id: 3,  n1: 3,  n2: 4,  type: 'truss', w: 0 },
      { id: 4,  n1: 4,  n2: 5,  type: 'truss', w: 0 },
      // Left Rafter
      { id: 5,  n1: 1,  n2: 6,  type: 'truss', w: 0 },
      { id: 6,  n1: 6,  n2: 7,  type: 'truss', w: 0 },
      { id: 7,  n1: 7,  n2: 8,  type: 'truss', w: 0 },
      { id: 8,  n1: 8,  n2: 9,  type: 'truss', w: 0 },
      // Right Rafter
      { id: 9,  n1: 9,  n2: 10, type: 'truss', w: 0 },
      { id: 10, n1: 10, n2: 11, type: 'truss', w: 0 },
      { id: 11, n1: 11, n2: 12, type: 'truss', w: 0 },
      { id: 12, n1: 12, n2: 5,  type: 'truss', w: 0 },
      // Fink Sub-Truss Webs Left
      { id: 13, n1: 6,  n2: 2,  type: 'truss', w: 0 },
      { id: 14, n1: 7,  n2: 2,  type: 'truss', w: 0 },
      { id: 15, n1: 8,  n2: 2,  type: 'truss', w: 0 },
      { id: 16, n1: 7,  n2: 3,  type: 'truss', w: 0 },
      { id: 17, n1: 9,  n2: 3,  type: 'truss', w: 0 },
      // Fink Sub-Truss Webs Right
      { id: 18, n1: 10, n2: 4,  type: 'truss', w: 0 },
      { id: 19, n1: 11, n2: 4,  type: 'truss', w: 0 },
      { id: 20, n1: 12, n2: 4,  type: 'truss', w: 0 },
      { id: 21, n1: 11, n2: 3,  type: 'truss', w: 0 }
    ];
  } else if (presetName === 'king_post_truss') {
    // Reference: Classical Timber & Steel Roof Mechanics - Single vertical tension tie
    frame2D.title = 'King Post Roof Truss (6m Span) [Classical Standard]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0,  support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 3.0, y: 0.0,  support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 6.0, y: 0.0,  support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 1.5, y: 1.25, support: 'none',   fx: 0, fy: -15.0, mz: 0 },
      { id: 5, x: 3.0, y: 2.5,  support: 'none',   fx: 0, fy: -30.0, mz: 0 },
      { id: 6, x: 4.5, y: 1.25, support: 'none',   fx: 0, fy: -15.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1, n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2, n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3, n1: 1, n2: 4, type: 'truss', w: 0 },
      { id: 4, n1: 4, n2: 5, type: 'truss', w: 0 },
      { id: 5, n1: 5, n2: 6, type: 'truss', w: 0 },
      { id: 6, n1: 6, n2: 3, type: 'truss', w: 0 },
      { id: 7, n1: 2, n2: 5, type: 'truss', w: 0 }, // King Post in tension
      { id: 8, n1: 2, n2: 4, type: 'truss', w: 0 }, // Left strut
      { id: 9, n1: 2, n2: 6, type: 'truss', w: 0 }  // Right strut
    ];
  } else if (presetName === 'queen_post_truss') {
    // Reference: Classical Structural Systems - Dual vertical posts
    frame2D.title = 'Queen Post Roof Truss (9m Span) [Classical Standard]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 3.0, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 6.0, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 9.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 3.0, y: 2.2, support: 'none',   fx: 0, fy: -22.0, mz: 0 },
      { id: 6, x: 6.0, y: 2.2, support: 'none',   fx: 0, fy: -22.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3, type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 4,  n1: 1, n2: 5, type: 'truss', w: 0 },
      { id: 5,  n1: 5, n2: 6, type: 'truss', w: 0 }, // Straining beam
      { id: 6,  n1: 6, n2: 4, type: 'truss', w: 0 },
      { id: 7,  n1: 2, n2: 5, type: 'truss', w: 0 }, // Queen post 1
      { id: 8,  n1: 3, n2: 6, type: 'truss', w: 0 }, // Queen post 2
      { id: 9,  n1: 1, n2: 2, type: 'truss', w: 0 },
      { id: 10, n1: 2, n2: 6, type: 'truss', w: 0 }, // Diagonals
      { id: 11, n1: 3, n2: 5, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'bowstring_truss') {
    // Reference: Long-Span Arch-Truss Systems (Hangars & Gymnasiums)
    frame2D.title = 'Bowstring Arch Truss (12m Span) [Ref: Hibbeler]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0,  support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 3.0, y: 0.0,  support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 6.0, y: 0.0,  support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 9.0, y: 0.0,  support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 12.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 1.5, y: 1.5,  support: 'none',   fx: 0, fy: -14.0, mz: 0 },
      { id: 7, x: 4.0, y: 2.6,  support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 8, x: 6.0, y: 3.0,  support: 'none',   fx: 0, fy: -25.0, mz: 0 },
      { id: 9, x: 8.0, y: 2.6,  support: 'none',   fx: 0, fy: -20.0, mz: 0 },
      { id: 10,x: 10.5, y: 1.5, support: 'none',   fx: 0, fy: -14.0, mz: 0 }
    ];
    frame2D.members = [
      // Bottom Tie
      { id: 1,  n1: 1, n2: 2,  type: 'truss', w: 0 },
      { id: 2,  n1: 2, n2: 3,  type: 'truss', w: 0 },
      { id: 3,  n1: 3, n2: 4,  type: 'truss', w: 0 },
      { id: 4,  n1: 4, n2: 5,  type: 'truss', w: 0 },
      // Curved Top Chord
      { id: 5,  n1: 1, n2: 6,  type: 'truss', w: 0 },
      { id: 6,  n1: 6, n2: 7,  type: 'truss', w: 0 },
      { id: 7,  n1: 7, n2: 8,  type: 'truss', w: 0 },
      { id: 8,  n1: 8, n2: 9,  type: 'truss', w: 0 },
      { id: 9,  n1: 9, n2: 10, type: 'truss', w: 0 },
      { id: 10, n1: 10, n2: 5, type: 'truss', w: 0 },
      // Verticals & Webs
      { id: 11, n1: 2, n2: 7,  type: 'truss', w: 0 },
      { id: 12, n1: 3, n2: 8,  type: 'truss', w: 0 },
      { id: 13, n1: 4, n2: 9,  type: 'truss', w: 0 },
      { id: 14, n1: 2, n2: 6,  type: 'truss', w: 0 },
      { id: 15, n1: 2, n2: 8,  type: 'truss', w: 0 },
      { id: 16, n1: 4, n2: 8,  type: 'truss', w: 0 },
      { id: 17, n1: 4, n2: 10, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'cantilever_truss') {
    // Reference: Aslam Kassimali - Structural Analysis / Stadium Canopy
    frame2D.title = 'Cantilever Canopy Truss (5m Overhang) [Ref: Kassimali]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 0.0, y: 2.5, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 2.5, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 2.5, y: 1.8, support: 'none',   fx: 0, fy: -16.0, mz: 0 },
      { id: 5, x: 5.0, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 5.0, y: 1.2, support: 'none',   fx: 0, fy: -24.0, mz: 0 }
    ];
    frame2D.members = [
      { id: 1, n1: 1, n2: 3, type: 'truss', w: 0 },
      { id: 2, n1: 3, n2: 5, type: 'truss', w: 0 },
      { id: 3, n1: 2, n2: 4, type: 'truss', w: 0 },
      { id: 4, n1: 4, n2: 6, type: 'truss', w: 0 },
      { id: 5, n1: 3, n2: 4, type: 'truss', w: 0 },
      { id: 6, n1: 5, n2: 6, type: 'truss', w: 0 },
      { id: 7, n1: 1, n2: 4, type: 'truss', w: 0 },
      { id: 8, n1: 3, n2: 6, type: 'truss', w: 0 },
      { id: 9, n1: 2, n2: 3, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'k_truss') {
    // Reference: Hibbeler - Bridge Engineering & K-Pattern
    frame2D.title = 'K-Truss Bridge (12m Span) [Ref: Hibbeler Bridge]';
    frame2D.nodes = [
      { id: 1,  x: 0.0,  y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2,  x: 3.0,  y: 0.0, support: 'none',   fx: 0, fy: -30.0, mz: 0 },
      { id: 3,  x: 6.0,  y: 0.0, support: 'none',   fx: 0, fy: -45.0, mz: 0 },
      { id: 4,  x: 9.0,  y: 0.0, support: 'none',   fx: 0, fy: -30.0, mz: 0 },
      { id: 5,  x: 12.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 6,  x: 0.0,  y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 7,  x: 3.0,  y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 8,  x: 6.0,  y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 9,  x: 9.0,  y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 10, x: 12.0, y: 3.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 11, x: 3.0,  y: 1.5, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 12, x: 9.0,  y: 1.5, support: 'none',   fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      // Bottom Chord
      { id: 1,  n1: 1,  n2: 2,  type: 'truss', w: 0 },
      { id: 2,  n1: 2,  n2: 3,  type: 'truss', w: 0 },
      { id: 3,  n1: 3,  n2: 4,  type: 'truss', w: 0 },
      { id: 4,  n1: 4,  n2: 5,  type: 'truss', w: 0 },
      // Top Chord
      { id: 5,  n1: 6,  n2: 7,  type: 'truss', w: 0 },
      { id: 6,  n1: 7,  n2: 8,  type: 'truss', w: 0 },
      { id: 7,  n1: 8,  n2: 9,  type: 'truss', w: 0 },
      { id: 8,  n1: 9,  n2: 10, type: 'truss', w: 0 },
      // End posts & Center vertical
      { id: 9,  n1: 1,  n2: 6,  type: 'truss', w: 0 },
      { id: 10, n1: 5,  n2: 10, type: 'truss', w: 0 },
      { id: 11, n1: 3,  n2: 8,  type: 'truss', w: 0 },
      // K-Pattern Left
      { id: 12, n1: 2,  n2: 11, type: 'truss', w: 0 },
      { id: 13, n1: 11, n2: 7,  type: 'truss', w: 0 },
      { id: 14, n1: 1,  n2: 11, type: 'truss', w: 0 },
      { id: 15, n1: 6,  n2: 11, type: 'truss', w: 0 },
      { id: 16, n1: 11, n2: 3,  type: 'truss', w: 0 },
      { id: 17, n1: 11, n2: 8,  type: 'truss', w: 0 },
      // K-Pattern Right
      { id: 18, n1: 4,  n2: 12, type: 'truss', w: 0 },
      { id: 19, n1: 12, n2: 9,  type: 'truss', w: 0 },
      { id: 20, n1: 3,  n2: 12, type: 'truss', w: 0 },
      { id: 21, n1: 8,  n2: 12, type: 'truss', w: 0 },
      { id: 22, n1: 5,  n2: 12, type: 'truss', w: 0 },
      { id: 23, n1: 10, n2: 12, type: 'truss', w: 0 }
    ];
  } else if (presetName === 'two_bay_two_storey') {
    // Reference: Hibbeler Ch. 12 (Slope-Deflection / Moment Distribution in Multi-Bay Frames)
    frame2D.title = 'Two-Bay Two-Storey Moment Frame (10x7m) [Ref: Hibbeler]';
    frame2D.nodes = [
      { id: 1, x: 0.0,  y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 5.0,  y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 10.0, y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 0.0,  y: 3.5, support: 'none',  fx: 16.0, fy: 0, mz: 0 },
      { id: 5, x: 5.0,  y: 3.5, support: 'none',  fx: 0,    fy: 0, mz: 0 },
      { id: 6, x: 10.0, y: 3.5, support: 'none',  fx: 0,    fy: 0, mz: 0 },
      { id: 7, x: 0.0,  y: 7.0, support: 'none',  fx: 24.0, fy: 0, mz: 0 },
      { id: 8, x: 5.0,  y: 7.0, support: 'none',  fx: 0,    fy: 0, mz: 0 },
      { id: 9, x: 10.0, y: 7.0, support: 'none',  fx: 0,    fy: 0, mz: 0 }
    ];
    frame2D.members = [
      // Columns Floor 1
      { id: 1,  n1: 1, n2: 4, type: 'frame', w: 0 },
      { id: 2,  n1: 2, n2: 5, type: 'frame', w: 0 },
      { id: 3,  n1: 3, n2: 6, type: 'frame', w: 0 },
      // Beams Floor 1
      { id: 4,  n1: 4, n2: 5, type: 'frame', w: 18.0 },
      { id: 5,  n1: 5, n2: 6, type: 'frame', w: 18.0 },
      // Columns Floor 2
      { id: 6,  n1: 4, n2: 7, type: 'frame', w: 0 },
      { id: 7,  n1: 5, n2: 8, type: 'frame', w: 0 },
      { id: 8,  n1: 6, n2: 9, type: 'frame', w: 0 },
      // Beams Floor 2 (Roof)
      { id: 9,  n1: 7, n2: 8, type: 'frame', w: 12.0 },
      { id: 10, n1: 8, n2: 9, type: 'frame', w: 12.0 }
    ];
  } else if (presetName === 'vierendeel_girder') {
    // Reference: Ghali & Neville / Kassimali - Vierendeel Rigid Girder (No diagonals)
    frame2D.title = 'Vierendeel Rigid Girder (9m Span) [Ref: Ghali & Neville]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 3.0, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 6.0, y: 0.0, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 9.0, y: 0.0, support: 'roller', fx: 0, fy: 0, mz: 0 },
      { id: 5, x: 0.0, y: 2.5, support: 'none',   fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 3.0, y: 2.5, support: 'none',   fx: 0, fy: -28.0, mz: 0 },
      { id: 7, x: 6.0, y: 2.5, support: 'none',   fx: 0, fy: -28.0, mz: 0 },
      { id: 8, x: 9.0, y: 2.5, support: 'none',   fx: 0, fy: 0, mz: 0 }
    ];
    frame2D.members = [
      // Bottom chord
      { id: 1, n1: 1, n2: 2, type: 'frame', w: 0 },
      { id: 2, n1: 2, n2: 3, type: 'frame', w: 0 },
      { id: 3, n1: 3, n2: 4, type: 'frame', w: 0 },
      // Top chord
      { id: 4, n1: 5, n2: 6, type: 'frame', w: 8.0 },
      { id: 5, n1: 6, n2: 7, type: 'frame', w: 8.0 },
      { id: 6, n1: 7, n2: 8, type: 'frame', w: 8.0 },
      // Rigid verticals (shear transferred by joint bending moments)
      { id: 7, n1: 1, n2: 5, type: 'frame', w: 0 },
      { id: 8, n1: 2, n2: 6, type: 'frame', w: 0 },
      { id: 9, n1: 3, n2: 7, type: 'frame', w: 0 },
      { id: 10,n1: 4, n2: 8, type: 'frame', w: 0 }
    ];
  } else if (presetName === 'mill_bent_crane') {
    // Reference: AISC Design Guide 7 (Industrial Buildings with Cranes)
    frame2D.title = 'Industrial Mill Bent with Crane Bracket [Ref: AISC DG7]';
    frame2D.nodes = [
      { id: 1, x: 0.0, y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 2, x: 8.0, y: 0.0, support: 'fixed', fx: 0, fy: 0, mz: 0 },
      { id: 3, x: 0.0, y: 4.5, support: 'none',  fx: 0, fy: 0, mz: 0 },
      { id: 4, x: 0.8, y: 4.5, support: 'none',  fx: 0, fy: -45.0, mz: 0 }, // Crane Wheel Load
      { id: 5, x: 8.0, y: 4.5, support: 'none',  fx: 0, fy: 0, mz: 0 },
      { id: 6, x: 0.0, y: 7.0, support: 'none',  fx: 10.0, fy: 0, mz: 0 }, // Wind suction
      { id: 7, x: 8.0, y: 7.0, support: 'none',  fx: 0, fy: 0, mz: 0 },
      { id: 8, x: 4.0, y: 8.5, support: 'none',  fx: 0, fy: -15.0, mz: 0 } // Roof apex
    ];
    frame2D.members = [
      // Left Column
      { id: 1, n1: 1, n2: 3, type: 'frame', w: 0 },
      { id: 2, n1: 3, n2: 6, type: 'frame', w: 0 },
      // Crane Bracket
      { id: 3, n1: 3, n2: 4, type: 'frame', w: 0 },
      // Right Column
      { id: 4, n1: 2, n2: 5, type: 'frame', w: 0 },
      { id: 5, n1: 5, n2: 7, type: 'frame', w: 0 },
      // Gable Rafters
      { id: 6, n1: 6, n2: 8, type: 'frame', w: 6.0 },
      { id: 7, n1: 8, n2: 7, type: 'frame', w: 6.0 }
    ];
  }

  // Pre-calculate member length so it is immediately defined even before solving
  const nMap = {};
  frame2D.nodes.forEach(n => { nMap[n.id] = n; });
  frame2D.members.forEach(m => {
    const n1 = nMap[m.n1], n2 = nMap[m.n2];
    if (n1 && n2) {
      m.length = Math.hypot(n2.x - n1.x, n2.y - n1.y);
    }
  });

  const titleEl = document.getElementById('frame2DTitleInput');
  if (titleEl) titleEl.value = frame2D.title;
  record2DHistory(`Loaded ${frame2D.title}`);
  solve2DFrame();
  focus2DCamera();
}

/*************************************************************************
 * 2D DIRECT STIFFNESS METHOD (DSM) FEA SOLVER (3 DOF/NODE: ux, uy, rz)
 *************************************************************************/
function solve2DFrame(showToast = false) {
  const nodes = frame2D.nodes;
  const members = frame2D.members;
  const nNodes = nodes.length;
  if (nNodes < 2 || members.length < 1) {
    frame2D.solved = false;
    render2DWorkspace();
    return;
  }

  // Load combination factor
  const caseSel = document.getElementById('loadCaseSelect2D')?.value || 'all';
  const loadMult = caseSel === 'uls' ? 1.5 : 1.0;
  const windAddFx = caseSel === 'wind' ? 12.0 : 0.0;

  const ndof = 3 * nNodes;
  const K = Array.from({ length: ndof }, () => new Array(ndof).fill(0));
  const F = new Array(ndof).fill(0);

  // Map node ID to index 0..nNodes-1
  const nodeIdxMap = {};
  nodes.forEach((n, idx) => {
    nodeIdxMap[n.id] = idx;
    n.ux = 0; n.uy = 0; n.rz = 0;
    n.rx = 0; n.ry = 0; n.rmz = 0;
    // Apply nodal forces
    F[3 * idx] += (n.fx || 0) * loadMult + (n.y > 0 ? windAddFx : 0);
    F[3 * idx + 1] += (n.fy || 0) * loadMult;
    F[3 * idx + 2] += (n.mz || 0) * loadMult;
  });

  // Add tiny rotational stability stiffness at every node so nodes connected ONLY to pin-ended truss members don't have singular rotational DOF
  for (let i = 0; i < nNodes; i++) {
    K[3 * i + 2][3 * i + 2] += 1e-3;
  }

  // Assemble each member
  members.forEach(m => {
    const idx1 = nodeIdxMap[m.n1];
    const idx2 = nodeIdxMap[m.n2];
    if (idx1 === undefined || idx2 === undefined) return;
    const node1 = nodes[idx1];
    const node2 = nodes[idx2];

    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const L = Math.hypot(dx, dy);
    if (L < 1e-5) return;
    m.length = L;

    const c = dx / L;
    const s = dy / L;

    const E = frame2D.E;
    const A = m.type === 'truss' ? frame2D.A_truss : frame2D.A_frame;
    // For pin-ended truss members, flexural bending stiffness is released (near-zero I)
    const I = m.type === 'truss' ? 1e-9 : frame2D.I_frame;

    const EA_L = (E * A) / L;
    const EI_L3 = (E * I) / (L * L * L);

    // Local 6x6 stiffness matrix k_local
    const kLoc = [
      [ EA_L,  0,             0,            -EA_L,  0,             0            ],
      [ 0,     12 * EI_L3,    6 * L * EI_L3, 0,    -12 * EI_L3,    6 * L * EI_L3],
      [ 0,     6 * L * EI_L3, 4*L*L * EI_L3, 0,    -6 * L * EI_L3, 2*L*L * EI_L3],
      [-EA_L,  0,             0,             EA_L,  0,             0            ],
      [ 0,    -12 * EI_L3,   -6 * L * EI_L3, 0,     12 * EI_L3,   -6 * L * EI_L3],
      [ 0,     6 * L * EI_L3, 2*L*L * EI_L3, 0,    -6 * L * EI_L3, 4*L*L * EI_L3]
    ];

    // Transformation matrix T (local = T * global)
    const T = [
      [ c,  s, 0,  0,  0, 0],
      [-s,  c, 0,  0,  0, 0],
      [ 0,  0, 1,  0,  0, 0],
      [ 0,  0, 0,  c,  s, 0],
      [ 0,  0, 0, -s,  c, 0],
      [ 0,  0, 0,  0,  0, 1]
    ];

    // k_global = T^T * kLoc * T
    const kTemp = Array.from({ length: 6 }, () => new Array(6).fill(0));
    const kGlob = Array.from({ length: 6 }, () => new Array(6).fill(0));
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < 6; k++) kTemp[i][j] += kLoc[i][k] * T[k][j];
      }
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < 6; k++) kGlob[i][j] += T[k][i] * kTemp[k][j];
      }
    }

    const dofs = [3 * idx1, 3 * idx1 + 1, 3 * idx1 + 2, 3 * idx2, 3 * idx2 + 1, 3 * idx2 + 2];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        K[dofs[i]][dofs[j]] += kGlob[i][j];
      }
    }

    // Equivalent nodal loads from member downward UDL (w in kN/m)
    const w = (m.w || 0) * loadMult;
    // Project global downward load (0, -w) onto member local transverse axis:
    // Local transverse y' has unit vector (-s, c). Dot((0, -w), (-s, c)) = -w * c
    // Local axial x' has unit vector (c, s). Dot((0, -w), (c, s)) = -w * s
    const qy = -w * c; // local transverse load
    const qx = -w * s; // local axial load

    // Fixed-end force vector in local coordinates (actions of member on nodes)
    const f_eq_loc = [
      (qx * L) / 2,
      (qy * L) / 2,
      m.type === 'truss' ? 0 : (qy * L * L) / 12,
      (qx * L) / 2,
      (qy * L) / 2,
      m.type === 'truss' ? 0 : -(qy * L * L) / 12
    ];

    // Transform equivalent nodal loads to global F += T^T * f_eq_loc
    for (let i = 0; i < 6; i++) {
      let fg = 0;
      for (let k = 0; k < 6; k++) fg += T[k][i] * f_eq_loc[k];
      F[dofs[i]] += fg;
    }

    // Save matrices on member for post-processing internal forces
    m._kLoc = kLoc;
    m._T = T;
    m._dofs = dofs;
    m._f_eq_loc = f_eq_loc;
    m._qy = qy;
  });

  // Apply support boundary conditions
  const constrained = new Set();
  nodes.forEach((n, idx) => {
    if (n.support === 'fixed') {
      constrained.add(3 * idx);
      constrained.add(3 * idx + 1);
      constrained.add(3 * idx + 2);
    } else if (n.support === 'pinned') {
      constrained.add(3 * idx);
      constrained.add(3 * idx + 1);
    } else if (n.support === 'roller') {
      constrained.add(3 * idx + 1);
    }
  });

  const freeDofs = [];
  for (let i = 0; i < ndof; i++) {
    if (!constrained.has(i)) freeDofs.push(i);
  }

  const nf = freeDofs.length;
  const Kff = Array.from({ length: nf }, () => new Array(nf).fill(0));
  const Ff = new Array(nf).fill(0);
  for (let i = 0; i < nf; i++) {
    Ff[i] = F[freeDofs[i]];
    for (let j = 0; j < nf; j++) {
      Kff[i][j] = K[freeDofs[i]][freeDofs[j]];
    }
  }

  const solveSystem = (typeof solveGaussian === 'function') ? solveGaussian : function(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      if (Math.abs(M[i][i]) < 1e-12) continue;
      for (let k = i + 1; k < n; k++) {
        const c = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) M[k][j] -= c * M[i][j];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      if (Math.abs(M[i][i]) < 1e-12) continue;
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
      x[i] = sum / M[i][i];
    }
    return x;
  };

  const uf = solveSystem(Kff, Ff);
  const U = new Array(ndof).fill(0);
  for (let i = 0; i < nf; i++) U[freeDofs[i]] = uf[i];

  // Recover nodal displacements & support reactions R = K * U - F
  let maxDelta = 0;
  nodes.forEach((n, idx) => {
    n.ux = U[3 * idx];
    n.uy = U[3 * idx + 1];
    n.rz = U[3 * idx + 2];
    const disp_mm = Math.hypot(n.ux, n.uy) * 1000;
    if (disp_mm > maxDelta) maxDelta = disp_mm;

    if (n.support && n.support !== 'none') {
      let rx = -F[3 * idx];
      let ry = -F[3 * idx + 1];
      let rmz = -F[3 * idx + 2];
      for (let j = 0; j < ndof; j++) {
        rx += K[3 * idx][j] * U[j];
        ry += K[3 * idx + 1][j] * U[j];
        rmz += K[3 * idx + 2][j] * U[j];
      }
      n.rx = n.support === 'roller' ? 0 : rx;
      n.ry = ry;
      n.rmz = n.support === 'fixed' ? rmz : 0;
    }
  });

  // Recover member internal forces (Axial N, Shear V, Bending Moment M)
  let maxN = 0, maxV = 0, maxM = 0;
  members.forEach(m => {
    if (!m._dofs) return;
    const uGlob = m._dofs.map(d => U[d]);
    const uLoc = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
      for (let k = 0; k < 6; k++) uLoc[i] += m._T[i][k] * uGlob[k];
    }
    const fEnd = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
      let sum = -m._f_eq_loc[i];
      for (let k = 0; k < 6; k++) sum += m._kLoc[i][k] * uLoc[k];
      fEnd[i] = sum;
    }

    // Internal convention:
    // Axial N: Tension (+), Compression (-): N = fEnd[3] = -fEnd[0]
    m.N = fEnd[3];
    // Shear V1, V2
    m.V1 = fEnd[1];
    m.V2 = -fEnd[4];
    // Bending Moment M1, M2, and mid-span M_mid
    m.M1 = m.type === 'truss' ? 0 : -fEnd[2];
    m.M2 = m.type === 'truss' ? 0 : fEnd[5];
    const qy = m._qy || 0;
    m.M_mid = m.type === 'truss' ? 0 : 0.5 * (m.M1 + m.M2) - (qy * m.length * m.length) / 8;

    m.maxAbsV = Math.max(Math.abs(m.V1), Math.abs(m.V2));
    m.maxAbsM = Math.max(Math.abs(m.M1), Math.abs(m.M2), Math.abs(m.M_mid));
    m._uLoc = uLoc;

    if (Math.abs(m.N) > maxN) maxN = Math.abs(m.N);
    if (m.maxAbsV > maxV) maxV = m.maxAbsV;
    if (m.maxAbsM > maxM) maxM = m.maxAbsM;
  });

  frame2D.solved = true;
  frame2D.maxN = maxN;
  frame2D.maxV = maxV;
  frame2D.maxM = maxM;
  frame2D.maxDelta = maxDelta;

  update2DBadgesAndTables();
  render2DWorkspace();
  if (currentWorkspace === '3d' && typeof render3DScene === 'function') render3DScene();
  if (showToast) {
    showNotification('2D FEA Analysis Complete', `คำนวณ ${nodes.length} จุดต่อ, ${members.length} ชิ้นส่วนเสร็จสมบูรณ์`);
  }
}

/*************************************************************************
 * 2D INSPECTOR TABLES, BADGES & SELECTED ELEMENT EDITOR
 *************************************************************************/
function update2DBadgesAndTables() {
  const numSup = frame2D.nodes.filter(n => n.support && n.support !== 'none').length;
  const numLoads = frame2D.nodes.filter(n => Math.abs(n.fx) > 0 || Math.abs(n.fy) > 0 || Math.abs(n.mz) > 0).length +
                   frame2D.members.filter(m => Math.abs(m.w) > 0).length;

  document.getElementById('badge2DNodes').innerText = frame2D.nodes.length;
  document.getElementById('badge2DMembers').innerText = frame2D.members.length;
  document.getElementById('badge2DSupports').innerText = numSup;
  document.getElementById('badge2DLoads').innerText = numLoads;

  document.getElementById('kpi2DMaxN').innerText = `${Units.force(frame2D.maxN).toFixed(2)} ${Units.uForce()}`;
  document.getElementById('kpi2DMaxV').innerText = `${Units.force(frame2D.maxV).toFixed(2)} ${Units.uForce()}`;
  document.getElementById('kpi2DMaxM').innerText = `${Units.mom(frame2D.maxM).toFixed(2)} ${Units.uMom()}`;
  document.getElementById('kpi2DMaxD').innerText = `${Units.defl(frame2D.maxDelta).toFixed(3)} ${Units.uDefl()}`;

  // Reactions Table
  const tbReac = document.getElementById('table2DReactions');
  if (tbReac) {
    tbReac.innerHTML = frame2D.nodes.filter(n => n.support && n.support !== 'none').map(n => `
      <tr onclick="select2DNode(${n.id})" class="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <td class="py-1.5 px-2 font-bold text-indigo-500">N${n.id} (${n.support[0].toUpperCase()})</td>
        <td class="py-1.5 px-2">${Units.force(n.rx || 0).toFixed(2)}</td>
        <td class="py-1.5 px-2 font-bold text-emerald-500">${Units.force(n.ry || 0).toFixed(2)}</td>
        <td class="py-1.5 px-2">${Units.mom(n.rmz || 0).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // Members Table
  const tbMem = document.getElementById('table2DMembers');
  if (tbMem) {
    tbMem.innerHTML = frame2D.members.map(m => {
      const nCol = (m.N || 0) >= 0 ? 'text-sky-500' : 'text-amber-500';
      return `
        <tr onclick="select2DMember(${m.id})" class="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${mouse2D.selectedMemberId === m.id ? 'bg-teal-500/10' : ''}">
          <td class="py-1.5 px-2 font-bold">M${m.id} <span class="text-[9px] text-slate-400">(N${m.n1}-N${m.n2})</span></td>
          <td class="py-1.5 px-2 uppercase text-[10px]">${m.type}</td>
          <td class="py-1.5 px-2 font-bold ${nCol}">${Units.force(m.N || 0).toFixed(2)}</td>
          <td class="py-1.5 px-2">${Units.force(m.maxAbsV || 0).toFixed(2)}</td>
          <td class="py-1.5 px-2 text-purple-500">${Units.mom(m.maxAbsM || 0).toFixed(2)}</td>
        </tr>
      `;
    }).join('');
  }

  // Nodes Table
  const tbNodes = document.getElementById('table2DNodes');
  if (tbNodes) {
    tbNodes.innerHTML = frame2D.nodes.map(n => `
      <tr onclick="select2DNode(${n.id})" class="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${mouse2D.selectedNodeId === n.id ? 'bg-teal-500/10' : ''}">
        <td class="py-1.5 px-2 font-bold text-teal-600 dark:text-teal-400">N${n.id}</td>
        <td class="py-1.5 px-2">(${Units.len(n.x).toFixed(2)}, ${Units.len(n.y).toFixed(2)})</td>
        <td class="py-1.5 px-2">${Units.defl((n.ux || 0) * 1000).toFixed(3)}</td>
        <td class="py-1.5 px-2">${Units.defl((n.uy || 0) * 1000).toFixed(3)}</td>
      </tr>
    `).join('');
  }

  renderSelected2DElementCard();
}

function select2DNode(nodeId) {
  mouse2D.selectedNodeId = nodeId;
  mouse2D.selectedMemberId = null;
  update2DBadgesAndTables();
  render2DWorkspace();
}

function select2DMember(memId) {
  mouse2D.selectedMemberId = memId;
  mouse2D.selectedNodeId = null;
  update2DBadgesAndTables();
  render2DWorkspace();
}

function renderSelected2DElementCard() {
  const card = document.getElementById('selected2DElementCard');
  if (!card) return;

  if (mouse2D.selectedNodeId) {
    const n = frame2D.nodes.find(x => x.id === mouse2D.selectedNodeId);
    if (!n) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    card.innerHTML = `
      <div class="flex items-center justify-between font-bold text-teal-700 dark:text-teal-300">
        <span><i class="fa-solid fa-bullseye mr-1"></i> แก้ไขจุดต่อ Node N${n.id}</span>
        <button onclick="deleteSelected2DElement()" class="text-rose-500 hover:underline text-[11px]"><i class="fa-solid fa-trash"></i> ลบจุด</button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] text-slate-500">X (${Units.uLen()})</label>
          <input type="number" step="0.25" value="${+Units.len(n.x).toFixed(3)}" onchange="update2DNodeProp(${n.id}, 'x', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">Y (${Units.uLen()})</label>
          <input type="number" step="0.25" value="${+Units.len(n.y).toFixed(3)}" onchange="update2DNodeProp(${n.id}, 'y', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">Support</label>
          <select onchange="update2DNodeProp(${n.id}, 'support', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1">
            <option value="none" ${n.support === 'none' ? 'selected' : ''}>None</option>
            <option value="pinned" ${n.support === 'pinned' ? 'selected' : ''}>Pinned</option>
            <option value="fixed" ${n.support === 'fixed' ? 'selected' : ''}>Fixed</option>
            <option value="roller" ${n.support === 'roller' ? 'selected' : ''}>Roller</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">Fx (${Units.uForce()})</label>
          <input type="number" step="1" value="${+Units.force(n.fx || 0).toFixed(2)}" onchange="update2DNodeProp(${n.id}, 'fx', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">Fy (${Units.uForce()})</label>
          <input type="number" step="1" value="${+Units.force(n.fy || 0).toFixed(2)}" onchange="update2DNodeProp(${n.id}, 'fy', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">Mz (${Units.uMom()})</label>
          <input type="number" step="1" value="${+Units.mom(n.mz || 0).toFixed(2)}" onchange="update2DNodeProp(${n.id}, 'mz', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
      </div>
    `;
  } else if (mouse2D.selectedMemberId) {
    const m = frame2D.members.find(x => x.id === mouse2D.selectedMemberId);
    if (!m) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    card.innerHTML = `
      <div class="flex items-center justify-between font-bold text-teal-700 dark:text-teal-300">
        <span><i class="fa-solid fa-grip-lines mr-1"></i> แก้ไขชิ้นส่วน Member M${m.id} (N${m.n1}→N${m.n2})</span>
        <button onclick="deleteSelected2DElement()" class="text-rose-500 hover:underline text-[11px]"><i class="fa-solid fa-trash"></i> ลบชิ้นส่วน</button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] text-slate-500">Member Connection</label>
          <select onchange="update2DMemberProp(${m.id}, 'type', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1">
            <option value="frame" ${m.type === 'frame' ? 'selected' : ''}>Rigid Frame (รับดัด+เฉือน+แกน)</option>
            <option value="truss" ${m.type === 'truss' ? 'selected' : ''}>Pin-Ended Truss (รับแรงตามแนวแกน)</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] text-slate-500">UDL Load w (${Units.uDist()} ↓)</label>
          <input type="number" step="1" value="${+Units.dist(m.w || 0).toFixed(2)}" onchange="update2DMemberProp(${m.id}, 'w', this.value)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1 font-mono">
        </div>
      </div>
    `;
  } else {
    card.classList.add('hidden');
  }
}

function update2DNodeProp(nodeId, prop, val) {
  const n = frame2D.nodes.find(x => x.id === nodeId);
  if (!n) return;
  if (prop === 'support') {
    n.support = val;
  } else if (prop === 'x' || prop === 'y') {
    n[prop] = +Units.toSILen(parseFloat(val) || 0).toFixed(4);
  } else if (prop === 'fx' || prop === 'fy') {
    n[prop] = +Units.toSIForce(parseFloat(val) || 0).toFixed(4);
  } else if (prop === 'mz') {
    n[prop] = +Units.toSIMom(parseFloat(val) || 0).toFixed(4);
  }
  record2DHistory(`Edited Node N${nodeId}`);
  solve2DFrame();
}

function update2DMemberProp(memId, prop, val) {
  const m = frame2D.members.find(x => x.id === memId);
  if (!m) return;
  if (prop === 'type') m.type = val;
  else if (prop === 'w') m.w = +Units.toSIDist(parseFloat(val) || 0).toFixed(4);
  record2DHistory(`Edited Member M${memId}`);
  solve2DFrame();
}

function deleteSelected2DElement() {
  if (mouse2D.selectedNodeId) {
    const nid = mouse2D.selectedNodeId;
    frame2D.nodes = frame2D.nodes.filter(n => n.id !== nid);
    frame2D.members = frame2D.members.filter(m => m.n1 !== nid && m.n2 !== nid);
    mouse2D.selectedNodeId = null;
    record2DHistory(`Deleted Node N${nid}`);
    solve2DFrame();
  } else if (mouse2D.selectedMemberId) {
    const mid = mouse2D.selectedMemberId;
    frame2D.members = frame2D.members.filter(m => m.id !== mid);
    mouse2D.selectedMemberId = null;
    record2DHistory(`Deleted Member M${mid}`);
    solve2DFrame();
  }
}

function add2DNodeManualPrompt() {
  const nextId = frame2D.nodes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
  frame2D.nodes.push({ id: nextId, x: 2.5, y: 3.0, support: 'none', fx: 0, fy: 0, mz: 0 });
  mouse2D.selectedNodeId = nextId;
  record2DHistory(`Added Node N${nextId}`);
  solve2DFrame();
}

function clear2DModel() {
  frame2D.nodes = [
    { id: 1, x: 0, y: 0, support: 'pinned', fx: 0, fy: 0, mz: 0 },
    { id: 2, x: 5, y: 0, support: 'roller', fx: 0, fy: 0, mz: 0 }
  ];
  frame2D.members = [
    { id: 1, n1: 1, n2: 2, type: 'frame', w: 10 }
  ];
  record2DHistory('Cleared 2D Workspace');
  focus2DCamera();
  solve2DFrame();
}

/*************************************************************************
 * 2D TOOLBAR & OVERLAY SWITCHERS
 *************************************************************************/
function set2DTool(tool) {
  tool2D = tool;
  mouse2D.memberStartNodeId = null;
  const tools = ['select', 'node', 'member_frame', 'member_truss', 'support', 'load', 'erase'];
  tools.forEach(t => {
    const btn = document.getElementById(`tool2D_${t}`);
    if (!btn) return;
    if (t === tool) {
      btn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/40 transition';
    } else {
      btn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition';
    }
  });

  const hints = {
    select: 'โหมด Select: คลิกเลือกชิ้นส่วน หรือ คลิกค้างแล้วลากจุดต่อ (Node) เพื่อปรับเปลี่ยนโครงสร้างและคำนวณอัตโนมัติแบบเรียลไทม์!',
    node: 'โหมด Node: คลิกที่พิกัดใดก็ได้บนตาราง Grid เพื่อวางจุดต่อ (Node) ใหม่',
    member_frame: 'โหมด Frame Member: คลิกที่จุดต่อเริ่มต้น แล้วลากไปคลิกจุดต่อปลายทางเพื่อเชื่อมชิ้นส่วนรับดัด (Rigid Frame)',
    member_truss: 'โหมด Truss (Pin): คลิกที่จุดต่อเริ่มต้น แล้วลากไปคลิกจุดต่อปลายทางเพื่อเชื่อมชิ้นส่วนโครงถักปลายหมุน (Pin-Ended)',
    support: 'โหมด Support: คลิกที่จุดต่อ (Node) เพื่อสลับชนิดฐานราก (Pinned ▲ → Fixed █ → Roller ● → None)',
    load: 'โหมด Load: คลิกที่จุดต่อ (Node) เพื่อใส่แรงจุด Fx, Fy หรือคลิกที่ชิ้นส่วน (Member) เพื่อใส่แรงกระจาย UDL',
    erase: 'โหมด Erase: คลิกที่จุดต่อหรือชิ้นส่วนที่ต้องการลบออกจากโครงสร้าง'
  };
  document.getElementById('hint2DMode').innerHTML = hints[tool] || '';
  render2DWorkspace();
}

function set2DOverlay(ov) {
  overlay2D = ov;
  ['none', 'axial', 'shear', 'moment', 'deflection'].forEach(k => {
    const btn = document.getElementById(`ov2D_${k}`);
    if (!btn) return;
    if (k === ov) {
      btn.className = 'px-2 py-1 rounded text-xs font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30';
    } else {
      btn.className = 'px-2 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  });
  render2DWorkspace();
}

function toggle2DReactionsOverlay() {
  show2DReactions = !show2DReactions;
  const btn = document.getElementById('btn2DShowReactions');
  if (btn) {
    btn.className = show2DReactions
      ? 'px-2 py-1 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : 'px-2 py-1 rounded text-xs font-medium text-slate-400';
  }
  render2DWorkspace();
}

function set2DInspectorTab(tab) {
  // Toggle category focus on/off
  active2DFocusTab = (active2DFocusTab === tab) ? null : tab;

  const names = ['Nodes', 'Members', 'Supports', 'Loads', 'Cases', 'Materials', 'Sections', 'History'];
  names.forEach(name => {
    const btn = document.getElementById(`railBtn${name}`);
    if (btn) {
      const isCurrentActive = active2DFocusTab && (name.toLowerCase() === active2DFocusTab);
      btn.classList.toggle('bg-teal-500/25', isCurrentActive);
      btn.classList.toggle('text-teal-400', isCurrentActive);
      btn.classList.toggle('ring-2', isCurrentActive);
      btn.classList.toggle('ring-teal-400/60', isCurrentActive);
      btn.classList.toggle('shadow-lg', isCurrentActive);
    }
  });

  // Smooth scroll inspector to relevant section
  if (active2DFocusTab === 'nodes') {
    const el = document.getElementById('table2DNodes');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else if (active2DFocusTab === 'members') {
    const el = document.getElementById('table2DMembers');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else if (active2DFocusTab === 'supports') {
    const el = document.getElementById('table2DReactions');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else if (active2DFocusTab === 'loads') {
    const el = document.getElementById('tool2DLoadFx');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else if (active2DFocusTab === 'history') {
    const el = document.getElementById('list2DActivityHistory');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Floating notification toast
  if (active2DFocusTab && typeof showNotification === 'function') {
    const labelMap = {
      nodes: 'เรืองแสงโฟกัสจุดต่อทั้งหมด (Nodes Glowing)',
      members: 'เรืองแสงโฟกัสชิ้นส่วนทั้งหมด (Members Glowing)',
      supports: 'เรืองแสงโฟกัสจุดรองรับทั้งหมด (Supports Glowing)',
      loads: 'เรืองแสงโฟกัสแรงกระทำทั้งหมด (Loads Glowing)',
      cases: 'กรณีแรงกระทำ (Load Cases)',
      materials: 'คุณสมบัติวัสดุ (Materials)',
      sections: 'หน้าตัดชิ้นส่วน (Sections)',
      history: 'ประวัติโมเดล (History)'
    };
    showNotification('โฟกัสโครงสร้าง 2D', labelMap[active2DFocusTab] || active2DFocusTab);
  }

  render2DWorkspace();
}

/*************************************************************************
 * 2D CAMERA & CANVAS COORDINATE TRANSFORMS
 *************************************************************************/
function resize2DCanvas() {
  const c = document.getElementById('canvas2DWorkspace');
  if (!c) return;
  const rect = c.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = window.devicePixelRatio || 1;
  c.width = rect.width * dpr;
  c.height = rect.height * dpr;
  if (cam2D.offsetX === 0 && cam2D.offsetY === 0) {
    focus2DCamera();
  }
}

function focus2DCamera() {
  const c = document.getElementById('canvas2DWorkspace');
  if (!c || frame2D.nodes.length === 0) return;
  const rect = c.getBoundingClientRect();
  const W = rect.width || 900;
  const H = rect.height || 680;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  frame2D.nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const spanX = Math.max(4, maxX - minX);
  const spanY = Math.max(4, maxY - minY);
  cam2D.scale = Math.min((W * 0.56) / spanX, (H * 0.56) / spanY);
  cam2D.zoomPct = Math.round((cam2D.scale / 68) * 100);
  const zoomLbl = document.getElementById('zoom2DLabel');
  if (zoomLbl) zoomLbl.innerText = `${cam2D.zoomPct}%`;

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  cam2D.offsetX = W / 2 - midX * cam2D.scale;
  cam2D.offsetY = H / 2 + midY * cam2D.scale + 30;
  render2DWorkspace();
}

function zoom2D(factor) {
  const c = document.getElementById('canvas2DWorkspace');
  if (!c) return;
  const rect = c.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const wx = (cx - cam2D.offsetX) / cam2D.scale;
  const wy = (cam2D.offsetY - cy) / cam2D.scale;

  cam2D.scale = Math.max(20, Math.min(220, cam2D.scale * factor));
  cam2D.offsetX = cx - wx * cam2D.scale;
  cam2D.offsetY = cy + wy * cam2D.scale;
  cam2D.zoomPct = Math.round((cam2D.scale / 68) * 100);
  const zoomLbl = document.getElementById('zoom2DLabel');
  if (zoomLbl) zoomLbl.innerText = `${cam2D.zoomPct}%`;
  render2DWorkspace();
}

function worldToScreen2D(wx, wy) {
  return {
    x: cam2D.offsetX + wx * cam2D.scale,
    y: cam2D.offsetY - wy * cam2D.scale
  };
}

function screenToWorld2D(sx, sy) {
  return {
    x: (sx - cam2D.offsetX) / cam2D.scale,
    y: (cam2D.offsetY - sy) / cam2D.scale
  };
}

/*************************************************************************
 * RENDER 2D CAD WORKSPACE (EXACT VISUAL STYLE OF SCREENSHOT 4 + OVERLAYS)
 *************************************************************************/
function render2DWorkspace(targetCanvasId = 'canvas2DWorkspace') {
  const canvas = document.getElementById(targetCanvasId);
  if (!canvas) return;
  const isSnapshot = targetCanvasId !== 'canvas2DWorkspace';
  const dpr = isSnapshot ? 2 : (window.devicePixelRatio || 1);
  const W = isSnapshot ? 760 : Math.round(canvas.getBoundingClientRect().width || 760);
  const H = isSnapshot ? 390 : Math.round(canvas.getBoundingClientRect().height || 390);
  if (W === 0 || H === 0) return;

  // Set internal buffer dimensions for both live canvas and crisp high-DPI snapshot
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  if (isSnapshot) {
    canvas.style.width = '100%';
    canvas.style.maxWidth = `${W}px`;
    canvas.style.height = 'auto';
  }

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);

  // Background (pure clean white #ffffff for printable report sheet, off-white/dark for CAD workspace)
  const lightStyle = isSnapshot || !isDarkMode;
  ctx.fillStyle = isSnapshot ? '#ffffff' : (lightStyle ? '#f8fafc' : '#090d16');
  ctx.fillRect(0, 0, W, H);

  // Calculate camera transform for snapshot vs live canvas
  let sc = cam2D.scale;
  let offX = cam2D.offsetX;
  let offY = cam2D.offsetY;

  if (isSnapshot) {
    if (frame2D.nodes.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ไม่มีข้อมูลโครงสร้าง 2D (No 2D Structure Model)', W / 2, H / 2);
      ctx.restore();
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    frame2D.nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);

    // Padding in logical pixels to ensure loads, labels, and support reactions never get clipped:
    // - Top: UDL arrows (34px), point load arrows (58px), and labels (needs ~76px)
    // - Bottom: Supports (22px), roller circles (26px), reaction labels (37-49px) (needs ~58px)
    // - Left/Right: Horizontal point loads (48-56px), node circles, and labels (needs ~68px)
    const padTop = 76;
    const padBottom = 58;
    const padLeft = 68;
    const padRight = 68;

    const availW = Math.max(100, W - padLeft - padRight);
    const availH = Math.max(100, H - padTop - padBottom);

    sc = Math.min(availW / spanX, availH / spanY);
    // Reasonable scale clamping to prevent extreme magnification or tiny rendering
    if (sc > 90) sc = 90;
    if (sc < 10) sc = 10;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Center horizontally and vertically with exact padding alignment
    const targetScreenCenterX = (padLeft + (W - padRight)) / 2;
    const targetScreenCenterY = padTop + availH / 2;

    offX = targetScreenCenterX - centerX * sc;
    offY = targetScreenCenterY + centerY * sc;
  }

  const w2s = (wx, wy) => ({ x: offX + wx * sc, y: offY - wy * sc });

  // Draw Metric Grid Lines (every 0.5m minor, 1.0m major)
  ctx.lineWidth = 1;
  const startGridX = Math.floor((-offX / sc) * 2) / 2;
  const endGridX = Math.ceil(((W - offX) / sc) * 2) / 2;
  const startGridY = Math.floor(((offY - H) / sc) * 2) / 2;
  const endGridY = Math.ceil((offY / sc) * 2) / 2;

  for (let gx = startGridX; gx <= endGridX; gx += 0.5) {
    const sx = offX + gx * sc;
    const isMajor = Math.abs(gx % 1) < 1e-3;
    ctx.strokeStyle = lightStyle
      ? (isMajor ? '#e2e8f0' : '#f1f5f9')
      : (isMajor ? '#1e293b' : '#0f172a');
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, H);
    ctx.stroke();
  }
  for (let gy = startGridY; gy <= endGridY; gy += 0.5) {
    const sy = offY - gy * sc;
    const isMajor = Math.abs(gy % 1) < 1e-3;
    ctx.strokeStyle = lightStyle
      ? (isMajor ? '#e2e8f0' : '#f1f5f9')
      : (isMajor ? '#1e293b' : '#0f172a');
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(W, sy);
    ctx.stroke();
  }

  // Node lookup
  const nodeMap = {};
  frame2D.nodes.forEach(n => { nodeMap[n.id] = n; });

  // 1. Draw Internal Force / Deflection Diagram Overlays on Members
  if (frame2D.solved && overlay2D !== 'none') {
    frame2D.members.forEach(m => {
      const n1 = nodeMap[m.n1], n2 = nodeMap[m.n2];
      if (!n1 || !n2) return;
      const p1 = w2s(n1.x, n1.y);
      const p2 = w2s(n2.x, n2.y);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const lenPx = Math.hypot(dx, dy);
      if (lenPx < 1) return;
      const nx = -dy / lenPx;
      const ny = dx / lenPx;

      if (overlay2D === 'axial') {
        const maxN = Math.max(1, frame2D.maxN);
        const hPx = ((m.N || 0) / maxN) * 34;
        ctx.fillStyle = (m.N || 0) >= 0 ? 'rgba(14, 165, 233, 0.28)' : 'rgba(245, 158, 11, 0.28)';
        ctx.strokeStyle = (m.N || 0) >= 0 ? '#0284c7' : '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x + nx * hPx, p1.y + ny * hPx);
        ctx.lineTo(p2.x + nx * hPx, p2.y + ny * hPx);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = (m.N || 0) >= 0 ? '#0284c7' : '#d97706';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`N=${Units.force(m.N || 0).toFixed(1)}${Units.uForce()}`, (p1.x + p2.x) / 2 + nx * (hPx * 0.6), (p1.y + p2.y) / 2 + ny * (hPx * 0.6));
      } else if (overlay2D === 'shear') {
        const maxV = Math.max(1, frame2D.maxV);
        const h1 = ((m.V1 || 0) / maxV) * 34;
        const h2 = ((m.V2 || 0) / maxV) * 34;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x + nx * h1, p1.y + ny * h1);
        ctx.lineTo(p2.x + nx * h2, p2.y + ny * h2);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (overlay2D === 'moment') {
        const maxM = Math.max(1, frame2D.maxM);
        const h1 = ((m.M1 || 0) / maxM) * 38;
        const hMid = ((m.M_mid || 0) / maxM) * 38;
        const h2 = ((m.M2 || 0) / maxM) * 38;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x + nx * h1, p1.y + ny * h1);
        ctx.quadraticCurveTo(
          (p1.x + p2.x) / 2 + nx * (2 * hMid - 0.5 * (h1 + h2)),
          (p1.y + p2.y) / 2 + ny * (2 * hMid - 0.5 * (h1 + h2)),
          p2.x + nx * h2,
          p2.y + ny * h2
        );
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (overlay2D === 'deflection') {
        const defScale = frame2D.maxDelta > 0 ? (32 / (frame2D.maxDelta / 1000)) : 50;
        const dp1 = w2s(n1.x + (n1.ux || 0) * defScale, n1.y + (n1.uy || 0) * defScale);
        const dp2 = w2s(n2.x + (n2.ux || 0) * defScale, n2.y + (n2.uy || 0) * defScale);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(dp1.x, dp1.y);
        ctx.lineTo(dp2.x, dp2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }

  // 2. Draw Structural Members (Dark Slate Lines + Pin Hinge Circles + M# & Length Labels like Screenshot 4)
  frame2D.members.forEach(m => {
    const n1 = nodeMap[m.n1], n2 = nodeMap[m.n2];
    if (!n1 || !n2) return;
    const p1 = w2s(n1.x, n1.y);
    const p2 = w2s(n2.x, n2.y);

    const isSingleSelected = !isSnapshot && mouse2D.selectedMemberId === m.id;
    const isCategoryMemberFocus = !isSnapshot && (active2DFocusTab === 'members' || active2DFocusTab === 'sections' || active2DFocusTab === 'materials');
    const isSelected = isSingleSelected || isCategoryMemberFocus;
    const isHovered = !isSnapshot && mouse2D.hoveredMemberId === m.id;

    if (isSelected) {
      // Glowing aura for selected member
      ctx.save();
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 22;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Core white laser line
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.strokeStyle = isHovered ? '#0284c7' : (lightStyle ? '#334155' : '#cbd5e1');
      ctx.lineWidth = isHovered ? 5 : 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenPx = Math.hypot(dx, dy);
    const ux = dx / (lenPx || 1);
    const uy = dy / (lenPx || 1);

    // Draw Pin-Ended Hinge Release Circles for Truss Members (Exact match to Screenshot 4!)
    if (m.type === 'truss' && lenPx > 28) {
      const rOffset = 11;
      [
        { x: p1.x + ux * rOffset, y: p1.y + uy * rOffset },
        { x: p2.x - ux * rOffset, y: p2.y - uy * rOffset }
      ].forEach(hc => {
        ctx.fillStyle = lightStyle ? '#ffffff' : '#0f172a';
        ctx.strokeStyle = lightStyle ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hc.x, hc.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Member ID & Length Callout Label (e.g. "M9 / 2.915 m" or "9.564 ft")
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const geomLen = Math.hypot(n2.x - n1.x, n2.y - n1.y);
    const mLen = (m.length && m.length > 1e-4) ? m.length : geomLen;
    const lenDisp = Units.len(mLen);
    const L_str = Math.abs(lenDisp - Math.round(lenDisp)) < 1e-3
      ? `${Math.round(lenDisp)} ${Units.uLen()}`
      : `${lenDisp.toFixed(3)} ${Units.uLen()}`;

    // Position label slightly offset from member line
    let offLx = -uy * 18;
    let offLy = ux * 18;
    if (Math.abs(dx) < 5) {
      // Vertical column: place label on outside
      offLx = n1.x <= 0.1 ? -28 : 28;
      offLy = 0;
    } else if (Math.abs(dy) < 5) {
      // Horizontal beam: place label below beam
      offLx = 0;
      offLy = 18;
    }

    ctx.fillStyle = isSelected ? '#38bdf8' : (lightStyle ? '#475569' : '#94a3b8');
    ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`M${m.id}`, midX + offLx, midY + offLy - 4);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(L_str, midX + offLx, midY + offLy + 8);

    // Draw Member Distributed Load (Red UDL arrows along top of member, glows if member selected)
    if (m.w && Math.abs(m.w) > 0) {
      const udlH = 34;
      const top1 = { x: p1.x, y: p1.y - udlH };
      const top2 = { x: p2.x, y: p2.y - udlH };
      const isUdlGlowing = isSingleSelected || (!isSnapshot && active2DFocusTab === 'loads');

      if (isUdlGlowing) {
        ctx.save();
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 18;
      }

      ctx.strokeStyle = isUdlGlowing ? '#ff2a6d' : '#dc2626';
      ctx.fillStyle = isUdlGlowing ? '#ff2a6d' : '#dc2626';
      ctx.lineWidth = isUdlGlowing ? 2.2 : 1.4;

      // Top connecting line
      ctx.beginPath();
      ctx.moveTo(top1.x, top1.y);
      ctx.lineTo(top2.x, top2.y);
      ctx.stroke();

      // vertical red arrows pointing down to the member
      const numArrows = 5;
      for (let k = 0; k <= numArrows; k++) {
        const t = k / numArrows;
        const ax = p1.x + dx * t;
        const ay = p1.y + dy * t;
        ctx.beginPath();
        ctx.moveTo(ax, ay - udlH);
        ctx.lineTo(ax, ay - 5);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(ax, ay - 4);
        ctx.lineTo(ax - 3.5, ay - 11);
        ctx.lineTo(ax + 3.5, ay - 11);
        ctx.closePath();
        ctx.fill();
      }

      // Label above UDL
      ctx.font = isUdlGlowing ? 'bold 11px Inter, sans-serif' : 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${+Units.dist(m.w).toFixed(2)} ${Units.uDist()}`, (top1.x + top2.x) / 2, Math.min(top1.y, top2.y) - 6);

      if (isUdlGlowing) {
        ctx.restore();
      }
    }
  });

  // Rubber-band line when connecting a new member
  if ((tool2D === 'member_frame' || tool2D === 'member_truss') && mouse2D.memberStartNodeId && !isSnapshot) {
    const startNode = nodeMap[mouse2D.memberStartNodeId];
    if (startNode) {
      const p1 = w2s(startNode.x, startNode.y);
      const p2 = w2s(mouse2D.snapX, mouse2D.snapY);
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const dist = Math.hypot(mouse2D.snapX - startNode.x, mouse2D.snapY - startNode.y);
      ctx.fillStyle = '#0d9488';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`L = ${Units.len(dist).toFixed(3)} ${Units.uLen()}`, (p1.x + p2.x) / 2 + 12, (p1.y + p2.y) / 2 - 8);
    }
  }

  // 3. Draw Supports, Nodal Loads, Live Support Reactions & Node Circles
  frame2D.nodes.forEach(n => {
    const p = w2s(n.x, n.y);

    // Draw Support Symbol at Node
    if (n.support && n.support !== 'none') {
      const isSupportGlowing = !isSnapshot && (active2DFocusTab === 'supports');
      if (isSupportGlowing) {
        ctx.save();
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 26;
      }

      ctx.strokeStyle = isSupportGlowing ? '#34d399' : (lightStyle ? '#334155' : '#94a3b8');
      ctx.fillStyle = isSupportGlowing ? '#059669' : (lightStyle ? '#e2e8f0' : '#1e293b');
      ctx.lineWidth = isSupportGlowing ? 3 : 2;
      if (n.support === 'pinned' || n.support === 'roller') {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 4);
        ctx.lineTo(p.x - 11, p.y + 22);
        ctx.lineTo(p.x + 11, p.y + 22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (n.support === 'roller') {
          ctx.beginPath();
          ctx.arc(p.x - 5, p.y + 26, 2.5, 0, Math.PI * 2);
          ctx.arc(p.x + 5, p.y + 26, 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (n.support === 'fixed') {
        ctx.fillRect(p.x - 14, p.y + 4, 28, 10);
        ctx.strokeRect(p.x - 14, p.y + 4, 28, 10);
      }

      if (isSupportGlowing) {
        ctx.restore();
      }

      // Live Reaction Vector Readout on Canvas
      if (show2DReactions && frame2D.solved) {
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`Ry=${Units.force(n.ry || 0).toFixed(1)}${Units.uForce()}`, p.x, p.y + 37);
        if (Math.abs(n.rx || 0) > 0.05) {
          ctx.fillText(`Rx=${Units.force(n.rx || 0).toFixed(1)}${Units.uForce()}`, p.x, p.y + 49);
        }
      }
    }

    // Node selection & load focus state (supports single selection and rail category focus)
    const isSingleNodeSel = !isSnapshot && (mouse2D.selectedNodeId === n.id || mouse2D.memberStartNodeId === n.id);
    const isNodeCategoryFocus = !isSnapshot && (active2DFocusTab === 'nodes');
    const isSel = isSingleNodeSel || isNodeCategoryFocus;
    const isHov = !isSnapshot && mouse2D.hoveredNodeId === n.id;
    const isLoadGlowing = isSingleNodeSel || (!isSnapshot && active2DFocusTab === 'loads');

    // Draw Nodal Point Loads (Glows vividly when the node/load is selected/focused)
    if (n.fy && Math.abs(n.fy) > 0) {
      const isDown = n.fy < 0;
      const arrowLen = 58;
      const yStart = isDown ? p.y - arrowLen - 6 : p.y + arrowLen + 6;
      const yEnd = isDown ? p.y - 6 : p.y + 6;

      if (isLoadGlowing) {
        ctx.save();
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 22;
      }

      ctx.strokeStyle = isLoadGlowing ? '#ff2a6d' : '#dc2626';
      ctx.fillStyle = isLoadGlowing ? '#ff2a6d' : '#dc2626';
      ctx.lineWidth = isLoadGlowing ? 3.5 : 2;

      ctx.beginPath();
      ctx.moveTo(p.x, yStart);
      ctx.lineTo(p.x, yEnd);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.x, yEnd);
      ctx.lineTo(p.x - 5, yEnd + (isDown ? -10 : 10));
      ctx.lineTo(p.x + 5, yEnd + (isDown ? -10 : 10));
      ctx.closePath();
      ctx.fill();

      ctx.font = isLoadGlowing ? 'bold 11px Inter, sans-serif' : 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${+Units.force(Math.abs(n.fy)).toFixed(2)} ${Units.uForce()}`, p.x, yStart - 6);

      if (isLoadGlowing) {
        ctx.restore();
      }
    }

    if (n.fx && Math.abs(n.fx) > 0) {
      const isRight = n.fx > 0;
      const arrowLen = 48;
      const xStart = isRight ? p.x - arrowLen - 8 : p.x + arrowLen + 8;
      const xEnd = isRight ? p.x - 8 : p.x + 8;

      if (isLoadGlowing) {
        ctx.save();
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 22;
      }

      ctx.strokeStyle = isLoadGlowing ? '#ff2a6d' : '#dc2626';
      ctx.fillStyle = isLoadGlowing ? '#ff2a6d' : '#dc2626';
      ctx.lineWidth = isLoadGlowing ? 3.5 : 2;

      ctx.beginPath();
      ctx.moveTo(xStart, p.y);
      ctx.lineTo(xEnd, p.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xEnd, p.y);
      ctx.lineTo(xEnd + (isRight ? -10 : 10), p.y - 5);
      ctx.lineTo(xEnd + (isRight ? -10 : 10), p.y + 5);
      ctx.closePath();
      ctx.fill();

      ctx.font = isLoadGlowing ? 'bold 11px Inter, sans-serif' : 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${+Units.force(Math.abs(n.fx)).toFixed(2)} ${Units.uForce()}`, (xStart + xEnd) / 2, p.y - 8);

      if (isLoadGlowing) {
        ctx.restore();
      }
    }

    // Draw Node Circle with Glowing Halo when Selected & Focused
    if (isSel) {
      ctx.save();
      // Outer neon cyan glowing halo
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
      ctx.fill();

      // Core pure white node circle with crisp border
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = isHov ? '#38bdf8' : (lightStyle ? '#ffffff' : '#0f172a');
      ctx.strokeStyle = isHov ? '#0284c7' : (lightStyle ? '#334155' : '#e2e8f0');
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHov ? 6.5 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = isSel ? '#38bdf8' : (lightStyle ? '#334155' : '#cbd5e1');
    ctx.font = isSel ? 'bold 11px Inter, sans-serif' : 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`N${n.id}`, p.x + 8, p.y - 7);
  });

  ctx.restore();
}

/*************************************************************************
 * 2D CANVAS INTERACTIVE MOUSE HANDLERS (DRAG NODES, CLICK TO CONNECT, ETC.)
 *************************************************************************/
function init2DCanvasEvents() {
  const canvas = document.getElementById('canvas2DWorkspace');
  if (!canvas) return;

  const findNearestNode = (wx, wy, maxPx = 15) => {
    const maxWorld = maxPx / cam2D.scale;
    let best = null, minD = maxWorld;
    frame2D.nodes.forEach(n => {
      const d = Math.hypot(n.x - wx, n.y - wy);
      if (d < minD) { minD = d; best = n; }
    });
    return best;
  };

  const findNearestMember = (wx, wy, maxPx = 10) => {
    const maxWorld = maxPx / cam2D.scale;
    let best = null, minD = maxWorld;
    frame2D.members.forEach(m => {
      const n1 = frame2D.nodes.find(n => n.id === m.n1);
      const n2 = frame2D.nodes.find(n => n.id === m.n2);
      if (!n1 || !n2) return;
      const vx = n2.x - n1.x, vy = n2.y - n1.y;
      const len2 = vx * vx + vy * vy;
      if (len2 < 1e-6) return;
      let t = ((wx - n1.x) * vx + (wy - n1.y) * vy) / len2;
      t = Math.max(0.08, Math.min(0.92, t));
      const projX = n1.x + t * vx, projY = n1.y + t * vy;
      const d = Math.hypot(wx - projX, wy - projY);
      if (d < minD) { minD = d; best = m; }
    });
    return best;
  };

  const findNearestLoad = (wx, wy, maxPx = 22) => {
    const maxWorld = maxPx / cam2D.scale;
    // Check nodal point loads
    for (const n of frame2D.nodes) {
      if (n.fy && Math.abs(n.fy) > 0) {
        const isDown = n.fy < 0;
        const arrowWorld = 58 / cam2D.scale;
        const topY = isDown ? n.y + arrowWorld : n.y - arrowWorld;
        const minY = Math.min(n.y, topY), maxY = Math.max(n.y, topY);
        if (Math.abs(wx - n.x) < maxWorld && wy >= minY - 0.2 && wy <= maxY + 0.2) {
          return { type: 'node', id: n.id };
        }
      }
      if (n.fx && Math.abs(n.fx) > 0) {
        const isRight = n.fx > 0;
        const arrowWorld = 48 / cam2D.scale;
        const tipX = isRight ? n.x - arrowWorld : n.x + arrowWorld;
        const minX = Math.min(n.x, tipX), maxX = Math.max(n.x, tipX);
        if (Math.abs(wy - n.y) < maxWorld && wx >= minX - 0.2 && wx <= maxX + 0.2) {
          return { type: 'node', id: n.id };
        }
      }
    }
    // Check member UDL loads
    for (const m of frame2D.members) {
      if (m.w && Math.abs(m.w) > 0) {
        const n1 = frame2D.nodes.find(n => n.id === m.n1);
        const n2 = frame2D.nodes.find(n => n.id === m.n2);
        if (!n1 || !n2) continue;
        const minX = Math.min(n1.x, n2.x) - 0.25, maxX = Math.max(n1.x, n2.x) + 0.25;
        const udlOffset = 34 / cam2D.scale;
        const topY = Math.max(n1.y, n2.y) + udlOffset;
        if (wx >= minX && wx <= maxX && Math.abs(wy - topY) < maxWorld * 1.6) {
          return { type: 'member', id: m.id };
        }
      }
    }
    return null;
  };

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (mouse2D.isPanning) {
      cam2D.offsetX += sx - mouse2D.panStartX;
      cam2D.offsetY += sy - mouse2D.panStartY;
      mouse2D.panStartX = sx;
      mouse2D.panStartY = sy;
      render2DWorkspace();
      return;
    }

    const w = screenToWorld2D(sx, sy);
    mouse2D.worldX = w.x;
    mouse2D.worldY = w.y;
    // Magnetic 0.25m grid snap (unless Shift key held)
    const snapStep = e.shiftKey ? 0.05 : 0.25;
    mouse2D.snapX = +(Math.round(w.x / snapStep) * snapStep).toFixed(2);
    mouse2D.snapY = +(Math.round(w.y / snapStep) * snapStep).toFixed(2);

    const coordEl = document.getElementById('cursor2DCoords');
    if (coordEl) {
      coordEl.innerText = `X: ${Units.len(mouse2D.snapX).toFixed(2)} ${Units.uLen()}, Y: ${Units.len(mouse2D.snapY).toFixed(2)} ${Units.uLen()}`;
    }

    // Real-time Node Dragging & Instant FEA Re-Solve!
    if (mouse2D.draggingNodeId !== null) {
      const dragNode = frame2D.nodes.find(n => n.id === mouse2D.draggingNodeId);
      if (dragNode) {
        dragNode.x = mouse2D.snapX;
        dragNode.y = mouse2D.snapY;
        solve2DFrame();
      }
      return;
    }

    const hovNode = findNearestNode(w.x, w.y);
    mouse2D.hoveredNodeId = hovNode ? hovNode.id : null;
    if (hovNode) {
      mouse2D.snapX = hovNode.x;
      mouse2D.snapY = hovNode.y;
      mouse2D.hoveredMemberId = null;
    } else {
      const hovMem = findNearestMember(w.x, w.y);
      mouse2D.hoveredMemberId = hovMem ? hovMem.id : null;
    }
    render2DWorkspace();
  });

  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    // Right-click or Middle-click pans the 2D canvas
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      mouse2D.isPanning = true;
      mouse2D.panStartX = sx;
      mouse2D.panStartY = sy;
      return;
    }

    const w = screenToWorld2D(sx, sy);
    const hitNode = findNearestNode(w.x, w.y);
    const hitMember = hitNode ? null : findNearestMember(w.x, w.y);
    const hitLoad = (hitNode || hitMember) ? null : findNearestLoad(w.x, w.y);

    if (tool2D === 'select') {
      if (hitNode) {
        mouse2D.selectedNodeId = hitNode.id;
        mouse2D.selectedMemberId = null;
        mouse2D.draggingNodeId = hitNode.id;
      } else if (hitMember) {
        mouse2D.selectedMemberId = hitMember.id;
        mouse2D.selectedNodeId = null;
      } else if (hitLoad) {
        if (hitLoad.type === 'node') {
          mouse2D.selectedNodeId = hitLoad.id;
          mouse2D.selectedMemberId = null;
        } else {
          mouse2D.selectedMemberId = hitLoad.id;
          mouse2D.selectedNodeId = null;
        }
      } else {
        mouse2D.selectedNodeId = null;
        mouse2D.selectedMemberId = null;
        mouse2D.isPanning = true;
        mouse2D.panStartX = sx;
        mouse2D.panStartY = sy;
      }
      update2DBadgesAndTables();
      render2DWorkspace();
    } else if (tool2D === 'node') {
      if (!hitNode) {
        const nextId = frame2D.nodes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
        frame2D.nodes.push({ id: nextId, x: mouse2D.snapX, y: mouse2D.snapY, support: 'none', fx: 0, fy: 0, mz: 0 });
        mouse2D.selectedNodeId = nextId;
        record2DHistory(`Added Node N${nextId} (${mouse2D.snapX}, ${mouse2D.snapY})`);
        solve2DFrame();
      }
    } else if (tool2D === 'member_frame' || tool2D === 'member_truss') {
      let targetNode = hitNode;
      if (!targetNode) {
        // Auto-create node at clicked grid intersection!
        const nextId = frame2D.nodes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
        targetNode = { id: nextId, x: mouse2D.snapX, y: mouse2D.snapY, support: 'none', fx: 0, fy: 0, mz: 0 };
        frame2D.nodes.push(targetNode);
      }
      if (!mouse2D.memberStartNodeId) {
        mouse2D.memberStartNodeId = targetNode.id;
      } else if (mouse2D.memberStartNodeId !== targetNode.id) {
        const n1 = mouse2D.memberStartNodeId;
        const n2 = targetNode.id;
        const exists = frame2D.members.some(m => (m.n1 === n1 && m.n2 === n2) || (m.n1 === n2 && m.n2 === n1));
        if (!exists) {
          const nextMId = frame2D.members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
          const mType = tool2D === 'member_truss' ? 'truss' : 'frame';
          frame2D.members.push({ id: nextMId, n1, n2, type: mType, w: 0 });
          record2DHistory(`Added ${mType} M${nextMId} (N${n1}-N${n2})`);
        }
        mouse2D.memberStartNodeId = targetNode.id; // Chain next member seamlessly
        solve2DFrame();
      }
      render2DWorkspace();
    } else if (tool2D === 'support') {
      if (hitNode) {
        const order = ['pinned', 'fixed', 'roller', 'none'];
        const nextSup = order[(order.indexOf(hitNode.support || 'none') + 1) % order.length];
        hitNode.support = nextSup;
        mouse2D.selectedNodeId = hitNode.id;
        record2DHistory(`Support N${hitNode.id} -> ${nextSup}`);
        solve2DFrame();
      }
    } else if (tool2D === 'load') {
      const fxDisp = parseFloat(document.getElementById('tool2DLoadFx')?.value) || 0;
      const fyDisp = parseFloat(document.getElementById('tool2DLoadFy')?.value) || 0;
      const wDisp = parseFloat(document.getElementById('tool2DLoadW')?.value) || 0;
      const fxVal = +Units.toSIForce(fxDisp).toFixed(4);
      const fyVal = +Units.toSIForce(fyDisp).toFixed(4);
      const wVal = +Units.toSIDist(wDisp).toFixed(4);
      if (hitNode) {
        hitNode.fx = fxVal;
        hitNode.fy = fyVal;
        mouse2D.selectedNodeId = hitNode.id;
        record2DHistory(`Applied Load on N${hitNode.id}`);
        solve2DFrame();
      } else if (hitMember) {
        hitMember.w = wVal;
        mouse2D.selectedMemberId = hitMember.id;
        record2DHistory(`Applied UDL on M${hitMember.id}`);
        solve2DFrame();
      }
    } else if (tool2D === 'erase') {
      if (hitNode && frame2D.nodes.length > 2) {
        frame2D.nodes = frame2D.nodes.filter(n => n.id !== hitNode.id);
        frame2D.members = frame2D.members.filter(m => m.n1 !== hitNode.id && m.n2 !== hitNode.id);
        record2DHistory(`Erased Node N${hitNode.id}`);
        solve2DFrame();
      } else if (hitMember) {
        frame2D.members = frame2D.members.filter(m => m.id !== hitMember.id);
        record2DHistory(`Erased Member M${hitMember.id}`);
        solve2DFrame();
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (mouse2D.draggingNodeId !== null) {
      record2DHistory(`Moved Node N${mouse2D.draggingNodeId} to (${mouse2D.snapX}, ${mouse2D.snapY})`);
      mouse2D.draggingNodeId = null;
      update2DBadgesAndTables();
    }
    mouse2D.isPanning = false;
  });

  // =========================================================================
  // MOBILE TOUCH GESTURES FOR 2D CAD CANVAS (1-Finger Tap/Drag & 2-Finger Pinch/Pan)
  // =========================================================================
  let touch2DLastDist = 0;
  let touch2DLastMidX = 0;
  let touch2DLastMidY = 0;

  canvas.addEventListener('touchstart', e => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length === 2) {
      e.preventDefault();
      mouse2D.draggingNodeId = null;
      mouse2D.isPanning = false;
      const t1 = e.touches[0], t2 = e.touches[1];
      touch2DLastDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touch2DLastMidX = ((t1.clientX + t2.clientX) / 2) - rect.left;
      touch2DLastMidY = ((t1.clientY + t2.clientY) / 2) - rect.top;
      return;
    }

    if (e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const sx = t.clientX - rect.left;
    const sy = t.clientY - rect.top;

    const w = screenToWorld2D(sx, sy);
    mouse2D.worldX = w.x;
    mouse2D.worldY = w.y;
    const snapStep = 0.25;
    mouse2D.snapX = +(Math.round(w.x / snapStep) * snapStep).toFixed(2);
    mouse2D.snapY = +(Math.round(w.y / snapStep) * snapStep).toFixed(2);

    const coordEl = document.getElementById('cursor2DCoords');
    if (coordEl) {
      coordEl.innerText = `X: ${Units.len(mouse2D.snapX).toFixed(2)} ${Units.uLen()}, Y: ${Units.len(mouse2D.snapY).toFixed(2)} ${Units.uLen()}`;
    }

    // Generous finger hit radius on mobile (26px for nodes, 18px for members, 28px for loads)
    const hitNode = findNearestNode(w.x, w.y, 26);
    const hitMember = hitNode ? null : findNearestMember(w.x, w.y, 18);
    const hitLoad = (hitNode || hitMember) ? null : findNearestLoad(w.x, w.y, 28);

    if (tool2D === 'select') {
      if (hitNode) {
        mouse2D.selectedNodeId = hitNode.id;
        mouse2D.selectedMemberId = null;
        mouse2D.draggingNodeId = hitNode.id;
      } else if (hitMember) {
        mouse2D.selectedMemberId = hitMember.id;
        mouse2D.selectedNodeId = null;
      } else if (hitLoad) {
        if (hitLoad.type === 'node') {
          mouse2D.selectedNodeId = hitLoad.id;
          mouse2D.selectedMemberId = null;
        } else {
          mouse2D.selectedMemberId = hitLoad.id;
          mouse2D.selectedNodeId = null;
        }
      } else {
        mouse2D.selectedNodeId = null;
        mouse2D.selectedMemberId = null;
        mouse2D.isPanning = true;
        mouse2D.panStartX = sx;
        mouse2D.panStartY = sy;
      }
      update2DBadgesAndTables();
      render2DWorkspace();
    } else if (tool2D === 'node') {
      if (!hitNode) {
        const nextId = frame2D.nodes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
        frame2D.nodes.push({ id: nextId, x: mouse2D.snapX, y: mouse2D.snapY, support: 'none', fx: 0, fy: 0, mz: 0 });
        mouse2D.selectedNodeId = nextId;
        record2DHistory(`Added Node N${nextId} (${mouse2D.snapX}, ${mouse2D.snapY})`);
        solve2DFrame();
      }
    } else if (tool2D === 'member_frame' || tool2D === 'member_truss') {
      let targetNode = hitNode;
      if (!targetNode) {
        const nextId = frame2D.nodes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
        targetNode = { id: nextId, x: mouse2D.snapX, y: mouse2D.snapY, support: 'none', fx: 0, fy: 0, mz: 0 };
        frame2D.nodes.push(targetNode);
      }
      if (!mouse2D.memberStartNodeId) {
        mouse2D.memberStartNodeId = targetNode.id;
      } else if (mouse2D.memberStartNodeId !== targetNode.id) {
        const n1 = mouse2D.memberStartNodeId;
        const n2 = targetNode.id;
        const exists = frame2D.members.some(m => (m.n1 === n1 && m.n2 === n2) || (m.n1 === n2 && m.n2 === n1));
        if (!exists) {
          const nextMId = frame2D.members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
          const mType = tool2D === 'member_truss' ? 'truss' : 'frame';
          frame2D.members.push({ id: nextMId, n1, n2, type: mType, w: 0 });
          record2DHistory(`Added ${mType} M${nextMId} (N${n1}-N${n2})`);
        }
        mouse2D.memberStartNodeId = targetNode.id;
        solve2DFrame();
      }
      render2DWorkspace();
    } else if (tool2D === 'support') {
      if (hitNode) {
        const order = ['pinned', 'fixed', 'roller', 'none'];
        const nextSup = order[(order.indexOf(hitNode.support || 'none') + 1) % order.length];
        hitNode.support = nextSup;
        mouse2D.selectedNodeId = hitNode.id;
        record2DHistory(`Support N${hitNode.id} -> ${nextSup}`);
        solve2DFrame();
      }
    } else if (tool2D === 'load') {
      const fxDisp = parseFloat(document.getElementById('tool2DLoadFx')?.value) || 0;
      const fyDisp = parseFloat(document.getElementById('tool2DLoadFy')?.value) || 0;
      const wDisp = parseFloat(document.getElementById('tool2DLoadW')?.value) || 0;
      const fxVal = +Units.toSIForce(fxDisp).toFixed(4);
      const fyVal = +Units.toSIForce(fyDisp).toFixed(4);
      const wVal = +Units.toSIDist(wDisp).toFixed(4);
      if (hitNode) {
        hitNode.fx = fxVal;
        hitNode.fy = fyVal;
        mouse2D.selectedNodeId = hitNode.id;
        record2DHistory(`Applied Load on N${hitNode.id}`);
        solve2DFrame();
      } else if (hitMember) {
        hitMember.w = wVal;
        mouse2D.selectedMemberId = hitMember.id;
        record2DHistory(`Applied UDL on M${hitMember.id}`);
        solve2DFrame();
      }
    } else if (tool2D === 'erase') {
      if (hitNode && frame2D.nodes.length > 2) {
        frame2D.nodes = frame2D.nodes.filter(n => n.id !== hitNode.id);
        frame2D.members = frame2D.members.filter(m => m.n1 !== hitNode.id && m.n2 !== hitNode.id);
        record2DHistory(`Erased Node N${hitNode.id}`);
        solve2DFrame();
      } else if (hitMember) {
        frame2D.members = frame2D.members.filter(m => m.id !== hitMember.id);
        record2DHistory(`Erased Member M${hitMember.id}`);
        solve2DFrame();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = ((t1.clientX + t2.clientX) / 2) - rect.left;
      const midY = ((t1.clientY + t2.clientY) / 2) - rect.top;

      if (touch2DLastDist > 10) {
        const factor = dist / touch2DLastDist;
        const wx = (midX - cam2D.offsetX) / cam2D.scale;
        const wy = (cam2D.offsetY - midY) / cam2D.scale;
        cam2D.scale = Math.max(20, Math.min(220, cam2D.scale * factor));
        cam2D.offsetX = midX - wx * cam2D.scale;
        cam2D.offsetY = midY + wy * cam2D.scale;
        cam2D.zoomPct = Math.round((cam2D.scale / 68) * 100);
        const zoomLbl = document.getElementById('zoom2DLabel');
        if (zoomLbl) zoomLbl.innerText = `${cam2D.zoomPct}%`;
      }
      cam2D.offsetX += (midX - touch2DLastMidX);
      cam2D.offsetY += (midY - touch2DLastMidY);
      touch2DLastDist = dist;
      touch2DLastMidX = midX;
      touch2DLastMidY = midY;
      render2DWorkspace();
      return;
    }

    if (e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const sx = t.clientX - rect.left;
    const sy = t.clientY - rect.top;

    if (mouse2D.isPanning) {
      cam2D.offsetX += sx - mouse2D.panStartX;
      cam2D.offsetY += sy - mouse2D.panStartY;
      mouse2D.panStartX = sx;
      mouse2D.panStartY = sy;
      render2DWorkspace();
      return;
    }

    const w = screenToWorld2D(sx, sy);
    mouse2D.worldX = w.x;
    mouse2D.worldY = w.y;
    const snapStep = 0.25;
    mouse2D.snapX = +(Math.round(w.x / snapStep) * snapStep).toFixed(2);
    mouse2D.snapY = +(Math.round(w.y / snapStep) * snapStep).toFixed(2);

    const coordEl = document.getElementById('cursor2DCoords');
    if (coordEl) {
      coordEl.innerText = `X: ${Units.len(mouse2D.snapX).toFixed(2)} ${Units.uLen()}, Y: ${Units.len(mouse2D.snapY).toFixed(2)} ${Units.uLen()}`;
    }

    if (mouse2D.draggingNodeId !== null) {
      const dragNode = frame2D.nodes.find(n => n.id === mouse2D.draggingNodeId);
      if (dragNode) {
        dragNode.x = mouse2D.snapX;
        dragNode.y = mouse2D.snapY;
        solve2DFrame();
      }
      return;
    }

    render2DWorkspace();
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
      if (mouse2D.draggingNodeId !== null) {
        record2DHistory(`Moved Node N${mouse2D.draggingNodeId} to (${mouse2D.snapX}, ${mouse2D.snapY})`);
        mouse2D.draggingNodeId = null;
        update2DBadgesAndTables();
      }
      mouse2D.isPanning = false;
    }
  });

  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    mouse2D.memberStartNodeId = null;
    render2DWorkspace();
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoom2D(e.deltaY < 0 ? 1.08 : 0.92);
  }, { passive: false });
}

window.addEventListener('DOMContentLoaded', () => {
  init2DCanvasEvents();
  load2DPreset('braced_two_storey');
});

