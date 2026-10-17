/*************************************************************************
 * PART 4: SECTION BUILDER, STANDARD CATALOG & CLOUD LIBRARY
 *************************************************************************/

// 1. STANDARD SECTIONS CATALOG (มอก. TIS, AISC, ACI, EN)
const STANDARD_SECTIONS_CATALOG = {
  // Wide Flange / H-Beam (มอก. 1227 / AISC Wide Flange)
  'wf_w150_150': { name: 'H-Beam 150x150x7x10', shape: 'ibeam', category: 'ibeam', E: 200, d: 150, b: 150, tf: 10.0, tw: 7.0, desc: 'มอก. H-Beam ขนาดเล็ก เสา/คาน' },
  'wf_w200_200': { name: 'H-Beam 200x200x8x12', shape: 'ibeam', category: 'ibeam', E: 200, d: 200, b: 200, tf: 12.0, tw: 8.0, desc: 'มอก. H-Beam เสาอาคาร 2-3 ชั้น' },
  'wf_w250_250': { name: 'H-Beam 250x250x9x14', shape: 'ibeam', category: 'ibeam', E: 200, d: 250, b: 250, tf: 14.0, tw: 9.0, desc: 'มอก. H-Beam เสาโครงสร้างหลัก' },
  'wf_w300_150': { name: 'I-Beam W300x150x6.5x9', shape: 'ibeam', category: 'ibeam', E: 200, d: 300, b: 150, tf: 9.0, tw: 6.5, desc: 'มอก. Wide Flange คานช่วง 6 เมตร' },
  'wf_w310_38':  { name: 'W310x38.7 (W12x26)', shape: 'ibeam', category: 'ibeam', E: 200, d: 310, b: 165, tf: 9.7, tw: 5.8, desc: 'AISC W12x26 คานมาตรฐานสากล' },
  'wf_w350_175': { name: 'W350x175x7x11', shape: 'ibeam', category: 'ibeam', E: 200, d: 350, b: 175, tf: 11.0, tw: 7.0, desc: 'มอก. Wide Flange คานหลัก 7-8 เมตร' },
  'wf_w400_200': { name: 'W400x200x8x13', shape: 'ibeam', category: 'ibeam', E: 200, d: 400, b: 200, tf: 13.0, tw: 8.0, desc: 'มอก. Wide Flange คานรับน้ำหนักสูง' },
  'wf_w500_200': { name: 'W500x200x10x16', shape: 'ibeam', category: 'ibeam', E: 200, d: 500, b: 200, tf: 16.0, tw: 10.0, desc: 'มอก. Wide Flange คานสะพาน/โรงงาน' },
  'sec_mk2':      { name: 'MK2 SOLDIER', shape: 'ibeam', category: 'ibeam', E: 200, d: 225, b: 120, tf: 10.0, tw: 6.0, desc: 'Soldier Beam คานค้ำยันงานดิน' },

  // Square & Rectangular Hollow Sections (SHS / RHS Box มอก. 107)
  'box_50_50':   { name: 'HSS Box 50x50x3.2', shape: 'box', category: 'box', E: 200, d: 50, b: 50, tf: 3.2, tw: 3.2, desc: 'มอก. 107 เหล็กกล่องจัตุรัส เสาย่อย' },
  'box_100_50':  { name: 'HSS Box 100x50x3.2', shape: 'box', category: 'box', E: 200, d: 100, b: 50, tf: 3.2, tw: 3.2, desc: 'มอก. 107 แปหลังคา/คานรอง' },
  'box_100_100': { name: 'HSS Box 100x100x4.5', shape: 'box', category: 'box', E: 200, d: 100, b: 100, tf: 4.5, tw: 4.5, desc: 'มอก. 107 เสาโครงถัก/เสากรอบ' },
  'box_150_100': { name: 'HSS Box 150x100x4.5', shape: 'box', category: 'box', E: 200, d: 150, b: 100, tf: 4.5, tw: 4.5, desc: 'มอก. 107 คานรับแรงดัดสูง' },
  'box_200_100': { name: 'HSS Box 200x100x8', shape: 'box', category: 'box', E: 200, d: 200, b: 100, tf: 8.0, tw: 8.0, desc: 'AISC Hollow Structural Section Heavy' },
  'box_200_200': { name: 'HSS Box 200x200x9', shape: 'box', category: 'box', E: 200, d: 200, b: 200, tf: 9.0, tw: 9.0, desc: 'มอก. 107 เสาหลักต้านแผ่นดินไหว' },

  // C-Channel Sections (มอก. 1227 รางน้ำ)
  'c_75_40':    { name: 'C-Channel 75x40x5x7', shape: 'channel', category: 'channel_angle', E: 200, d: 75, b: 40, tf: 7.0, tw: 5.0, desc: 'มอก. เหล็กรางน้ำ แปผนัง' },
  'c_100_50':   { name: 'C-Channel 100x50x5x7.5', shape: 'channel', category: 'channel_angle', E: 200, d: 100, b: 50, tf: 7.5, tw: 5.0, desc: 'มอก. เหล็กรางน้ำ แปหลังคา' },
  'c_150_75':   { name: 'C-Channel 150x75x6.5x10', shape: 'channel', category: 'channel_angle', E: 200, d: 150, b: 75, tf: 10.0, tw: 6.5, desc: 'มอก. เหล็กรางน้ำ คานรอง/บันได' },
  'c_200_75':   { name: 'C-Channel 200x75x7.5x12.5', shape: 'channel', category: 'channel_angle', E: 200, d: 200, b: 75, tf: 12.5, tw: 7.5, desc: 'มอก. เหล็กรางน้ำ คานขอบ' },

  // Equal Angle Sections (มอก. 1227 ฉากเท่ากัน)
  'angle_50_50': { name: 'Equal Angle L50x50x5', shape: 'channel', category: 'channel_angle', E: 200, d: 50, b: 50, tf: 5.0, tw: 5.0, desc: 'มอก. เหล็กฉาก ค้ำยันทแยง' },
  'angle_75_75': { name: 'Equal Angle L75x75x6', shape: 'channel', category: 'channel_angle', E: 200, d: 75, b: 75, tf: 6.0, tw: 6.0, desc: 'มอก. เหล็กฉาก ชิ้นส่วนโครงถัก' },
  'angle_100':   { name: 'Equal Angle L100x100x10', shape: 'channel', category: 'channel_angle', E: 200, d: 100, b: 100, tf: 10.0, tw: 10.0, desc: 'มอก. เหล็กฉาก คอร์ดโครงถักใหญ่' },

  // Circular Hollow Sections (Pipe CHS มอก. 107 / ASTM A53)
  'pipe_2_sch40': { name: 'Pipe CHS 2" Sch 40 (OD 60.3)', shape: 'pipe', category: 'pipe', E: 200, d: 60.3, b: 60.3, tf: 3.9, tw: 3.9, desc: 'ท่อกลมเหล็ก ชิ้นส่วนทแยงโครงถัก' },
  'pipe_3_sch40': { name: 'Pipe CHS 3" Sch 40 (OD 88.9)', shape: 'pipe', category: 'pipe', E: 200, d: 88.9, b: 88.9, tf: 5.5, tw: 5.5, desc: 'ท่อกลมเหล็ก เสารับน้ำหนักย่อย' },
  'pipe_4_sch40': { name: 'Pipe CHS 4" Sch 40 (OD 114.3)', shape: 'pipe', category: 'pipe', E: 200, d: 114.3, b: 114.3, tf: 6.0, tw: 6.0, desc: 'ท่อกลมเหล็ก คอร์ดโครงถักหลังคาโค้ง' },
  'pipe_6_sch40': { name: 'Pipe CHS 6" Sch 40 (OD 168.3)', shape: 'pipe', category: 'pipe', E: 200, d: 168.3, b: 168.3, tf: 7.1, tw: 7.1, desc: 'ท่อกลมเหล็ก เสาอาคารทรงกลม' },

  // Reinforced Concrete (RC มอก. / วสท. 1014-46)
  'rc_200_400': { name: 'RC Rect 200x400 mm', shape: 'rect', category: 'concrete_timber', E: 25, d: 400, b: 200, tf: 400, tw: 200, desc: 'คอนกรีตเสริมเหล็ก คานบ้านพักอาศัย' },
  'rc_300_500': { name: 'RC Rect 300x500 mm', shape: 'rect', category: 'concrete_timber', E: 25, d: 500, b: 300, tf: 500, tw: 300, desc: 'คอนกรีตเสริมเหล็ก คานอาคารพาณิชย์' },
  'rc_300_600': { name: 'RC Rect 300x600 mm', shape: 'rect', category: 'concrete_timber', E: 25, d: 600, b: 300, tf: 600, tw: 300, desc: 'คอนกรีตเสริมเหล็ก คานช่วง 6-8 เมตร' },
  'rc_tbeam_600': { name: 'RC T-Beam 600x500 (Flange 600x100)', shape: 'tbeam', category: 'concrete_timber', E: 25, d: 500, b: 600, tf: 100, tw: 250, desc: 'คานตัวทีคอนกรีตหล่อในที่พร้อมพื้น' },

  // Structural Timber & Glulam (มอก. ไม้โครงสร้าง)
  'timber_2x6': { name: 'Timber 2"x6" (40x140 mm)', shape: 'rect', category: 'concrete_timber', E: 11, d: 140, b: 40, tf: 140, tw: 40, desc: 'ไม้เนื้อแข็ง ตงพื้น/จันทัน' },
  'glulam_150_300': { name: 'Glulam 150x300 mm', shape: 'rect', category: 'concrete_timber', E: 13, d: 300, b: 150, tf: 300, tw: 150, desc: 'ไม้ประกอบกาว (Glulam) คานโชว์เนื้อไม้' }
};

let savedCloudSections = [
  { id: 'sec_w350', name: 'CUSTOM W-350x175', shape: 'ibeam', category: 'ibeam', E: 200, d: 350, b: 175, tf: 14, tw: 9, A_cm2: 77.98, I_cm4: 16341.7, y_mm: 175 },
  { id: 'sec_mk2', name: 'MK2 SOLDIER', shape: 'ibeam', category: 'ibeam', E: 200, d: 225, b: 120, tf: 10, tw: 6, A_cm2: 22.52, I_cm4: 534.6, y_mm: 112.5 },
  { id: 'sec_w310', name: 'W310x38.7 (W12x26)', shape: 'ibeam', category: 'ibeam', E: 200, d: 310, b: 165, tf: 9.7, tw: 5.8, A_cm2: 49.4, I_cm4: 8480, y_mm: 155 },
  { id: 'sec_wf200', name: 'H-Beam 200x200x8x12', shape: 'ibeam', category: 'ibeam', E: 200, d: 200, b: 200, tf: 12, tw: 8, A_cm2: 63.53, I_cm4: 4720, y_mm: 100 },
  { id: 'sec_hss200', name: 'HSS Box 200x100x8', shape: 'box', category: 'box', E: 200, d: 200, b: 100, tf: 8, tw: 8, A_cm2: 45.4, I_cm4: 2420, y_mm: 100 },
  { id: 'sec_hss100', name: 'HSS Box 100x100x4.5', shape: 'box', category: 'box', E: 200, d: 100, b: 100, tf: 4.5, tw: 4.5, A_cm2: 16.8, I_cm4: 254.5, y_mm: 50 },
  { id: 'sec_c150', name: 'C-Channel 150x75x6.5x10', shape: 'channel', category: 'channel_angle', E: 200, d: 150, b: 75, tf: 10, tw: 6.5, A_cm2: 23.7, I_cm4: 861, y_mm: 75 },
  { id: 'sec_l75', name: 'Equal Angle L75x75x6', shape: 'channel', category: 'channel_angle', E: 200, d: 75, b: 75, tf: 6, tw: 6, A_cm2: 8.73, I_cm4: 46.2, y_mm: 54 },
  { id: 'sec_pipe4', name: 'Pipe CHS 4" Sch 40 (OD 114.3)', shape: 'pipe', category: 'pipe', E: 200, d: 114.3, b: 114.3, tf: 6, tw: 6, A_cm2: 20.4, I_cm4: 301, y_mm: 57.15 },
  { id: 'sec_rc500', name: 'RC Beam 300x500 mm', shape: 'rect', category: 'concrete_timber', E: 25, d: 500, b: 300, tf: 500, tw: 300, A_cm2: 1500, I_cm4: 312500, y_mm: 250 },
  { id: 'sec_rct600', name: 'RC T-Beam 600x500 (Flange 100)', shape: 'tbeam', category: 'concrete_timber', E: 25, d: 500, b: 600, tf: 100, tw: 250, A_cm2: 1600, I_cm4: 384000, y_mm: 312 },
  { id: 'sec_glulam', name: 'Glulam Timber 150x300 mm', shape: 'rect', category: 'concrete_timber', E: 13, d: 300, b: 150, tf: 300, tw: 150, A_cm2: 450, I_cm4: 33750, y_mm: 150 }
];

let sectionCheckpoints = [
  { time: 'Initial', name: 'MK2 SOLDIER Standard', shape: 'ibeam', E: 200, d: 225, b: 120, tf: 10, tw: 6 },
  { time: 'Preset', name: 'CUSTOM W-350x175', shape: 'ibeam', E: 200, d: 350, b: 175, tf: 14, tw: 9 }
];

let editingSectionId = null;
let selectedSectionCategory = 'all';

let currentSBComputed = {
  name: 'CUSTOM W-350x175',
  shape: 'ibeam',
  E: 200,
  d: 350,
  b: 175,
  tf: 14,
  tw: 9,
  A_mm2: 7798,
  Ix_mm4: 1.66e8,
  Sx_mm3: 9.5e5,
  yTop_mm: 175,
  yBot_mm: 175
};

function computeSectionBuilder() {
  const name = document.getElementById('sbName')?.value || 'CUSTOM SECTION';
  const shape = document.getElementById('sbShape')?.value || 'ibeam';
  const eDisp = parseFloat(document.getElementById('sbE')?.value) || (Units.isImp() ? 29000 : 200);
  const dDisp = parseFloat(document.getElementById('sbD')?.value) || (Units.isImp() ? 13.78 : 350);
  const bDisp = parseFloat(document.getElementById('sbB')?.value) || (Units.isImp() ? 6.89 : 175);
  const tfDisp = parseFloat(document.getElementById('sbTf')?.value) || (Units.isImp() ? 0.55 : 14);
  const twDisp = parseFloat(document.getElementById('sbTw')?.value) || (Units.isImp() ? 0.35 : 9);

  // Convert from display units to SI (GPa, mm)
  const E = +Units.toSIE(eDisp).toFixed(2);
  const d = Math.max(10, +Units.toSIDepth(dDisp).toFixed(2));
  const b = Math.max(10, +Units.toSIDepth(bDisp).toFixed(2));
  const tf = Math.max(1, Math.min(d / 2.01, +Units.toSIDepth(tfDisp).toFixed(2)));
  const tw = Math.max(1, Math.min(b / 2.01, +Units.toSIDepth(twDisp).toFixed(2)));

  let A = 0, Ix = 0, yTop = d / 2, yBot = d / 2;

  if (shape === 'ibeam' || shape === 'channel') {
    const hw = Math.max(1, d - 2 * tf);
    A = 2 * b * tf + hw * tw;
    Ix = (b * Math.pow(d, 3) - (b - tw) * Math.pow(hw, 3)) / 12;
  } else if (shape === 'rect') {
    A = b * d;
    Ix = (b * Math.pow(d, 3)) / 12;
  } else if (shape === 'box') {
    const bi = Math.max(1, b - 2 * tw);
    const hi = Math.max(1, d - 2 * tf);
    A = b * d - bi * hi;
    Ix = (b * Math.pow(d, 3) - bi * Math.pow(hi, 3)) / 12;
  } else if (shape === 'pipe') {
    const OD = d;
    const t = Math.min(tf, OD / 2.05);
    const ID = Math.max(1, OD - 2 * t);
    A = (Math.PI / 4) * (Math.pow(OD, 2) - Math.pow(ID, 2));
    Ix = (Math.PI / 64) * (Math.pow(OD, 4) - Math.pow(ID, 4));
    yTop = OD / 2;
    yBot = OD / 2;
  } else if (shape === 'tbeam') {
    const hw = Math.max(1, d - tf);
    const A1 = b * tf, y1 = d - tf / 2;
    const A2 = tw * hw, y2 = hw / 2;
    A = A1 + A2;
    yBot = (A1 * y1 + A2 * y2) / A;
    yTop = d - yBot;
    const I1 = (b * Math.pow(tf, 3)) / 12 + A1 * Math.pow(y1 - yBot, 2);
    const I2 = (tw * Math.pow(hw, 3)) / 12 + A2 * Math.pow(y2 - yBot, 2);
    Ix = I1 + I2;
  }

  const yMax = Math.max(yTop, yBot);
  const Sx = Ix / yMax;
  const EI = E * 1e3 * Ix; // N/mm² * mm⁴ = N·mm²

  currentSBComputed = { name, shape, E, d, b, tf, tw, A_mm2: A, Ix_mm4: Ix, Sx_mm3: Sx, yTop_mm: yTop, yBot_mm: yBot };

  if (Units.isImp()) {
    const A_in2 = A * 0.0015500031;
    const Ix_in4 = Ix * 2.40250961e-6;
    const Sx_in3 = Sx * 6.10237441e-5;
    const EI_kipin2 = (E * 145.0377377) * Ix_in4;
    document.getElementById('sbOutA').innerText = A_in2.toFixed(2);
    document.getElementById('sbOutIx').innerText = Ix_in4.toFixed(2);
    document.getElementById('sbOutSx').innerText = Sx_in3.toFixed(2);
    document.getElementById('sbOutYTop').innerText = Units.depth(yTop).toFixed(2);
    document.getElementById('sbOutYBot').innerText = Units.depth(yBot).toFixed(2);
    document.getElementById('sbOutEI').innerText = EI_kipin2.toExponential(3);
    if (document.getElementById('sbUnitA')) document.getElementById('sbUnitA').innerText = 'in²';
    if (document.getElementById('sbUnitIx')) document.getElementById('sbUnitIx').innerText = 'in⁴';
    if (document.getElementById('sbUnitSx')) document.getElementById('sbUnitSx').innerText = 'in³';
    if (document.getElementById('sbUnitEI')) document.getElementById('sbUnitEI').innerText = 'kip·in²';
  } else {
    document.getElementById('sbOutA').innerText = Math.round(A).toLocaleString();
    document.getElementById('sbOutIx').innerText = Ix.toExponential(3);
    document.getElementById('sbOutSx').innerText = Sx.toExponential(3);
    document.getElementById('sbOutYTop').innerText = yTop.toFixed(1);
    document.getElementById('sbOutYBot').innerText = yBot.toFixed(1);
    document.getElementById('sbOutEI').innerText = EI.toExponential(3);
    if (document.getElementById('sbUnitA')) document.getElementById('sbUnitA').innerText = 'mm²';
    if (document.getElementById('sbUnitIx')) document.getElementById('sbUnitIx').innerText = 'mm⁴';
    if (document.getElementById('sbUnitSx')) document.getElementById('sbUnitSx').innerText = 'mm³';
    if (document.getElementById('sbUnitEI')) document.getElementById('sbUnitEI').innerText = 'N·mm²';
  }

  drawSectionBuilderBlueprint();
  renderSectionCheckpoints();
  updateSectionBuilderActionUI();
}

function drawSectionBuilderBlueprint() {
  const c = document.getElementById('canvasSectionBuilder');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, W, H);

  // Blueprint Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, x); ctx.lineTo(W, x); ctx.stroke();
  }

  const { shape, d, b, tf, tw, yTop_mm } = currentSBComputed;
  const scale = Math.min(165 / Math.max(10, d), 165 / Math.max(10, b));
  const cx = W / 2, cy = H / 2;
  const sw = b * scale, sh = d * scale;
  const stf = tf * scale, stw = tw * scale;

  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;

  ctx.beginPath();
  if (shape === 'ibeam') {
    ctx.rect(cx - sw / 2, cy - sh / 2, sw, stf);
    ctx.rect(cx - stw / 2, cy - sh / 2 + stf, stw, sh - 2 * stf);
    ctx.rect(cx - sw / 2, cy + sh / 2 - stf, sw, stf);
  } else if (shape === 'rect') {
    ctx.rect(cx - sw / 2, cy - sh / 2, sw, sh);
  } else if (shape === 'box') {
    ctx.rect(cx - sw / 2, cy - sh / 2, sw, sh);
    ctx.rect(cx - sw / 2 + stw, cy - sh / 2 + stf, sw - 2 * stw, sh - 2 * stf);
  } else if (shape === 'pipe') {
    const rOuter = (d * scale) / 2;
    const rInner = Math.max(1, rOuter - tf * scale);
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2, false);
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2, true);
  } else if (shape === 'tbeam') {
    ctx.rect(cx - sw / 2, cy - sh / 2, sw, stf);
    ctx.rect(cx - stw / 2, cy - sh / 2 + stf, stw, sh - stf);
  } else if (shape === 'channel') {
    ctx.rect(cx - sw / 2, cy - sh / 2, sw, stf);
    ctx.rect(cx - sw / 2, cy - sh / 2 + stf, stw, sh - 2 * stf);
    ctx.rect(cx - sw / 2, cy + sh / 2 - stf, sw, stf);
  }
  ctx.fill('evenodd');
  ctx.stroke();

  // Neutral Axis Line
  const naY = cy - sh / 2 + yTop_mm * scale;
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(20, naY);
  ctx.lineTo(W - 20, naY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 10px JetBrains Mono';
  ctx.fillText('N.A.', W - 46, naY - 5);

  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText(`b = ${+Units.depth(b).toFixed(2)} ${Units.uDepth()}`, cx, cy - sh / 2 - 10);
  ctx.fillText(`h = ${+Units.depth(d).toFixed(2)} ${Units.uDepth()}`, cx, cy + sh / 2 + 16);
}

// 2. STANDARD CATALOG LOADER
function loadStandardCatalogSection(catKey) {
  const p = STANDARD_SECTIONS_CATALOG[catKey];
  if (!p) return;
  document.getElementById('sbName').value = p.name;
  document.getElementById('sbShape').value = p.shape;
  document.getElementById('sbE').value = +Units.E(p.E).toFixed(1);
  document.getElementById('sbD').value = +Units.depth(p.d).toFixed(2);
  document.getElementById('sbB').value = +Units.depth(p.b).toFixed(2);
  document.getElementById('sbTf').value = +Units.depth(p.tf).toFixed(2);
  document.getElementById('sbTw').value = +Units.depth(p.tw).toFixed(2);
  computeSectionBuilder();
  showNotification(
    currentLang === 'th' ? 'โหลดหน้าตัดมาตรฐาน' : 'Standard Profile Loaded',
    `${p.name} (${p.desc})`
  );
}

// 3. CREATE, EDIT, DELETE & SAVE WORKFLOWS
function createNewSection() {
  editingSectionId = null;
  document.getElementById('sbName').value = 'CUSTOM SECTION ' + (savedCloudSections.length + 1);
  document.getElementById('sbShape').value = 'ibeam';
  document.getElementById('sbE').value = 200;
  document.getElementById('sbD').value = 300;
  document.getElementById('sbB').value = 150;
  document.getElementById('sbTf').value = 10;
  document.getElementById('sbTw').value = 6.5;
  computeSectionBuilder();
  updateSectionBuilderActionUI();
  document.getElementById('sbName').focus();
}

function startEditSavedSection(id) {
  const s = savedCloudSections.find(x => x.id === id);
  if (!s) return;
  editingSectionId = id;
  document.getElementById('sbName').value = s.name;
  document.getElementById('sbShape').value = s.shape;
  document.getElementById('sbE').value = +Units.E(s.E).toFixed(1);
  document.getElementById('sbD').value = +Units.depth(s.d).toFixed(2);
  document.getElementById('sbB').value = +Units.depth(s.b).toFixed(2);
  document.getElementById('sbTf').value = +Units.depth(s.tf).toFixed(2);
  document.getElementById('sbTw').value = +Units.depth(s.tw).toFixed(2);
  computeSectionBuilder();
  updateSectionBuilderActionUI();

  // Smooth scroll up to section form
  const formBox = document.getElementById('sbName');
  if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showNotification(
    currentLang === 'th' ? 'โหมดแก้ไขหน้าตัด' : 'Editing Section',
    currentLang === 'th' ? `กำลังแก้ไข: ${s.name}` : `Modifying: ${s.name}`
  );
}

function cancelEditingSection() {
  editingSectionId = null;
  updateSectionBuilderActionUI();
  showNotification(
    currentLang === 'th' ? 'ยกเลิกการแก้ไข' : 'Edit Cancelled',
    currentLang === 'th' ? 'กลับสู่โหมดสร้างหน้าตัดใหม่' : 'Switched to Create mode'
  );
}

function saveCustomSectionToLibrary() {
  computeSectionBuilder();
  const s = currentSBComputed;
  const isTH = currentLang === 'th';

  if (editingSectionId) {
    // Update existing section
    const idx = savedCloudSections.findIndex(x => x.id === editingSectionId);
    if (idx !== -1) {
      savedCloudSections[idx].name = s.name;
      savedCloudSections[idx].shape = s.shape;
      savedCloudSections[idx].E = s.E;
      savedCloudSections[idx].d = s.d;
      savedCloudSections[idx].b = s.b;
      savedCloudSections[idx].tf = s.tf;
      savedCloudSections[idx].tw = s.tw;
      savedCloudSections[idx].A_cm2 = +(s.A_mm2 / 100).toFixed(2);
      savedCloudSections[idx].I_cm4 = +(s.Ix_mm4 / 10000).toFixed(1);
      savedCloudSections[idx].y_mm = +Math.max(s.yTop_mm, s.yBot_mm).toFixed(1);
      
      applySavedCloudSection(editingSectionId);
      showNotification(
        isTH ? 'บันทึกการแก้ไขสำเร็จ' : 'Section Updated',
        isTH ? `อัปเดตหน้าตัด "${s.name}" เรียบร้อย` : `Section "${s.name}" has been updated`
      );
    }
    editingSectionId = null;
  } else {
    // Create new section
    const newSec = {
      id: 'sec_' + Date.now(),
      name: s.name,
      shape: s.shape,
      category: s.shape === 'ibeam' ? 'ibeam' : s.shape === 'box' ? 'box' : s.shape === 'pipe' ? 'pipe' : s.shape === 'rect' || s.shape === 'tbeam' ? 'concrete_timber' : 'channel_angle',
      E: s.E,
      d: s.d,
      b: s.b,
      tf: s.tf,
      tw: s.tw,
      A_cm2: +(s.A_mm2 / 100).toFixed(2),
      I_cm4: +(s.Ix_mm4 / 10000).toFixed(1),
      y_mm: +Math.max(s.yTop_mm, s.yBot_mm).toFixed(1)
    };
    savedCloudSections.unshift(newSec);
    applySavedCloudSection(newSec.id);
    showNotification(
      isTH ? 'สร้างหน้าตัดใหม่สำเร็จ' : 'Section Created',
      isTH ? `เพิ่มหน้าตัด "${s.name}" ลงในคลังเรียบร้อย` : `Added "${s.name}" to Cloud Library`
    );
  }

  saveSectionCheckpoint();
  renderSavedSectionsLibrary();
  updateSectionBuilderActionUI();
}

function deleteSavedCloudSection(id) {
  const isTH = currentLang === 'th';
  if (savedCloudSections.length <= 1) {
    showNotification(
      isTH ? 'ไม่สามารถลบได้' : 'Cannot Delete',
      isTH ? 'ต้องมีหน้าตัดในคลังอย่างน้อย 1 รายการ' : 'At least 1 section must remain in library',
      'error'
    );
    return;
  }

  const s = savedCloudSections.find(x => x.id === id);
  const name = s ? s.name : '';
  const confirmMsg = isTH ? `ต้องการลบหน้าตัด "${name}" ออกจากคลังใช่หรือไม่?` : `Delete section "${name}" from library?`;
  if (!confirm(confirmMsg)) return;

  if (editingSectionId === id) {
    editingSectionId = null;
    updateSectionBuilderActionUI();
  }

  savedCloudSections = savedCloudSections.filter(x => x.id !== id);
  renderSavedSectionsLibrary();
  showNotification(
    isTH ? 'ลบหน้าตัดเรียบร้อย' : 'Section Deleted',
    isTH ? `ลบ "${name}" ออกจากคลังแล้ว` : `Removed "${name}" from library`
  );
}

function filterSectionCategory(cat) {
  selectedSectionCategory = cat;
  renderSavedSectionsLibrary();
}

function updateSectionBuilderActionUI() {
  const container = document.getElementById('sbActionButtonsContainer');
  const banner = document.getElementById('sbModeBanner');
  const isTH = currentLang === 'th';

  if (banner) {
    if (editingSectionId) {
      const s = savedCloudSections.find(x => x.id === editingSectionId);
      banner.className = 'flex items-center justify-between p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold transition';
      banner.innerHTML = `
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-pen-to-square text-amber-500"></i>
          <span>${isTH ? 'กำลังแก้ไขหน้าตัด:' : 'Editing Section:'} <span class="underline">${s ? s.name : ''}</span></span>
        </div>
        <button onclick="cancelEditingSection()" class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-[11px] font-semibold transition border border-slate-200 dark:border-slate-700">
          ${isTH ? 'ยกเลิก' : 'Cancel'}
        </button>
      `;
    } else {
      banner.className = 'flex items-center justify-between p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold transition';
      banner.innerHTML = `
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-plus-circle text-sky-500"></i>
          <span>${isTH ? 'โหมดสร้างหน้าตัดใหม่ (พร้อมบันทึกเข้าคลัง)' : 'Create New Section Mode'}</span>
        </div>
        <button onclick="createNewSection()" class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 text-[11px] font-bold transition border border-sky-200 dark:border-sky-800">
          + ${isTH ? 'ล้างฟอร์ม' : 'Clear Form'}
        </button>
      `;
    }
  }

  if (container) {
    if (editingSectionId) {
      container.innerHTML = `
        <div class="flex space-x-2 w-full">
          <button onclick="saveCustomSectionToLibrary()" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md">
            <i class="fa-solid fa-check"></i>
            <span>${isTH ? 'บันทึกการแก้ไขหน้าตัด (Update Section)' : 'Update Section'}</span>
          </button>
          <button onclick="cancelEditingSection()" class="px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition">
            ${isTH ? 'ยกเลิก' : 'Cancel'}
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="flex space-x-2 w-full">
          <button onclick="saveCustomSectionToLibrary()" class="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <span>${isTH ? 'บันทึกเข้าคลัง & นำไปใช้กับ 1D/2D' : 'Save to Library & Apply'}</span>
          </button>
          <button onclick="createNewSection()" class="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition border border-slate-200 dark:border-slate-700 flex items-center space-x-1" title="${isTH ? 'สร้างหน้าตัดใหม่' : 'New Section'}">
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span class="hidden sm:inline">${isTH ? 'สร้างใหม่' : 'New'}</span>
          </button>
        </div>
      `;
    }
  }
}

function saveSectionCheckpoint() {
  const s = currentSBComputed;
  sectionCheckpoints.unshift({
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    name: s.name,
    shape: s.shape,
    E: s.E,
    d: s.d,
    b: s.b,
    tf: s.tf,
    tw: s.tw
  });
  renderSectionCheckpoints();
}

function restoreSectionCheckpoint(idx) {
  const cp = sectionCheckpoints[idx];
  if (!cp) return;
  document.getElementById('sbName').value = cp.name;
  document.getElementById('sbShape').value = cp.shape;
  document.getElementById('sbE').value = +Units.E(cp.E).toFixed(1);
  document.getElementById('sbD').value = +Units.depth(cp.d).toFixed(2);
  document.getElementById('sbB').value = +Units.depth(cp.b).toFixed(2);
  document.getElementById('sbTf').value = +Units.depth(cp.tf).toFixed(2);
  document.getElementById('sbTw').value = +Units.depth(cp.tw).toFixed(2);
  computeSectionBuilder();
}

function renderSectionCheckpoints() {
  const el = document.getElementById('sectionCheckpointsList');
  if (!el) return;
  el.innerHTML = sectionCheckpoints.map((cp, idx) => `
    <div onclick="restoreSectionCheckpoint(${idx})" class="cursor-pointer p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-amber-500 flex items-center justify-between transition">
      <span><i class="fa-solid fa-clock-rotate-left text-amber-500 mr-1.5"></i><strong>${cp.name}</strong> (${+Units.depth(cp.d).toFixed(1)}×${+Units.depth(cp.b).toFixed(1)}${Units.uDepth()})</span>
      <span class="font-mono text-[10px] text-slate-400">${cp.time}</span>
    </div>
  `).join('');
}

function renderSavedSectionsLibrary() {
  const container = document.getElementById('savedSectionsList');
  if (!container) return;
  const isTH = currentLang === 'th';

  // Filter sections by category
  let list = savedCloudSections;
  if (selectedSectionCategory && selectedSectionCategory !== 'all') {
    list = savedCloudSections.filter(s => {
      if (selectedSectionCategory === 'ibeam') return s.shape === 'ibeam';
      if (selectedSectionCategory === 'box') return s.shape === 'box';
      if (selectedSectionCategory === 'channel_angle') return s.shape === 'channel';
      if (selectedSectionCategory === 'pipe') return s.shape === 'pipe';
      if (selectedSectionCategory === 'concrete_timber') return s.shape === 'rect' || s.shape === 'tbeam';
      return true;
    });
  }

  // Update Category Filter Buttons Active state
  const filterButtons = document.querySelectorAll('.sec-cat-filter-btn');
  filterButtons.forEach(btn => {
    const cat = btn.getAttribute('data-cat');
    if (cat === selectedSectionCategory) {
      btn.className = 'sec-cat-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs transition';
    } else {
      btn.className = 'sec-cat-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition';
    }
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 text-center py-8 text-slate-400 text-xs">
        <i class="fa-solid fa-inbox text-2xl mb-1 text-slate-300"></i>
        <p>${isTH ? 'ไม่พบหน้าตัดในหมวดหมู่นี้' : 'No sections found in this category'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(s => {
    const isEditing = editingSectionId === s.id;
    const cardBorder = isEditing
      ? 'border-2 border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 shadow-md'
      : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-sky-400 transition';

    let badgeColor = 'bg-sky-500/15 text-sky-500';
    if (s.shape === 'box') badgeColor = 'bg-teal-500/15 text-teal-500';
    else if (s.shape === 'rect' || s.shape === 'tbeam') badgeColor = 'bg-emerald-500/15 text-emerald-500';
    else if (s.shape === 'pipe') badgeColor = 'bg-purple-500/15 text-purple-500';
    else if (s.shape === 'channel') badgeColor = 'bg-amber-500/15 text-amber-500';

    return `
      <div class="p-3 rounded-xl ${cardBorder} flex flex-col justify-between space-y-2">
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800 dark:text-white truncate ${isEditing ? 'text-amber-600 dark:text-amber-300 font-extrabold' : ''}">
              ${s.name} ${isEditing ? '<span class="text-[10px] text-amber-500 ml-1">(' + (isTH ? 'กำลังแก้ไข' : 'Editing') + ')</span>' : ''}
            </span>
            <span class="text-[10px] uppercase px-2 py-0.5 rounded ${badgeColor} font-mono font-bold">${s.shape}</span>
          </div>
          <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            E=${+Units.E(s.E).toFixed(1)}${Units.uE()} • I=${+Units.I(s.I_cm4).toFixed(2)}${Units.uI()} • A=${+Units.A(s.A_cm2).toFixed(2)}${Units.uA()}
          </div>
        </div>
        <div class="flex items-center space-x-1.5 pt-1">
          <button onclick="applySavedCloudSection('${s.id}')" class="flex-1 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] transition flex items-center justify-center space-x-1">
            <i class="fa-solid fa-play text-[9px]"></i>
            <span>${isTH ? 'ใช้กับ 1D & 2D' : 'Apply 1D & 2D'}</span>
          </button>
          <button onclick="startEditSavedSection('${s.id}')" class="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-white text-[11px] font-semibold transition" title="${isTH ? 'แก้ไขหน้าตัดนี้' : 'Edit Section'}">
            <i class="fa-solid fa-pen text-[10px]"></i>
            <span class="ml-1">${isTH ? 'แก้ไข' : 'Edit'}</span>
          </button>
          <button onclick="deleteSavedCloudSection('${s.id}')" class="p-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-slate-400 text-[11px] transition" title="${isTH ? 'ลบหน้าตัดนี้' : 'Delete Section'}">
            <i class="fa-solid fa-trash-can text-[11px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function editSavedCloudSection(id) {
  startEditSavedSection(id);
}

function applySavedCloudSection(id) {
  const s = savedCloudSections.find(x => x.id === id);
  if (!s) return;
  model.ignoreSection = false;
  model.sectionName = s.name;
  model.E = s.E;
  model.I = s.I_cm4;
  model.A = s.A_cm2;
  model.depth = s.d;
  model.y = s.y_mm;
  model.shape = s.shape === 'ibeam' ? 'steel_w' : s.shape === 'box' ? 'steel_tube' : s.shape === 'pipe' ? 'steel_tube' : 'rc_rect';

  // Also update 2D frame section stiffness
  frame2D.E = s.E * 1e6;
  frame2D.A_frame = s.A_cm2 * 1e-4;
  frame2D.I_frame = s.I_cm4 * 1e-8;

  const lblSec = document.getElementById('lblActiveSectionName');
  if (lblSec) lblSec.innerText = s.name;
  if (typeof syncSectionModeUI === 'function') syncSectionModeUI();
  syncInputFields();
  solveAndRender();
  solve2DFrame();
  showNotification(
    currentLang === 'th' ? 'อัปเดตหน้าตัดสำเร็จ' : 'Section Applied',
    currentLang === 'th' ? `นำหน้าตัด "${s.name}" ไปใช้ในคาน 1D และโครงข้อแข็ง 2D แล้ว` : `Section "${s.name}" active in 1D & 2D solvers`
  );
}

/*************************************************************************
 * PART 5: CALCULATION REPORT & CLEAN PDF EXPORT ENGINE
 * Exact 1:1 Replica of OptimalBeam PDF Sheet 1, Sheet 2, Sheet 3 + 2D
 *************************************************************************/
function setReportSource(src) {
  if (!['1d', '2d', 'truss'].includes(src)) src = '1d';
  reportSourceMode = src;
  document.body.setAttribute('data-print-source', src);

  const b1d = document.getElementById('btnRepSrc1D');
  const b2d = document.getElementById('btnRepSrc2D');
  const bTruss = document.getElementById('btnRepSrcTruss');
  const c1d = document.getElementById('report1DContainer');
  const c2d = document.getElementById('report2DContainer');
  const cTruss = document.getElementById('reportTrussContainer');

  const activeCls = 'px-3 py-1.5 rounded bg-teal-600 text-white transition';
  const inactiveCls = 'px-3 py-1.5 rounded text-slate-600 dark:text-slate-300 transition';

  if (b1d) b1d.className = src === '1d' ? activeCls : inactiveCls;
  if (b2d) b2d.className = src === '2d' ? activeCls : inactiveCls;
  if (bTruss) bTruss.className = src === 'truss' ? activeCls : inactiveCls;

  if (c1d) {
    if (src === '1d') {
      c1d.classList.remove('hidden');
      c1d.style.display = '';
    } else {
      c1d.classList.add('hidden');
      c1d.style.display = 'none';
    }
  }
  if (c2d) {
    if (src === '2d') {
      c2d.classList.remove('hidden');
      c2d.style.display = '';
    } else {
      c2d.classList.add('hidden');
      c2d.style.display = 'none';
    }
  }
  if (cTruss) {
    if (src === 'truss') {
      cTruss.classList.remove('hidden');
      cTruss.style.display = '';
    } else {
      cTruss.classList.add('hidden');
      cTruss.style.display = 'none';
    }
  }

  const isTH = (typeof currentLang === 'undefined' || currentLang === 'th');
  const lblPrint = document.getElementById('lblPrintActiveReport');
  const badge = document.getElementById('repActiveModeBadge');

  const labelMap = {
    '1d': isTH ? 'พิมพ์เฉพาะ: รายงานคำนวณคาน 1D (แผ่นที่ 1–3)' : 'Print Only: 1D Beam Report (Sheets 1–3)',
    '2d': isTH ? 'พิมพ์เฉพาะ: รายงานวิเคราะห์โครงสร้าง 2D' : 'Print Only: 2D Structural Report',
    'truss': isTH ? 'พิมพ์เฉพาะ: รายงานโครงหลังคาเหล็ก 2D & 3D (แผ่นที่ 1–2)' : 'Print Only: 2D & 3D Roof Truss Report (Sheets 1–2)'
  };
  const badgeMap = {
    '1d': isTH ? 'กำลังแสดงและเตรียมพิมพ์เฉพาะ: รายงานคำนวณคาน 1D (แผ่นที่ 1–3)' : 'Active & Ready to Print Only: 1D Beam Report (Sheets 1–3)',
    '2d': isTH ? 'กำลังแสดงและเตรียมพิมพ์เฉพาะ: รายงานวิเคราะห์โครงสร้าง 2D' : 'Active & Ready to Print Only: 2D Structural Analysis Report',
    'truss': isTH ? 'กำลังแสดงและเตรียมพิมพ์เฉพาะ: รายงานโครงหลังคาเหล็ก 2D & 3D (แผ่นที่ 1–2)' : 'Active & Ready to Print Only: 2D & 3D Roof Truss Report (Sheets 1–2)'
  };

  if (lblPrint) lblPrint.innerText = labelMap[src] || labelMap['1d'];
  if (badge) badge.innerText = badgeMap[src] || badgeMap['1d'];

  refreshCalculationReport();
}

function exportReportByType(src) {
  const targetSrc = ['1d', '2d', 'truss'].includes(src) ? src : (reportSourceMode || '1d');
  if (typeof switchWorkspace === 'function' && (typeof currentWorkspace === 'undefined' || currentWorkspace !== 'report')) {
    switchWorkspace('report');
  }
  setReportSource(targetSrc);
  setTimeout(() => {
    window.print();
  }, 180);
}

function handleCustomLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    customLogoDataUrl = e.target.result;
    refreshCalculationReport();
    showNotification('อัปโหลดโลโก้บริษัทเรียบร้อย', 'โลโก้ของคุณถูกนำไปแสดงบนหัวกระดาษรายงาน PDF ทุกแผ่นแล้ว');
  };
  reader.readAsDataURL(file);
}

function drawReportBeamSchematic(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const padL = 85, padR = 85;
  const plotW = W - padL - padR;
  const beamY = Math.round(H * 0.64);
  const L = model.length;
  const xToPx = x => padL + (x / L) * plotW;

  // Grey Horizontal Beam Bar (Exact style of OptimalBeam PDF)
  ctx.fillStyle = '#7b7b7b';
  ctx.fillRect(padL, beamY - 6, plotW, 12);

  // Red Triangular Supports
  model.supports.forEach(s => {
    const px = xToPx(s.x);
    ctx.fillStyle = '#ff0000';
    if (s.type === 'fixed') {
      ctx.fillRect(px - 4, beamY - 22, 8, 44);
    } else {
      ctx.beginPath();
      ctx.moveTo(px, beamY + 6);
      ctx.lineTo(px - 10, beamY + 25);
      ctx.lineTo(px + 10, beamY + 25);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Black Vertical Point Load Arrows & UDL
  const maxP = Math.max(10, ...model.loads.filter(l => l.type === 'point').map(l => Math.abs(l.P)));
  model.loads.forEach(l => {
    if (l.type === 'point') {
      const px = xToPx(l.x);
      const isUp = l.P < 0;
      const mag = Math.abs(l.P);
      const arrowH = 24 + (mag / maxP) * 38;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#000000';
      ctx.lineWidth = 2.4;

      if (isUp) {
        const yBot = beamY + 8 + arrowH;
        const yTop = beamY + 8;
        ctx.beginPath();
        ctx.moveTo(px, yBot);
        ctx.lineTo(px, yTop);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, yTop - 1);
        ctx.lineTo(px - 5.5, yTop + 6);
        ctx.lineTo(px + 5.5, yTop + 6);
        ctx.closePath();
        ctx.fill();
      } else {
        const yTop = beamY - 8 - arrowH;
        const yBot = beamY - 8;
        ctx.beginPath();
        ctx.moveTo(px, yTop);
        ctx.lineTo(px, yBot);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, yBot + 1);
        ctx.lineTo(px - 5.5, yBot - 6);
        ctx.lineTo(px + 5.5, yBot - 6);
        ctx.closePath();
        ctx.fill();
      }
    } else if (l.type === 'udl') {
      const px1 = xToPx(l.x1), px2 = xToPx(l.x2);
      const mag1 = Math.abs(l.w1);
      const mag2 = Math.abs(l.w2);
      const maxW = Math.max(mag1, mag2, 1);
      const maxH = 28;
      const h1 = (mag1 / maxW) * maxH;
      const h2 = (mag2 / maxW) * maxH;

      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(px1, beamY - 8);
      ctx.lineTo(px1, beamY - 8 - h1);
      ctx.lineTo(px2, beamY - 8 - h2);
      ctx.lineTo(px2, beamY - 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Subtle arrows
      const numArrows = Math.max(2, Math.min(8, Math.round((px2 - px1) / 32)));
      for (let k = 0; k <= numArrows; k++) {
        const t = k / numArrows;
        const ax = px1 + t * (px2 - px1);
        const ah = h1 + t * (h2 - h1);
        if (ah > 5) {
          ctx.beginPath();
          ctx.moveTo(ax, beamY - 8 - ah);
          ctx.lineTo(ax, beamY - 8);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(ax, beamY - 8);
          ctx.lineTo(ax - 3, beamY - 14);
          ctx.lineTo(ax + 3, beamY - 14);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  });
}

function drawReportDiagram(canvasId, key, yAxisLabel, extPos, extNeg, sciFormat = false, convFn = v => v) {
  const c = document.getElementById(canvasId);
  if (!c || !solution.isValid) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const padL = 85, padR = 55, padT = 10, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const L = model.length;

  const vals = solution.samples.map(s => s[key]);
  const maxVal = Math.max(0, ...vals);
  const minVal = Math.min(0, ...vals);
  const spanV = Math.max(1e-6, maxVal - minVal);

  // Proportional top/bottom scaling matching Sheet 2 of 3
  const xToPx = x => padL + (x / L) * plotW;
  const yToPx = v => padT + ((maxVal - v) / spanV) * plotH;
  const zeroY = yToPx(0);

  // Vertical & Horizontal faint grid lines
  ctx.strokeStyle = '#efefef';
  ctx.lineWidth = 1;
  for (let x = 0; x <= L + 0.001; x += 0.5) {
    const px = xToPx(x);
    ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, padT + plotH); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL + plotW, padT); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();

  // Lavender Shaded Area under curve (#e1e5fa)
  ctx.beginPath();
  ctx.moveTo(xToPx(0), zeroY);
  solution.samples.forEach(s => ctx.lineTo(xToPx(s.x), yToPx(s[key])));
  ctx.lineTo(xToPx(L), zeroY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(218, 224, 252, 0.72)';
  ctx.fill();

  // Red Zero Baseline
  ctx.strokeStyle = '#f06277';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, zeroY);
  ctx.lineTo(padL + plotW, zeroY);
  ctx.stroke();

  // Blue Curve Outline (#7c98d6)
  ctx.beginPath();
  solution.samples.forEach((s, idx) => {
    if (idx === 0) ctx.moveTo(xToPx(s.x), yToPx(s[key]));
    else ctx.lineTo(xToPx(s.x), yToPx(s[key]));
  });
  ctx.strokeStyle = '#7c98d6';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Left & Bottom Black Axes
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // X-Axis Ticks
  ctx.fillStyle = '#222222';
  ctx.font = '9.5px serif';
  ctx.textAlign = 'center';
  for (let x = 0; x <= L + 0.001; x += 0.5) {
    const px = xToPx(x);
    ctx.fillText(Units.len(x).toFixed(1), px, padT + plotH + 13);
  }
  ctx.textAlign = 'left';
  ctx.fillText(`Location (${Units.uLen()})`, padL + 3, padT + plotH - 4);

  // Y-Axis Rotated Label & Max/Min Numbers
  ctx.save();
  ctx.translate(padL + 11, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = '9.5px serif';
  ctx.fillText(yAxisLabel, 0, 0);
  ctx.restore();

  const fmtY = v => {
    const dv = convFn(v);
    if (!sciFormat) return dv.toFixed(2);
    if (Math.abs(dv) < 1e-6) return '0.00';
    const exp = Math.floor(Math.log10(Math.abs(dv)));
    const mant = dv / Math.pow(10, exp);
    return `${mant.toFixed(2)}e${exp >= 0 ? '+' : ''}${exp}`;
  };

  ctx.textAlign = 'right';
  ctx.font = '9.5px serif';
  ctx.fillText(fmtY(maxVal), padL - 5, padT + 8);
  ctx.fillText(fmtY(minVal), padL - 5, padT + plotH);

  // Red Extrema Dots on Curve
  ctx.fillStyle = '#ff0000';
  if (key === 'V') {
    const corners = [];
    if (extPos && isFinite(extPos.val)) corners.push(extPos);
    if (extNeg && isFinite(extNeg.val)) {
      corners.push(extNeg);
      const endPlateau = solution.samples.filter(s => Math.abs(s.V - extNeg.val) < 1e-3);
      if (endPlateau.length > 1) {
        const lastPt = endPlateau[endPlateau.length - 1];
        if (Math.abs(lastPt.x - extNeg.x) > 0.05) {
          corners.push({ val: lastPt.V, x: lastPt.x });
        }
      }
    }
    corners.forEach(pt => {
      ctx.beginPath();
      ctx.arc(xToPx(pt.x), yToPx(pt.val), 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    [extPos, extNeg].forEach(pt => {
      if (pt && isFinite(pt.val) && Math.abs(pt.val) > 1e-6) {
        ctx.beginPath();
        ctx.arc(xToPx(pt.x), yToPx(pt.val), 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

function refreshCalculationReport() {
  const isTH = (typeof currentLang === 'undefined' || currentLang === 'th');
  const modelName = document.getElementById('repModelNameInput')?.value || model.name;
  const designer = document.getElementById('repDesignerInput')?.value || 'นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)';
  const repDate = document.getElementById('repDateInput')?.value || '2019/9/15';
  const brandText = document.getElementById('repBrandTextInput')?.value || 'STRUCTURAL CALCULATOR';
  const unitStr = unitSystem === 'metric'
    ? (isTH ? 'เมตริก (Metric) - (m), (kN)' : 'Metric - (m), (kN)')
    : (isTH ? 'อิมพีเรียล (Imperial) - (ft), (kip)' : 'Imperial - (ft), (kip)');

  document.querySelectorAll('.rep-model-name').forEach(el => el.innerText = modelName);
  document.querySelectorAll('.rep-designer').forEach(el => el.innerText = designer);
  document.querySelectorAll('.rep-date').forEach(el => el.innerText = repDate);
  document.querySelectorAll('.rep-units').forEach(el => el.innerText = unitStr);

  // Update Logo Header across all sheets
  ['sheet1LogoBox', 'sheet2LogoBox', 'sheet3LogoBox', 'sheet2DLogoBox', 'sheetTruss1LogoBox', 'sheetTruss2LogoBox'].forEach(boxId => {
    const box = document.getElementById(boxId);
    if (!box) return;
    if (customLogoDataUrl) {
      box.innerHTML = `<img src="${customLogoDataUrl}" class="h-9 object-contain" alt="Company Logo"><span class="text-base font-bold tracking-wider text-slate-700 ml-2">${brandText}</span>`;
    } else {
      box.innerHTML = `
        <div class="w-9 h-7 rounded-md bg-slate-600 border-b-4 border-teal-400 flex items-center justify-center text-white">
          <i class="fa-solid fa-cubes-stacked text-sm"></i>
        </div>
        <span class="text-lg font-bold tracking-wider text-teal-600">${brandText}</span>
      `;
    }
  });

  // 1D Report Population
  drawReportBeamSchematic('repSchematicCanvas1');
  drawReportBeamSchematic('repSchematicCanvas2');

  const E_MPa = Math.round(model.E * 1000);
  const I_mm4 = Math.round(model.I * 10000);
  const A_mm2 = Math.round(model.A * 100);
  const EI_Nmm2 = Math.round(E_MPa * I_mm4);

  const isImp = Units.isImp();
  const EI_disp = model.ignoreSection
    ? (isTH ? 'คงที่ (ไม่คิดหน้าตัด / โหมดโจทย์การบ้าน)' : 'Constant EI (No Cross-Section Mode)')
    : (isImp ? `${(Units.E(model.E) * Units.I(model.I)).toFixed(1)} kip·in²` : `${EI_Nmm2}`);

  const supTypeTH = { pinned: 'จุดรองรับยึดหมุน (Pinned)', roller: 'จุดรองรับเลื่อนได้ (Roller)', fixed: 'จุดรองรับยึดแน่น (Fixed)' };
  const rows = [];
  rows.push(`<tr><td>EI = ${EI_disp}</td><td></td><td></td></tr>`);
  rows.push(`<tr><td>${isTH ? 'ความยาวคาน (Length)' : 'Length'}</td><td>0 | ${+Units.len(model.length).toFixed(3)}</td><td></td></tr>`);
  model.supports.forEach(s => {
    rows.push(`<tr><td>${isTH ? (supTypeTH[s.type] || `Support-${s.type}`) : `Support-${s.type}`}</td><td>${+Units.len(s.x).toFixed(3)}</td><td></td></tr>`);
  });
  model.loads.forEach(l => {
    if (l.type === 'point') {
      rows.push(`<tr><td>${isTH ? 'แรงกระทำแบบจุด (Point Load)' : 'Point Load'}</td><td>${+Units.len(l.x).toFixed(3)}</td><td>${+Units.force(l.P).toFixed(3)}</td></tr>`);
    } else if (l.type === 'udl') {
      const magStr = (l.w2 !== undefined && Math.abs(l.w2 - l.w1) > 1e-4)
        ? `${+Units.dist(l.w1).toFixed(3)} → ${+Units.dist(l.w2).toFixed(3)}`
        : `${+Units.dist(l.w1).toFixed(3)}`;
      rows.push(`<tr><td>${isTH ? 'แรงแผ่กระจาย (Distributed Load)' : 'Distributed Load'}</td><td>${+Units.len(l.x1).toFixed(3)} | ${+Units.len(l.x2).toFixed(3)}</td><td>${magStr}</td></tr>`);
    } else if (l.type === 'moment') {
      rows.push(`<tr><td>${isTH ? 'โมเมนต์ดัดกระทำ (Moment Load)' : 'Moment Load'}</td><td>${+Units.len(l.x).toFixed(3)}</td><td>${+Units.mom(l.M).toFixed(3)}</td></tr>`);
    }
  });
  const tbody = document.getElementById('repInputTableBody');
  if (tbody) tbody.innerHTML = rows.join('');

  // Section Properties Text Block (Matching Sheet 1 of 3)
  const secPropsEl = document.getElementById('repSectionPropsText');
  if (secPropsEl) {
    if (model.ignoreSection) {
      secPropsEl.innerHTML = isTH ? `
        <div>โหมดการวิเคราะห์: <strong>ไม่คิดหน้าตัด (Constant EI = 1 — โหมดโจทย์การบ้านทั่วไป)</strong></div>
        <div>หมายเหตุ: ไม่นำค่า E, I, A, h, y มาหาร — แสดงความชันสัมพัทธ์ EIθ (${Units.uEITheta()}) และการแอ่นตัวสัมพัทธ์ EIδ (${Units.uEIDelta()})</div>
      ` : `
        <div>Analysis Mode: <strong>No Cross-Section (Constant EI = 1 — Textbook Homework Mode)</strong></div>
        <div>Note: Section properties (E, I, A, h, y) are bypassed — outputs relative slope EIθ (${Units.uEITheta()}) and relative deflection EIδ (${Units.uEIDelta()})</div>
      `;
    } else if (isImp) {
      secPropsEl.innerHTML = isTH ? `
        <div>ชื่อหน้าตัด: ${model.sectionName}, &nbsp; มอดุลัสยืดหยุ่น (E): ${Units.E(model.E).toFixed(1)} (ksi)</div>
        <div>ระยะขอบบน: ${Units.depth(model.y).toFixed(2)} (in), &nbsp; ระยะขอบล่าง: ${Units.depth(model.y).toFixed(2)} (in)</div>
        <div>โมเมนต์ความเฉื่อย (I): ${Units.I(model.I).toFixed(2)} (in^4), &nbsp; พื้นที่หน้าตัด (A): ${Units.A(model.A).toFixed(2)} (in^2)</div>
      ` : `
        <div>Section Name: ${model.sectionName}, &nbsp; Modulus of Elasticity: ${Units.E(model.E).toFixed(1)} (ksi)</div>
        <div>Top Height: ${Units.depth(model.y).toFixed(2)} (in), &nbsp; Bottom Height: ${Units.depth(model.y).toFixed(2)} (in)</div>
        <div>Moment of Inertia: ${Units.I(model.I).toFixed(2)} (in^4), &nbsp; Area: ${Units.A(model.A).toFixed(2)} (in^2)</div>
      `;
    } else {
      secPropsEl.innerHTML = isTH ? `
        <div>ชื่อหน้าตัด: ${model.sectionName}, &nbsp; มอดุลัสยืดหยุ่น (E): ${E_MPa} (MPa)</div>
        <div>ระยะขอบบน: ${model.y} (mm), &nbsp; ระยะขอบล่าง: ${model.y} (mm)</div>
        <div>โมเมนต์ความเฉื่อย (I): ${I_mm4} (mm^4), &nbsp; พื้นที่หน้าตัด (A): ${A_mm2} (mm^2)</div>
      ` : `
        <div>Section Name: ${model.sectionName}, &nbsp; Modulus of Elasticity: ${E_MPa} (MPa)</div>
        <div>Top Height: ${model.y} (mm), &nbsp; Bottom Height: ${model.y} (mm)</div>
        <div>Moment of Inertia: ${I_mm4} (mm^4), &nbsp; Area: ${A_mm2} (mm^2)</div>
      `;
    }
  }

  // Reactions Text Block (Matching Sheet 1 of 3)
  const reacEl = document.getElementById('repReactionsText');
  if (reacEl) {
    reacEl.innerHTML = solution.reactions.map(r =>
      isTH
        ? `<div>ตำแหน่งที่: ${+Units.len(r.x).toFixed(3)} (${Units.uLen()}), แรงปฏิกิริยา (Force Reaction) = ${Units.force(r.ReportRy).toFixed(4)} (${Units.uForce()})</div>`
        : `<div>Location: ${+Units.len(r.x).toFixed(3)} (${Units.uLen()}), Force Reaction = ${Units.force(r.ReportRy).toFixed(4)} (${Units.uForce()})</div>`
    ).join('');
  }

  // Sheet 2 of 3 Diagrams & Captions
  const uF = Units.uForce();
  const uM = Units.uMomDash();
  const uD = Units.uDefl();
  const uS = Units.uStress();
  const uL = Units.uLen();
  const uEITheta = Units.uEITheta();
  const uEIDelta = Units.uEIDelta();

  drawReportDiagram('repPlotShear', 'V', `Shear (${uF})`, solution.maxPosV, solution.minNegV, false, Units.force);
  drawReportDiagram('repPlotMoment', 'M', `Moment (${uM})`, solution.maxPosM, solution.minNegM, false, Units.mom);
  if (model.ignoreSection) {
    drawReportDiagram('repPlotSlope', 'slope', `EIθ (${uEITheta})`, solution.maxPosSlope, solution.minNegSlope, true, Units.eiTheta);
    drawReportDiagram('repPlotDefl', 'defl', `EIδ (${uEIDelta})`, solution.maxPosDelta, solution.minNegDelta, true, Units.eiDelta);
    drawReportDiagram('repPlotStress', 'sigma', `Stress (N/A)`, { val: 0, x: 0 }, { val: 0, x: 0 }, false, v => v);
  } else {
    drawReportDiagram('repPlotSlope', 'slope', 'Slope (Deg)', solution.maxPosSlope, solution.minNegSlope, true, v => v);
    drawReportDiagram('repPlotDefl', 'defl', `Deflection (${uD})`, solution.maxPosDelta, solution.minNegDelta, true, Units.defl);
    drawReportDiagram('repPlotStress', 'sigma', `Stress (${uS})`, solution.maxSigma, { val: 0, x: 0 }, false, Units.stress);
  }

  // Find plateau range for minNegV if applicable
  let negVLocStr = Units.len(solution.minNegV.x).toFixed(3);
  const plateauPts = solution.samples.filter(s => Math.abs(s.V - solution.minNegV.val) < 1e-3);
  if (plateauPts.length > 1) {
    const firstX = plateauPts[0].x;
    const lastX = plateauPts[plateauPts.length - 1].x;
    if (Math.abs(lastX - firstX) > 0.05) {
      negVLocStr = `${Units.len(firstX).toFixed(3)}, ${Units.len(lastX).toFixed(3)}`;
    }
  }

  document.getElementById('repCapShear').innerHTML = isTH ? `
    <div>แรงเฉือนบวกสูงสุด (+V) (${uF}): ${Units.force(solution.maxPosV.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosV.x).toFixed(3)}</div>
    <div>แรงเฉือนลบสูงสุด (-V) (${uF}): ${Units.force(solution.minNegV.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${negVLocStr}</div>
  ` : `
    <div>(Max +ve)Shear Load (${uF}): ${Units.force(solution.maxPosV.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosV.x).toFixed(3)}</div>
    <div>(Max -ve)Shear Load (${uF}): ${Units.force(solution.minNegV.val).toFixed(3)}, Location (${uL}): ${negVLocStr}</div>
  `;
  document.getElementById('repCapMoment').innerHTML = isTH ? `
    <div>โมเมนต์ดัดบวกสูงสุด (+M) (${uM}): ${Units.mom(solution.maxPosM.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosM.x).toFixed(3)}</div>
    <div>โมเมนต์ดัดลบสูงสุด (-M) (${uM}): ${Units.mom(solution.minNegM.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.minNegM.x).toFixed(3)}</div>
  ` : `
    <div>(Max +ve)Moment Load (${uM}): ${Units.mom(solution.maxPosM.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosM.x).toFixed(3)}</div>
    <div>(Max -ve)Moment Load (${uM}): ${Units.mom(solution.minNegM.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.minNegM.x).toFixed(3)}</div>
  `;

  if (model.ignoreSection) {
    document.getElementById('repCapSlope').innerHTML = isTH ? `
      <div>ความชันสัมพัทธ์บวกสูงสุด (+EIθ) (${uEITheta}): ${Units.eiTheta(solution.maxPosSlope.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosSlope.x).toFixed(3)}</div>
      <div>ความชันสัมพัทธ์ลบสูงสุด (-EIθ) (${uEITheta}): ${Units.eiTheta(solution.minNegSlope.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.minNegSlope.x).toFixed(3)}</div>
    ` : `
      <div>(Max +ve)Relative Slope EIθ (${uEITheta}): ${Units.eiTheta(solution.maxPosSlope.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosSlope.x).toFixed(3)}</div>
      <div>(Max -ve)Relative Slope EIθ (${uEITheta}): ${Units.eiTheta(solution.minNegSlope.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.minNegSlope.x).toFixed(3)}</div>
    `;
    document.getElementById('repCapDefl').innerHTML = isTH ? `
      <div>การแอ่นตัวสัมพัทธ์บวกสูงสุด (+EIδ) (${uEIDelta}): ${Units.eiDelta(solution.maxPosDelta.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosDelta.x).toFixed(3)}</div>
      <div>การแอ่นตัวสัมพัทธ์ลบสูงสุด (-EIδ) (${uEIDelta}): ${Units.eiDelta(solution.minNegDelta.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.minNegDelta.x).toFixed(3)}</div>
    ` : `
      <div>(Max +ve)Relative Deflection EIδ (${uEIDelta}): ${Units.eiDelta(solution.maxPosDelta.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosDelta.x).toFixed(3)}</div>
      <div>(Max -ve)Relative Deflection EIδ (${uEIDelta}): ${Units.eiDelta(solution.minNegDelta.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.minNegDelta.x).toFixed(3)}</div>
    `;
    document.getElementById('repCapStress').innerHTML = isTH ? `
      <div>หน่วยแรงดัด (Bending Stress): ข้ามการคำนวณเนื่องจากอยู่ในโหมดไม่คิดหน้าตัด (EI คงที่)</div>
    ` : `
      <div>Bending Stress: Bypassed in No Cross-Section (Constant EI) Mode</div>
    `;
    document.getElementById('repStressSummaryBox').innerHTML = isTH ? `
      <div>โมเมนต์ดัดสูงสุดสัมบูรณ์ |M_max|: <strong>${Units.mom(Math.abs(solution.maxM.val)).toFixed(3)} ${uM}</strong></div>
      <div>โหมดการวิเคราะห์: <strong>ไม่คิดหน้าตัด (โหมดโจทย์การบ้านทั่วไป)</strong></div>
      <div>ความชันสัมพัทธ์สูงสุด |EIθ_max|: <strong>${Units.eiTheta(Math.abs(solution.maxSlope.val)).toFixed(3)} ${uEITheta}</strong></div>
      <div>การแอ่นตัวสัมพัทธ์สูงสุด |EIδ_max|: <strong>${Units.eiDelta(Math.abs(solution.maxDelta.val)).toFixed(3)} ${uEIDelta}</strong></div>
    ` : `
      <div>Max Bending Moment |M_max|: <strong>${Units.mom(Math.abs(solution.maxM.val)).toFixed(3)} ${uM}</strong></div>
      <div>Analysis Mode: <strong>No Cross-Section (Constant EI Homework Mode)</strong></div>
      <div>Max Relative Slope |EIθ_max|: <strong>${Units.eiTheta(Math.abs(solution.maxSlope.val)).toFixed(3)} ${uEITheta}</strong></div>
      <div>Max Relative Deflection |EIδ_max|: <strong>${Units.eiDelta(Math.abs(solution.maxDelta.val)).toFixed(3)} ${uEIDelta}</strong></div>
    `;
    document.getElementById('repSectionDetailBox').innerHTML = isTH ? `
      <div>สถานะหน้าตัด: <strong>ไม่ระบุหน้าตัด (EI = คงที่)</strong></div>
      <div>แรงปฏิกิริยาและ SFD/BMD: <strong>เป็นอิสระจากหน้าตัด 100%</strong></div>
      <div>วิธีแปลงเป็นค่าจริง: <strong>θ(rad) = EIθ / EI, &nbsp; δ = EIδ / EI</strong></div>
      <div>ความเค้นดัด σ = My/I: <strong>ไม่ได้คิดในโหมดนี้</strong></div>
    ` : `
      <div>Section Status: <strong>No Cross-Section Specified (EI = const)</strong></div>
      <div>Reactions & SFD/BMD: <strong>100% Independent of Cross-Section</strong></div>
      <div>Conversion to Actual: <strong>θ(rad) = EIθ / EI, &nbsp; δ = EIδ / EI</strong></div>
      <div>Bending Stress σ = My/I: <strong>Bypassed in this mode</strong></div>
    `;
  } else {
    document.getElementById('repCapSlope').innerHTML = isTH ? `
      <div>มุมลาดชันบวกสูงสุด (+θ) (Deg): ${solution.maxPosSlope.val.toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosSlope.x).toFixed(3)}</div>
      <div>มุมลาดชันลบสูงสุด (-θ) (Deg): ${solution.minNegSlope.val.toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.minNegSlope.x).toFixed(3)}</div>
    ` : `
      <div>(Max +ve)Slope (Deg): ${solution.maxPosSlope.val.toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosSlope.x).toFixed(3)}</div>
      <div>(Max -ve)Slope (Deg): ${solution.minNegSlope.val.toFixed(3)}, Location (${uL}): ${Units.len(solution.minNegSlope.x).toFixed(3)}</div>
    `;
    document.getElementById('repCapDefl').innerHTML = isTH ? `
      <div>การแอ่นตัวบวกสูงสุด (+δ) (${uD}): ${Units.defl(solution.maxPosDelta.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxPosDelta.x).toFixed(3)}</div>
      <div>การแอ่นตัวลบสูงสุด (-δ) (${uD}): ${Units.defl(solution.minNegDelta.val).toFixed(3)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.minNegDelta.x).toFixed(3)}</div>
    ` : `
      <div>(Max +ve)Deflection (${uD}): ${Units.defl(solution.maxPosDelta.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.maxPosDelta.x).toFixed(3)}</div>
      <div>(Max -ve)Deflection (${uD}): ${Units.defl(solution.minNegDelta.val).toFixed(3)}, Location (${uL}): ${Units.len(solution.minNegDelta.x).toFixed(3)}</div>
    `;
    document.getElementById('repCapStress').innerHTML = isTH ? `
      <div>หน่วยแรงดัดสูงสุดที่ขอบหน้าตัด (Max Bending Stress) (${uS}): ${Units.stress(solution.maxSigma.val).toFixed(2)}, ที่ตำแหน่ง (${uL}): ${Units.len(solution.maxSigma.x).toFixed(3)}</div>
    ` : `
      <div>(Max Extreme Fiber) Bending Stress (${uS}): ${Units.stress(solution.maxSigma.val).toFixed(2)}, Location (${uL}): ${Units.len(solution.maxSigma.x).toFixed(3)}</div>
    `;

    // Sheet 3 Detailed Boxes
    const S_mm3 = I_mm4 / model.y;
    const S_cm3 = model.I / (model.y / 10);
    const fyDisp = isImp ? '36.26 ksi' : '250 MPa';
    document.getElementById('repStressSummaryBox').innerHTML = isTH ? `
      <div>โมเมนต์ดัดสูงสุดสัมบูรณ์ |M_max|: <strong>${Units.mom(Math.abs(solution.maxM.val)).toFixed(3)} ${uM}</strong></div>
      <div>มอดุลัสหน้าตัด S = I / y: <strong>${isImp ? `${Units.S(S_cm3).toFixed(2)} in³` : `${S_mm3.toFixed(0)} mm³`}</strong></div>
      <div>ความเค้นดัดสูงสุด σ = M / S: <strong>${Units.stress(solution.maxSigma.val).toFixed(2)} ${uS}</strong></div>
      <div>กำลังครากที่ยอมให้ Fy (${fyDisp}): <strong>${solution.maxSigma.val <= 250 ? 'ผ่านเกณฑ์ (PASS)' : `เกินพิกัด (${fyDisp})`}</strong></div>
    ` : `
      <div>Max Bending Moment |M_max|: <strong>${Units.mom(Math.abs(solution.maxM.val)).toFixed(3)} ${uM}</strong></div>
      <div>Section Modulus S = I / y: <strong>${isImp ? `${Units.S(S_cm3).toFixed(2)} in³` : `${S_mm3.toFixed(0)} mm³`}</strong></div>
      <div>Max Bending Stress σ = M / S: <strong>${Units.stress(solution.maxSigma.val).toFixed(2)} ${uS}</strong></div>
      <div>Allowable Yield Stress Fy (${fyDisp}): <strong>${solution.maxSigma.val <= 250 ? 'PASS (OK)' : `EXCEEDS ${fyDisp}`}</strong></div>
    `;
    const EI_MNm2 = model.E * model.I * 1e-5;
    document.getElementById('repSectionDetailBox').innerHTML = isTH ? `
      <div>ชื่อหน้าตัดโครงสร้าง: <strong>${model.sectionName}</strong></div>
      <div>ความแกร่งรับแรงดัด (Flexural Rigidity EI): <strong>${isImp ? `${Units.EI(EI_MNm2).toFixed(2)} kip·ft²` : `${(EI_Nmm2 / 1e12).toFixed(4)} × 10¹² N·mm²`}</strong></div>
      <div>ความแกร่งตามแนวแกน (Axial Stiffness EA): <strong>${isImp ? `${Units.force((E_MPa * A_mm2) / 1e3).toFixed(1)} kip` : `${((E_MPa * A_mm2) / 1e6).toFixed(2)} MN`}</strong></div>
      <div>อัตราส่วนช่วงคานต่อการแอ่นตัว L / |δ|: <strong>L / ${Math.round((model.length * 1000) / Math.max(0.01, Math.abs(solution.maxDelta.val)))}</strong></div>
    ` : `
      <div>Section Designation: <strong>${model.sectionName}</strong></div>
      <div>Flexural Rigidity EI: <strong>${isImp ? `${Units.EI(EI_MNm2).toFixed(2)} kip·ft²` : `${(EI_Nmm2 / 1e12).toFixed(4)} × 10¹² N·mm²`}</strong></div>
      <div>Axial Stiffness EA: <strong>${isImp ? `${Units.force((E_MPa * A_mm2) / 1e3).toFixed(1)} kip` : `${((E_MPa * A_mm2) / 1e6).toFixed(2)} MN`}</strong></div>
      <div>Span-to-Deflection Ratio L / |δ|: <strong>L / ${Math.round((model.length * 1000) / Math.max(0.01, Math.abs(solution.maxDelta.val)))}</strong></div>
    `;
  }

  // 2D Structural Report Population
  document.getElementById('rep2DModelTitle').innerText = frame2D.title;
  render2DWorkspace('rep2DSnapshotCanvas');

  const rep2DReac = document.getElementById('rep2DReactionsTable');
  if (rep2DReac) {
    rep2DReac.innerHTML = `
      <thead><tr><th>${isTH ? 'จุดรองรับ (Node)' : 'Support Node'}</th><th>${isTH ? 'ชนิด (Type)' : 'Type'}</th><th>Rx (${uF})</th><th>Ry (${uF})</th><th>Mz (${uM})</th></tr></thead>
      <tbody>
        ${frame2D.nodes.filter(n => n.support && n.support !== 'none').map(n => `
          <tr><td>N${n.id} (${+Units.len(n.x).toFixed(2)}${uL}, ${+Units.len(n.y).toFixed(2)}${uL})</td><td>${n.support}</td><td>${Units.force(n.rx || 0).toFixed(3)}</td><td>${Units.force(n.ry || 0).toFixed(3)}</td><td>${Units.mom(n.rmz || 0).toFixed(3)}</td></tr>
        `).join('')}
      </tbody>
    `;
  }

  const rep2DMem = document.getElementById('rep2DMembersTable');
  if (rep2DMem) {
    rep2DMem.innerHTML = `
      <thead><tr><th>${isTH ? 'ชิ้นส่วน (Member)' : 'Member'}</th><th>${isTH ? 'จุดต่อ (Nodes)' : 'Nodes'}</th><th>${isTH ? 'ชนิด' : 'Type'}</th><th>${isTH ? 'ความยาว' : 'Length'} (${uL})</th><th>${isTH ? 'แรงตามแนวแกน N' : 'Axial N'} (${uF})</th><th>Max |V| (${uF})</th><th>Max |M| (${uM})</th></tr></thead>
      <tbody>
        ${frame2D.members.map(m => `
          <tr><td>M${m.id}</td><td>N${m.n1} → N${m.n2}</td><td>${m.type}</td><td>${Units.len(m.length || 0).toFixed(3)}</td><td>${Units.force(m.N || 0).toFixed(2)}</td><td>${Units.force(m.maxAbsV || 0).toFixed(2)}</td><td>${Units.mom(m.maxAbsM || 0).toFixed(2)}</td></tr>
        `).join('')}
      </tbody>
    `;
  }

  const rep2DNodes = document.getElementById('rep2DNodesTable');
  if (rep2DNodes) {
    rep2DNodes.innerHTML = `
      <thead><tr><th>${isTH ? 'จุดต่อ (Node)' : 'Node'}</th><th>X (${uL})</th><th>Y (${uL})</th><th>${isTH ? 'แรงกระทำ Fx' : 'Applied Fx'} (${uF})</th><th>${isTH ? 'แรงกระทำ Fy' : 'Applied Fy'} (${uF})</th><th>ux (${uD})</th><th>uy (${uD})</th></tr></thead>
      <tbody>
        ${frame2D.nodes.map(n => `
          <tr><td>N${n.id}</td><td>${Units.len(n.x).toFixed(2)}</td><td>${Units.len(n.y).toFixed(2)}</td><td>${Units.force(n.fx || 0).toFixed(2)}</td><td>${Units.force(n.fy || 0).toFixed(2)}</td><td>${Units.defl((n.ux || 0) * 1000).toFixed(3)}</td><td>${Units.defl((n.uy || 0) * 1000).toFixed(3)}</td></tr>
        `).join('')}
      </tbody>
    `;
  }

  // Roof Truss 2D & 3D Report Population
  if (typeof populateTrussCalculationReport === 'function') {
    populateTrussCalculationReport();
  }
}

/*************************************************************************
 * PART 6: AI MODELER & PROJECT FOLDERS / SAVED MODELS MANAGER
 *************************************************************************/
function openAIModal() {
  const m = document.getElementById('aiModal');
  if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
}
function closeAIModal() {
  const m = document.getElementById('aiModal');
  if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
}
function setAIPrompt(txt) {
  document.getElementById('aiPromptInput').value = txt;
}

function executeAIPrompt() {
  const raw = (document.getElementById('aiPromptInput')?.value || '').trim();
  const txt = raw.toLowerCase();
  if (!txt) return;

  closeAIModal();

  if (txt.includes('4718') || txt.includes('soldier')) {
    switchWorkspace('1d');
    loadPreset('report_example_4718');
    showNotification('AI สร้างโมเดลสำเร็จ', 'โหลดโมเดล 4718-28th-SEC-D (MK2 SOLDIER) เรียบร้อยแล้ว');
    return;
  }

  if (txt.includes('braced') || txt.includes('2 ชั้น') || txt.includes('two-storey') || txt.includes('ดามทะแยง')) {
    switchWorkspace('2d');
    load2DPreset('braced_two_storey');
    showNotification('AI สร้างโมเดล 2D สำเร็จ', 'สร้างโครงข้อแข็ง Braced two-storey frame พร้อมวิเคราะห์ FEA เรียบร้อย');
    return;
  }

  if (txt.includes('pratt') || txt.includes('โครงถักหลังคา')) {
    switchWorkspace('2d');
    load2DPreset('pratt_truss');
    showNotification('AI สร้างโครงถัก 2D สำเร็จ', 'สร้างโครงถักหลังคา Pratt Roof Truss เรียบร้อย');
    return;
  }

  if (txt.includes('warren') || txt.includes('สะพาน')) {
    switchWorkspace('2d');
    load2DPreset('warren_truss');
    showNotification('AI สร้างโครงถัก 2D สำเร็จ', 'สร้างโครงถักสะพาน Warren Bridge Truss เรียบร้อย');
    return;
  }

  if (txt.includes('portal') || txt.includes('พอร์ทัล')) {
    switchWorkspace('2d');
    load2DPreset('portal_frame');
    showNotification('AI สร้างโครงข้อแข็ง 2D สำเร็จ', 'สร้าง Single-Bay Portal Frame เรียบร้อย');
    return;
  }

  // Parse 1D Beam parameters from natural language
  switchWorkspace('1d');
  const nums = (txt.match(/\d+(\.\d+)?/g) || []).map(Number);
  const L = nums[0] && nums[0] >= 1 && nums[0] <= 50 ? nums[0] : 6.0;
  model.length = L;
  model.name = 'AI-GENERATED-BEAM';

  if (txt.includes('คานยื่น') || txt.includes('cantilever')) {
    model.supports = [{ id: 1, type: 'fixed', x: 0 }];
    const P = nums[1] || 20;
    model.loads = [{ id: 1, type: 'point', P, x: L }];
  } else {
    model.supports = [
      { id: 1, type: 'pinned', x: 0 },
      { id: 2, type: 'roller', x: L }
    ];
    model.loads = [];
    if (txt.includes('กระจาย') || txt.includes('udl')) {
      const w = nums[1] || 15;
      model.loads.push({ id: 1, type: 'udl', w1: w, w2: w, x1: 0, x2: L });
      if (nums[2]) {
        model.loads.push({ id: 2, type: 'point', P: nums[2], x: +(L / 2).toFixed(2) });
      }
    } else {
      const P = nums[1] || 30;
      model.loads.push({ id: 1, type: 'point', P, x: +(L / 2).toFixed(2) });
    }
  }

  syncInputFields();
  solveAndRender();
  showNotification('AI วิเคราะห์คานสำเร็จ', `สร้างคานยาว ${L}m และคำนวณ FEA เรียบร้อยแล้ว`);
}

// Project Folders & Unlimited Saved Models
let savedProjectModels = [
  {
    id: 'proj_1',
    folder: 'Bridge & Soldier Beams',
    name: '4718-28th-SEC-D (MK2 SOLDIER Report)',
    workspace: '1d',
    time: '2019/09/15 10:30',
    preset1D: 'report_example_4718'
  },
  {
    id: 'proj_2',
    folder: 'Commercial Buildings',
    name: 'Braced two-storey frame (Screenshot Model)',
    workspace: '2d',
    time: '2026/10/17 04:20',
    preset2D: 'braced_two_storey'
  },
  {
    id: 'proj_3',
    folder: 'Steel Roof Trusses',
    name: 'Pratt Roof Truss 8m Span',
    workspace: '2d',
    time: '2026/10/17 04:15',
    preset2D: 'pratt_truss'
  }
];

function openProjectManagerModal() {
  const m = document.getElementById('projectModal');
  if (m) {
    m.classList.remove('hidden');
    m.classList.add('flex');
    renderSavedProjectsList();
  }
}

function closeProjectManagerModal() {
  const m = document.getElementById('projectModal');
  if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
}

function saveCurrentProjectCheckpoint() {
  const nameInput = document.getElementById('saveProjectNameInput');
  const folderSel = document.getElementById('projectFolderSelect');
  const folder = (folderSel?.value && folderSel.value !== 'All Folders') ? folderSel.value : 'Commercial Buildings';
  const name = nameInput?.value.trim() || (currentWorkspace === '2d' ? frame2D.title : model.name) + ' Snapshot';

  savedProjectModels.unshift({
    id: 'proj_' + Date.now(),
    folder,
    name,
    workspace: currentWorkspace === '2d' ? '2d' : '1d',
    time: new Date().toLocaleString('th-TH'),
    snapshot1D: JSON.parse(JSON.stringify(model)),
    snapshot2D: {
      title: frame2D.title,
      nodes: JSON.parse(JSON.stringify(frame2D.nodes)),
      members: JSON.parse(JSON.stringify(frame2D.members))
    }
  });
  if (nameInput) nameInput.value = '';
  renderSavedProjectsList();
  showNotification('บันทึกโมเดลลงในโปรเจกต์แล้ว', `บันทึก "${name}" ในโฟลเดอร์ ${folder} เรียบร้อย`);
}

function loadSavedProjectModel(id) {
  const item = savedProjectModels.find(x => x.id === id);
  if (!item) return;
  closeProjectManagerModal();
  if (item.preset1D) {
    switchWorkspace('1d');
    loadPreset(item.preset1D);
  } else if (item.preset2D) {
    switchWorkspace('2d');
    load2DPreset(item.preset2D);
  } else if (item.workspace === '2d' && item.snapshot2D) {
    switchWorkspace('2d');
    frame2D.title = item.snapshot2D.title;
    frame2D.nodes = JSON.parse(JSON.stringify(item.snapshot2D.nodes));
    frame2D.members = JSON.parse(JSON.stringify(item.snapshot2D.members));
    solve2DFrame();
  } else if (item.snapshot1D) {
    switchWorkspace('1d');
    model = JSON.parse(JSON.stringify(item.snapshot1D));
    syncInputFields();
    solveAndRender();
  }
  showNotification('เปิดโมเดลจากโปรเจกต์สำเร็จ', `โหลด "${item.name}" เรียบร้อยแล้ว`);
}

function renderSavedProjectsList() {
  const container = document.getElementById('savedProjectsContainer');
  if (!container) return;
  const filterFolder = document.getElementById('projectFolderSelect')?.value || 'All Folders';
  const list = filterFolder === 'All Folders'
    ? savedProjectModels
    : savedProjectModels.filter(p => p.folder === filterFolder);

  container.innerHTML = list.map(p => `
    <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div>
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${p.workspace === '2d' ? 'bg-teal-500/15 text-teal-500' : 'bg-sky-500/15 text-sky-500'}">${p.workspace.toUpperCase()}</span>
          <span class="font-bold text-slate-800 dark:text-white">${p.name}</span>
        </div>
        <div class="text-[11px] text-slate-500 mt-0.5">
          <i class="fa-regular fa-folder mr-1 text-amber-500"></i>${p.folder} • ${p.time}
        </div>
      </div>
      <button onclick="loadSavedProjectModel('${p.id}')" class="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition">
        เปิดโมเดล
      </button>
    </div>
  `).join('');
}
