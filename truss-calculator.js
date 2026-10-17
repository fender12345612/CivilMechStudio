/*************************************************************************
 * CIVILMECH STUDIO — ROOF TRUSS 2D & 3D STRUCTURAL ANALYSIS & DESIGN SUITE
 * Developed for Civil Engineering Education (นาย ธนัตถ์ วงษ์อุ่น ECE2NR68)
 * Standards: กฎกระทรวง พ.ศ. 2566, วสท. 1009-34 (ASD), วสท. 1010-50 (LRFD), มยผ. 1311-50
 *************************************************************************/

// ============================================================================
// 1. MANDATORY DISCLAIMER POPUP LOGIC (RED WARNING TEXT ONSTARTUP)
// ============================================================================
function acceptDisclaimerPopup() {
  const modal = document.getElementById('disclaimerPopupModal');
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 250);
  }
  if (typeof showNotification === 'function') {
    showNotification(
      'รับทราบเงื่อนไขการใช้งาน',
      'เข้าสู่ระบบวิเคราะห์โครงสร้างเพื่อการศึกษาสำหรับนักศึกษาวิศวกรรมโยธา'
    );
  }
}

function declineDisclaimerPopup() {
  // Attempt to close the browser tab/window immediately
  try {
    window.open('', '_self', '');
    window.close();
  } catch (e) {}

  // Fallback if browser blocks window.close() on user-opened tabs:
  // Wipe the entire page and redirect to about:blank / show locked termination screen
  document.body.innerHTML = `
    <div style="min-height:100vh;background:#090d16;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Prompt','Inter',sans-serif;text-align:center;">
      <div style="max-width:560px;background:#111827;border:2px solid #ef4444;border-radius:20px;padding:36px 28px;box-shadow:0 25px 60px rgba(239,68,68,0.35);">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(239,68,68,0.15);color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;font-weight:bold;">✕</div>
        <h2 style="color:#ef4444;font-size:22px;font-weight:800;margin:0 0 12px;">ยุติการเข้าใช้งานเว็บไซต์</h2>
        <p style="color:#f87171;font-size:15px;line-height:1.65;margin:0 0 20px;">
          ท่านเลือก <b>"ไม่ยอมรับ"</b> เงื่อนไขการใช้งาน ระบบจึงได้ปิดและระงับการเข้าถึงเนื้อหาของเว็บไซต์ทั้งหมดทันที
        </p>
        <button onclick="window.location.reload()" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:10px 20px;border-radius:10px;font-size:13px;cursor:pointer;font-weight:600;">
          โหลดหน้าเว็บใหม่หากต้องการอ่านเงื่อนไขอีกครั้ง
        </button>
      </div>
    </div>
  `;
  setTimeout(() => {
    try { window.location.replace('about:blank'); } catch (e) {}
  }, 600);
}

// ============================================================================
// 2. STANDARD STEEL SECTIONS DATABASE (TIS / JIS FOR ROOF TRUSS, PURLIN, COLUMN)
// ============================================================================
const TRUSS_SECTIONS_DB = [
  // SHS — Square Hollow Section (เหล็กกล่องสี่เหลี่ยมจัตุรัส มอก. 1228)
  { id: 'SHS38x38x2.3', type: 'SHS', d: 38, b: 38, t: 2.3, A: 3.23, Ix: 6.84, Iy: 6.84, rx: 1.46, ry: 1.46, kg: 2.54, name: 'กล่อง □ 38×38×2.3 mm' },
  { id: 'SHS50x50x2.3', type: 'SHS', d: 50, b: 50, t: 2.3, A: 4.32, Ix: 16.5, Iy: 16.5, rx: 1.95, ry: 1.95, kg: 3.39, name: 'กล่อง □ 50×50×2.3 mm' },
  { id: 'SHS50x50x3.2', type: 'SHS', d: 50, b: 50, t: 3.2, A: 5.87, Ix: 21.7, Iy: 21.7, rx: 1.92, ry: 1.92, kg: 4.61, name: 'กล่อง □ 50×50×3.2 mm' },
  { id: 'SHS60x60x2.3', type: 'SHS', d: 60, b: 60, t: 2.3, A: 5.24, Ix: 29.6, Iy: 29.6, rx: 2.38, ry: 2.38, kg: 4.12, name: 'กล่อง □ 60×60×2.3 mm' },
  { id: 'SHS60x60x3.2', type: 'SHS', d: 60, b: 60, t: 3.2, A: 7.15, Ix: 39.7, Iy: 39.7, rx: 2.36, ry: 2.36, kg: 5.61, name: 'กล่อง □ 60×60×3.2 mm' },
  { id: 'SHS75x75x2.3', type: 'SHS', d: 75, b: 75, t: 2.3, A: 6.62, Ix: 60.4, Iy: 60.4, rx: 3.02, ry: 3.02, kg: 5.20, name: 'กล่อง □ 75×75×2.3 mm' },
  { id: 'SHS75x75x3.2', type: 'SHS', d: 75, b: 75, t: 3.2, A: 9.07, Ix: 78.0, Iy: 78.0, rx: 2.93, ry: 2.93, kg: 7.13, name: 'กล่อง □ 75×75×3.2 mm' },
  { id: 'SHS75x75x4.5', type: 'SHS', d: 75, b: 75, t: 4.5, A: 12.51, Ix: 103.0, Iy: 103.0, rx: 2.88, ry: 2.88, kg: 9.83, name: 'กล่อง □ 75×75×4.5 mm' },
  { id: 'SHS100x100x3.2', type: 'SHS', d: 100, b: 100, t: 3.2, A: 12.27, Ix: 194.0, Iy: 194.0, rx: 3.97, ry: 3.97, kg: 9.63, name: 'กล่อง □ 100×100×3.2 mm' },
  { id: 'SHS100x100x4.5', type: 'SHS', d: 100, b: 100, t: 4.5, A: 17.01, Ix: 262.0, Iy: 262.0, rx: 3.92, ry: 3.92, kg: 13.40, name: 'กล่อง □ 100×100×4.5 mm' },
  { id: 'SHS125x125x4.5', type: 'SHS', d: 125, b: 125, t: 4.5, A: 21.51, Ix: 526.0, Iy: 526.0, rx: 4.94, ry: 4.94, kg: 16.90, name: 'กล่อง □ 125×125×4.5 mm' },
  { id: 'SHS150x150x4.5', type: 'SHS', d: 150, b: 150, t: 4.5, A: 26.01, Ix: 923.0, Iy: 923.0, rx: 5.96, ry: 5.96, kg: 20.40, name: 'กล่อง □ 150×150×4.5 mm' },

  // RHS — Rectangular Hollow Section (เหล็กกล่องแบน)
  { id: 'RHS75x45x2.3', type: 'RHS', d: 75, b: 45, t: 2.3, A: 5.34, Ix: 38.9, Iy: 17.6, rx: 2.70, ry: 1.81, kg: 4.19, name: 'กล่อง ▭ 75×45×2.3 mm' },
  { id: 'RHS100x50x2.3', type: 'RHS', d: 100, b: 50, t: 2.3, A: 6.62, Ix: 74.1, Iy: 25.5, rx: 3.34, ry: 1.96, kg: 5.20, name: 'กล่อง ▭ 100×50×2.3 mm' },
  { id: 'RHS100x50x3.2', type: 'RHS', d: 100, b: 50, t: 3.2, A: 9.07, Ix: 112.0, Iy: 38.0, rx: 3.51, ry: 2.05, kg: 7.13, name: 'กล่อง ▭ 100×50×3.2 mm' },
  { id: 'RHS125x75x3.2', type: 'RHS', d: 125, b: 75, t: 3.2, A: 12.27, Ix: 257.0, Iy: 117.0, rx: 4.58, ry: 3.10, kg: 9.63, name: 'กล่อง ▭ 125×75×3.2 mm' },
  { id: 'RHS150x75x3.2', type: 'RHS', d: 150, b: 75, t: 3.2, A: 13.87, Ix: 407.0, Iy: 131.0, rx: 5.42, ry: 3.07, kg: 10.90, name: 'กล่อง ▭ 150×75×3.2 mm' },
  { id: 'RHS150x75x4.5', type: 'RHS', d: 150, b: 75, t: 4.5, A: 19.26, Ix: 548.0, Iy: 178.0, rx: 5.34, ry: 3.04, kg: 15.10, name: 'กล่อง ▭ 150×75×4.5 mm' },
  { id: 'RHS200x100x4.5', type: 'RHS', d: 200, b: 100, t: 4.5, A: 26.01, Ix: 1370.0, Iy: 443.0, rx: 7.26, ry: 4.13, kg: 20.40, name: 'กล่อง ▭ 200×100×4.5 mm' },

  // CHS — Circular Hollow Pipe (ท่อกลมดำ มอก. 107)
  { id: 'CHS42.7x2.3', type: 'CHS', d: 42.7, b: 42.7, t: 2.3, A: 2.92, Ix: 5.97, Iy: 5.97, rx: 1.43, ry: 1.43, kg: 2.29, name: 'ท่อกลม Ø 42.7×2.3 mm (1¼")' },
  { id: 'CHS48.6x2.3', type: 'CHS', d: 48.6, b: 48.6, t: 2.3, A: 3.35, Ix: 8.99, Iy: 8.99, rx: 1.64, ry: 1.64, kg: 2.63, name: 'ท่อกลม Ø 48.6×2.3 mm (1½")' },
  { id: 'CHS60.5x2.8', type: 'CHS', d: 60.5, b: 60.5, t: 2.8, A: 5.07, Ix: 21.2, Iy: 21.2, rx: 2.04, ry: 2.04, kg: 3.98, name: 'ท่อกลม Ø 60.5×2.8 mm (2")' },
  { id: 'CHS76.3x3.2', type: 'CHS', d: 76.3, b: 76.3, t: 3.2, A: 7.35, Ix: 49.2, Iy: 49.2, rx: 2.59, ry: 2.59, kg: 5.77, name: 'ท่อกลม Ø 76.3×3.2 mm (2½")' },
  { id: 'CHS89.1x3.2', type: 'CHS', d: 89.1, b: 89.1, t: 3.2, A: 8.63, Ix: 79.8, Iy: 79.8, rx: 3.04, ry: 3.04, kg: 6.78, name: 'ท่อกลม Ø 89.1×3.2 mm (3")' },
  { id: 'CHS114.3x4.5', type: 'CHS', d: 114.3, b: 114.3, t: 4.5, A: 15.52, Ix: 234.0, Iy: 234.0, rx: 3.89, ry: 3.89, kg: 12.18, name: 'ท่อกลม Ø 114.3×4.5 mm (4½")' },

  // C — Light Lip Channel (เหล็กตัวซี สำหรับแปและโครง)
  { id: 'C75x45x15x2.3', type: 'C', d: 75, b: 45, t: 2.3, A: 4.14, Ix: 37.1, Iy: 11.8, rx: 3.00, ry: 1.69, kg: 3.25, name: 'ตัวซี C 75×45×15×2.3 mm' },
  { id: 'C100x50x20x2.3', type: 'C', d: 100, b: 50, t: 2.3, A: 5.17, Ix: 80.7, Iy: 19.0, rx: 3.95, ry: 1.92, kg: 4.06, name: 'ตัวซี C 100×50×20×2.3 mm' },
  { id: 'C100x50x20x3.2', type: 'C', d: 100, b: 50, t: 3.2, A: 7.07, Ix: 107.0, Iy: 24.5, rx: 3.90, ry: 1.87, kg: 5.50, name: 'ตัวซี C 100×50×20×3.2 mm' },
  { id: 'C125x50x20x2.3', type: 'C', d: 125, b: 50, t: 2.3, A: 5.88, Ix: 141.6, Iy: 21.5, rx: 4.91, ry: 1.91, kg: 4.62, name: 'ตัวซี C 125×50×20×2.3 mm' },
  { id: 'C125x50x20x3.2', type: 'C', d: 125, b: 50, t: 3.2, A: 7.80, Ix: 181.0, Iy: 26.6, rx: 4.82, ry: 1.85, kg: 6.13, name: 'ตัวซี C 125×50×20×3.2 mm' },
  { id: 'C150x50x20x3.2', type: 'C', d: 150, b: 50, t: 3.2, A: 8.70, Ix: 280.0, Iy: 28.3, rx: 5.71, ry: 1.81, kg: 6.76, name: 'ตัวซี C 150×50×20×3.2 mm' },
  { id: 'C150x65x20x3.2', type: 'C', d: 150, b: 65, t: 3.2, A: 10.21, Ix: 332.0, Iy: 53.8, rx: 5.89, ry: 2.37, kg: 8.01, name: 'ตัวซี C 150×65×20×3.2 mm' },
  { id: 'C200x75x20x3.2', type: 'C', d: 200, b: 75, t: 3.2, A: 12.13, Ix: 716.0, Iy: 84.1, rx: 7.79, ry: 2.67, kg: 9.52, name: 'ตัวซี C 200×75×20×3.2 mm' },

  // L — Equal Angle (เหล็กฉาก)
  { id: 'L50x50x4', type: 'L', d: 50, b: 50, t: 4.0, A: 3.89, Ix: 9.06, Iy: 9.06, rx: 1.53, ry: 1.53, kg: 3.06, name: 'เหล็กฉาก L 50×50×4 mm' },
  { id: 'L65x65x6', type: 'L', d: 65, b: 65, t: 6.0, A: 7.53, Ix: 29.4, Iy: 29.4, rx: 1.98, ry: 1.98, kg: 5.91, name: 'เหล็กฉาก L 65×65×6 mm' },
  { id: 'L75x75x6', type: 'L', d: 75, b: 75, t: 6.0, A: 8.73, Ix: 46.1, Iy: 46.1, rx: 2.30, ry: 2.30, kg: 6.85, name: 'เหล็กฉาก L 75×75×6 mm' },

  // H — Wide Flange / H-Beam (สำหรับเสาอาคาร)
  { id: 'H150x150x7x10', type: 'H', d: 150, b: 150, t: 10.0, A: 40.14, Ix: 1640.0, Iy: 563.0, rx: 6.39, ry: 3.75, kg: 31.5, name: 'H-Beam 150×150×7×10 mm' },
  { id: 'H200x200x8x12', type: 'H', d: 200, b: 200, t: 12.0, A: 63.53, Ix: 4720.0, Iy: 1600.0, rx: 8.62, ry: 5.02, kg: 49.9, name: 'H-Beam 200×200×8×12 mm' },
  { id: 'H250x250x9x14', type: 'H', d: 250, b: 250, t: 14.0, A: 92.18, Ix: 10800.0, Iy: 3650.0, rx: 10.8, ry: 6.29, kg: 72.4, name: 'H-Beam 250×250×9×14 mm' }
];

function getTrussSec(id) {
  return TRUSS_SECTIONS_DB.find(s => s.id === id) || TRUSS_SECTIONS_DB[5];
}

// ============================================================================
// 3. STATE & EDUCATIONAL TRUSS TEMPLATES
// ============================================================================
let trussState = {
  presetKey: 'pratt_gable_12m',
  projectTitle: 'โครงการศึกษาวิเคราะห์โครงหลังคาเหล็ก (Roof Truss Design)',
  engineerName: 'นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)',
  designMethod: 'ASD',        // 'ASD' (วสท. 1009-34) or 'LRFD' (วสท. 1010-50)
  steelGrade: 'SS400',        // SS400 (Fy=2450), SM490 (Fy=3250), SM520 (Fy=3720)
  Fy: 2450,                   // ksc (kg/cm²)
  E: 2040000,                 // ksc (2.04e6 kg/cm² = 200 GPa)

  // Building Layout
  baySpacing: 4.0,            // m (s)
  bldgLength: 24.0,           // m (Lb)
  numTrusses: 7,              // N = Lb/s + 1
  overhangLeft: 0.0,          // m
  overhangRight: 0.0,         // m

  // Truss Geometry
  span: 12.0,                 // m (L)
  ridgeHeight: 1.80,          // m (H_ridge)
  eaveHeight: 0.50,           // m (H_eave)
  panels: 8,                  // even number of panels (4..16)
  shape: 'triangular',        // 'triangular', 'triangular-inv', 'parabolic', 'circular', 'bowstring', 'flat'
  diagPattern: 'pratt',       // 'pratt', 'howe', 'warren', 'warren-pure', 'x-brace'
  flippedDiags: {},           // panelIdx -> boolean

  // Columns & Center Support
  hasColumns: true,
  colHeight: 5.0,             // m
  secCol: 'H200x200x8x12',
  hasCenterCol: false,
  centerColType: 'roller',    // 'roller' or 'pin'
  // Column Grid Map: key = `${trussIdx}_${axis}` ('A','B','C') -> boolean
  columnGrid: {},

  // Roof Loads & Wind
  dlRoof: 25.0,               // kg/m² (Roofing + Purlin dead load)
  llRoof: 50.0,               // kg/m² (Ministerial Reg 2566 min 50 kg/m²)
  hasSolar: true,
  solarLoad: 20.0,            // kg/m² (Panel)
  solarFrame: 8.0,            // kg/m² (Mounting frame)
  windOn: true,
  windZone: 1,                // 1 (25m/s), 2 (27m/s), 3 (29m/s), 4 (30m/s)
  windTerrain: 'B',           // 'A' (Open) or 'B' (Suburban/Urban)
  windHeight: 6.8,            // m
  windCp: 0.90,               // Net uplift Cp

  // Selected Member Sections
  secTop: 'SHS75x75x3.2',
  secBot: 'SHS75x75x3.2',
  secDia: 'SHS50x50x2.3',
  secVer: 'SHS50x50x2.3',

  // Purlin Settings
  secPurlin: 'C125x50x20x2.3',
  purlinSpacing: 1.0,         // m
  purlinSagRods: 1,           // 0, 1, 2
  purlinContinuity: 'cont2',  // 'simple', 'cont2', 'cont3'
  purlinDeflLimit: 180,       // L/180, L/240, L/360

  // Active Sub-tab
  activeSubTab: 'truss2d',    // 'grid', 'truss2d', 'truss3d', 'fbd', 'forces', 'shear', 'moment', 'sections', 'wind', 'purlin', 'formulas'

  // 3D Viewer Options
  view3DAllBuilding: true,
  view3DPurlin: true,
  view3DRoof: true,
  view3DPassFail: false,
  view3DTensionComp: true,
  view3DGrid: true
};

let trussSolution = null;

// Educational Truss Presets Library
const TRUSS_EDUCATIONAL_PRESETS = {
  pratt_gable_12m: {
    title: 'โครงถักจั่วแพรตต์ (Pratt Pitched Roof Truss)',
    subtitle: 'Span 12.0 m • 8 Panels • ทแยงเอียงเข้ากึ่งกลาง (รับแรงอัด/ดึงสมดุล)',
    ref: 'R.C. Hibbeler & วสท. 1009-34',
    span: 12.0, ridgeHeight: 1.80, eaveHeight: 0.50, panels: 8,
    shape: 'triangular', diagPattern: 'pratt',
    baySpacing: 4.0, bldgLength: 24.0, hasColumns: true, colHeight: 5.0, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'SHS75x75x3.2', secBot: 'SHS75x75x3.2', secDia: 'SHS50x50x2.3', secVer: 'SHS50x50x2.3'
  },
  howe_gable_12m: {
    title: 'โครงถักจั่วโฮว์ (Howe Pitched Roof Truss)',
    subtitle: 'Span 12.0 m • 8 Panels • ทแยงพุ่งขึ้นสู่ยอดจั่ว (ลดความยาวท่อนรับแรงอัด)',
    ref: 'Aslam Kassimali (Structural Analysis)',
    span: 12.0, ridgeHeight: 1.80, eaveHeight: 0.50, panels: 8,
    shape: 'triangular', diagPattern: 'howe',
    baySpacing: 4.0, bldgLength: 24.0, hasColumns: true, colHeight: 5.0, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'SHS75x75x3.2', secBot: 'SHS75x75x3.2', secDia: 'SHS50x50x2.3', secVer: 'SHS50x50x2.3'
  },
  warren_pitched_16m: {
    title: 'โครงถักวอร์เรนช่วงกว้าง (Warren Roof Truss)',
    subtitle: 'Span 16.0 m • 8 Panels • สลับฟันปลาพร้อมเสาตั้งรับแป',
    ref: 'Jack C. McCormac (Structural Steel Design)',
    span: 16.0, ridgeHeight: 2.20, eaveHeight: 0.60, panels: 8,
    shape: 'triangular', diagPattern: 'warren',
    baySpacing: 5.0, bldgLength: 30.0, hasColumns: true, colHeight: 6.0, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'SHS100x100x3.2', secBot: 'SHS100x100x3.2', secDia: 'SHS60x60x3.2', secVer: 'SHS50x50x2.3'
  },
  pure_warren_flat_15m: {
    title: 'โครงถักวอร์เรนแท้ คอร์ดขนาน (Pure Warren Flat Truss)',
    subtitle: 'Span 15.0 m • 10 Panels • สามเหลี่ยมสลับ △▽ สำหรับหลังคาเรียบ/สะพาน',
    ref: 'R.C. Hibbeler Ch.6 & AISC 360',
    span: 15.0, ridgeHeight: 1.50, eaveHeight: 1.50, panels: 10,
    shape: 'flat', diagPattern: 'warren-pure',
    baySpacing: 4.0, bldgLength: 20.0, hasColumns: true, colHeight: 5.5, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'SHS100x100x3.2', secBot: 'SHS100x100x3.2', secDia: 'SHS60x60x3.2', secVer: 'SHS50x50x2.3'
  },
  bowstring_arch_18m: {
    title: 'โครงถักหลังคาโค้งธนู (Bowstring Arch Truss)',
    subtitle: 'Span 18.0 m • 10 Panels • คอร์ดบนโค้งพาราโบลา คอร์ดล่างตึงแนวราบ',
    ref: 'Hibbeler & AISC Steel Design Guide',
    span: 18.0, ridgeHeight: 2.60, eaveHeight: 0.45, panels: 10,
    shape: 'bowstring', diagPattern: 'pratt',
    baySpacing: 5.0, bldgLength: 30.0, hasColumns: true, colHeight: 6.0, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'RHS125x75x3.2', secBot: 'SHS100x100x3.2', secDia: 'SHS60x60x2.3', secVer: 'SHS50x50x2.3'
  },
  parabolic_vault_20m: {
    title: 'โครงถักโดมโค้งพาราโบลา (Parabolic Arched Roof)',
    subtitle: 'Span 20.0 m • 10 Panels • โค้งรับแรงอัดตามแนวโค้งทั้งคอร์ดบนและคอร์ดล่าง',
    ref: 'Ghali & Neville (Structural Analysis)',
    span: 20.0, ridgeHeight: 3.00, eaveHeight: 0.90, panels: 10,
    shape: 'parabolic', diagPattern: 'warren',
    baySpacing: 6.0, bldgLength: 36.0, hasColumns: true, colHeight: 6.5, hasCenterCol: false,
    overhangLeft: 0, overhangRight: 0,
    secTop: 'SHS125x125x4.5', secBot: 'SHS100x100x4.5', secDia: 'SHS75x75x3.2', secVer: 'SHS60x60x3.2'
  },
  butterfly_inverted_12m: {
    title: 'โครงถักปีกผีเสื้อ V-คว่ำ (Inverted Butterfly Truss)',
    subtitle: 'Span 12.0 m • 8 Panels • คอร์ดบนลาดเข้าหากลางอาคารเพื่อระบายน้ำฝน',
    ref: 'Modern Architectural Steel Structures (AISC)',
    span: 12.0, ridgeHeight: 0.70, eaveHeight: 1.90, panels: 8,
    shape: 'triangular-inv', diagPattern: 'pratt',
    baySpacing: 4.0, bldgLength: 20.0, hasColumns: true, colHeight: 5.0, hasCenterCol: false,
    overhangLeft: 1.2, overhangRight: 1.2,
    secTop: 'SHS75x75x3.2', secBot: 'SHS75x75x3.2', secDia: 'SHS50x50x3.2', secVer: 'SHS50x50x2.3'
  },
  continuous_2span_24m: {
    title: 'โครงถัก 2 ช่วงต่อเนื่อง มีเสากลาง + ชายคายื่น (2-Span Continuous Truss)',
    subtitle: 'Span 20.0 m • 10 Panels • มีเสากลางรับน้ำหนัก (แกน B) และชายคายื่นซ้าย-ขวา 1.5 ม.',
    ref: 'มยผ. 1311-50 & วสท. 1009-34',
    span: 20.0, ridgeHeight: 2.20, eaveHeight: 0.70, panels: 10,
    shape: 'triangular', diagPattern: 'pratt',
    baySpacing: 4.0, bldgLength: 24.0, hasColumns: true, colHeight: 5.5, hasCenterCol: true,
    overhangLeft: 1.5, overhangRight: 1.5,
    secTop: 'SHS100x100x3.2', secBot: 'SHS100x100x3.2', secDia: 'SHS60x60x3.2', secVer: 'SHS60x60x2.3'
  }
};

// ============================================================================
// 4. INITIALIZATION & UI POPULATION
// ============================================================================
function initTrussCalculator() {
  populateTrussSectionSelects();
  resetColumnGridMap();
  syncTrussInputsFromState();
  solveAndRenderTruss();
  initTruss3DCanvasInteraction();
}

function populateTrussSectionSelects() {
  const memberSelectIds = ['trussSecTop', 'trussSecBot', 'trussSecDia', 'trussSecVer'];
  const groups = [
    { label: 'เหล็กกล่องจัตุรัส (SHS - มอก.1228)', type: 'SHS' },
    { label: 'เหล็กกล่องแบน (RHS)', type: 'RHS' },
    { label: 'ท่อกลมดำ (CHS - มอก.107)', type: 'CHS' },
    { label: 'เหล็กตัวซี (Lip Channel C)', type: 'C' },
    { label: 'เหล็กฉาก (Equal Angle L)', type: 'L' }
  ];

  memberSelectIds.forEach(selId => {
    const el = document.getElementById(selId);
    if (!el) return;
    el.innerHTML = groups.map(g => {
      const opts = TRUSS_SECTIONS_DB.filter(s => s.type === g.type)
        .map(s => `<option value="${s.id}">${s.name} (${s.kg} kg/m, A=${s.A} cm²)</option>`).join('');
      return `<optgroup label="${g.label}">${opts}</optgroup>`;
    }).join('');
  });

  // Purlin select
  const purlinEl = document.getElementById('trussSecPurlin');
  if (purlinEl) {
    const purlinSecs = TRUSS_SECTIONS_DB.filter(s => s.type === 'C' || s.type === 'RHS' || s.type === 'SHS');
    purlinEl.innerHTML = purlinSecs.map(s => `<option value="${s.id}">${s.name} (${s.kg} kg/m, Ix=${s.Ix} cm⁴)</option>`).join('');
  }

  // Column select
  const colEl = document.getElementById('trussSecCol');
  if (colEl) {
    const colSecs = TRUSS_SECTIONS_DB.filter(s => s.type === 'H' || (s.type === 'SHS' && s.d >= 100) || (s.type === 'CHS' && s.d >= 89));
    colEl.innerHTML = colSecs.map(s => `<option value="${s.id}">${s.name} (${s.kg} kg/m, r_min=${Math.min(s.rx, s.ry)} cm)</option>`).join('');
  }
}

function resetColumnGridMap(mode = 'default') {
  const N = Math.max(2, Math.round(trussState.bldgLength / trussState.baySpacing) + 1);
  trussState.numTrusses = N;
  trussState.columnGrid = {};
  for (let i = 1; i <= N; i++) {
    if (mode === 'clear') {
      trussState.columnGrid[`${i}_A`] = false;
      trussState.columnGrid[`${i}_B`] = false;
      trussState.columnGrid[`${i}_C`] = false;
    } else if (mode === 'skipB') {
      trussState.columnGrid[`${i}_A`] = true;
      trussState.columnGrid[`${i}_B`] = trussState.hasCenterCol ? (i % 2 === 1) : false;
      trussState.columnGrid[`${i}_C`] = true;
    } else {
      trussState.columnGrid[`${i}_A`] = true;
      trussState.columnGrid[`${i}_B`] = trussState.hasCenterCol;
      trussState.columnGrid[`${i}_C`] = true;
    }
  }
}

function toggleColumnGridPoint(trussIdx, axis) {
  if (axis === 'B' && !trussState.hasCenterCol) {
    trussState.hasCenterCol = true;
    const chk = document.getElementById('trussHasCenterCol');
    if (chk) chk.checked = true;
  }
  const key = `${trussIdx}_${axis}`;
  trussState.columnGrid[key] = !trussState.columnGrid[key];
  solveAndRenderTruss();
}

function setColumnGridBulk(action) {
  const N = trussState.numTrusses;
  if (action === 'default') {
    resetColumnGridMap('default');
  } else if (action === 'clear') {
    resetColumnGridMap('clear');
  } else if (action === 'skipB') {
    trussState.hasCenterCol = true;
    const chk = document.getElementById('trussHasCenterCol');
    if (chk) chk.checked = true;
    resetColumnGridMap('skipB');
  } else if (action === 'allA' || action === 'allB' || action === 'allC') {
    const ax = action.replace('all', '');
    if (ax === 'B') {
      trussState.hasCenterCol = true;
      const chk = document.getElementById('trussHasCenterCol');
      if (chk) chk.checked = true;
    }
    for (let i = 1; i <= N; i++) {
      trussState.columnGrid[`${i}_${ax}`] = true;
    }
  }
  solveAndRenderTruss();
}

function loadTrussPreset(presetKey) {
  const p = TRUSS_EDUCATIONAL_PRESETS[presetKey];
  if (!p) return;
  trussState.presetKey = presetKey;
  trussState.span = p.span;
  trussState.ridgeHeight = p.ridgeHeight;
  trussState.eaveHeight = p.eaveHeight;
  trussState.panels = p.panels;
  trussState.shape = p.shape;
  trussState.diagPattern = p.diagPattern;
  trussState.baySpacing = p.baySpacing;
  trussState.bldgLength = p.bldgLength;
  trussState.hasColumns = p.hasColumns;
  trussState.colHeight = p.colHeight;
  trussState.hasCenterCol = p.hasCenterCol;
  trussState.overhangLeft = p.overhangLeft || 0;
  trussState.overhangRight = p.overhangRight || 0;
  trussState.secTop = p.secTop;
  trussState.secBot = p.secBot;
  trussState.secDia = p.secDia;
  trussState.secVer = p.secVer;
  trussState.flippedDiags = {};

  resetColumnGridMap('default');
  syncTrussInputsFromState();
  solveAndRenderTruss();

  // Highlight active preset card
  document.querySelectorAll('.truss-template-card').forEach(card => {
    const k = card.getAttribute('data-truss-preset');
    if (k === presetKey) {
      card.classList.add('ring-2', 'ring-cyan-500', 'border-cyan-500', 'bg-cyan-500/10');
    } else {
      card.classList.remove('ring-2', 'ring-cyan-500', 'border-cyan-500', 'bg-cyan-500/10');
    }
  });

  if (typeof showNotification === 'function') {
    showNotification('โหลดแม่แบบโครงถักสำเร็จ', `${p.title} (${p.ref})`);
  }
}

function syncTrussInputsFromState() {
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };

  setVal('trussDesignMethod', trussState.designMethod);
  setVal('trussSteelGrade', trussState.steelGrade);
  setVal('trussBaySpacing', trussState.baySpacing);
  setVal('trussBldgLength', trussState.bldgLength);
  setVal('trussNumTrusses', trussState.numTrusses);
  setVal('trussOverhangLeft', trussState.overhangLeft);
  setVal('trussOverhangRight', trussState.overhangRight);

  setVal('trussSpan', trussState.span);
  setVal('trussRidgeHeight', trussState.ridgeHeight);
  setVal('trussEaveHeight', trussState.eaveHeight);
  setVal('trussPanels', trussState.panels);
  setVal('trussShape', trussState.shape);
  setVal('trussDiagPattern', trussState.diagPattern);

  setChk('trussHasColumns', trussState.hasColumns);
  setVal('trussColHeight', trussState.colHeight);
  setVal('trussSecCol', trussState.secCol);
  setChk('trussHasCenterCol', trussState.hasCenterCol);
  setVal('trussCenterColType', trussState.centerColType);

  setVal('trussDlRoof', trussState.dlRoof);
  setVal('trussLlRoof', trussState.llRoof);
  setChk('trussHasSolar', trussState.hasSolar);
  setVal('trussSolarLoad', trussState.solarLoad);
  setVal('trussSolarFrame', trussState.solarFrame);
  setChk('trussWindOn', trussState.windOn);
  setVal('trussWindZone', trussState.windZone);
  setVal('trussWindTerrain', trussState.windTerrain);
  setVal('trussWindCp', trussState.windCp);

  setVal('trussSecTop', trussState.secTop);
  setVal('trussSecBot', trussState.secBot);
  setVal('trussSecDia', trussState.secDia);
  setVal('trussSecVer', trussState.secVer);

  setVal('trussSecPurlin', trussState.secPurlin);
  setVal('trussPurlinSpacing', trussState.purlinSpacing);
  setVal('trussPurlinSag', trussState.purlinSagRods);
  setVal('trussPurlinCont', trussState.purlinContinuity);
  setVal('trussPurlinDefl', trussState.purlinDeflLimit);
}

function onTrussParamChange() {
  const getNum = (id, def) => {
    const el = document.getElementById(id);
    if (!el) return def;
    const v = parseFloat(el.value);
    return isNaN(v) ? def : v;
  };
  const getStr = (id, def) => {
    const el = document.getElementById(id);
    return el ? el.value : def;
  };
  const getChk = (id, def) => {
    const el = document.getElementById(id);
    return el ? el.checked : def;
  };

  trussState.designMethod = getStr('trussDesignMethod', 'ASD');
  trussState.steelGrade = getStr('trussSteelGrade', 'SS400');
  if (trussState.steelGrade === 'SS400') trussState.Fy = 2450;
  else if (trussState.steelGrade === 'SM490') trussState.Fy = 3250;
  else if (trussState.steelGrade === 'SM520') trussState.Fy = 3720;

  trussState.baySpacing = Math.max(1.0, getNum('trussBaySpacing', 4.0));
  trussState.bldgLength = Math.max(2.0, getNum('trussBldgLength', 24.0));
  const newN = Math.max(2, Math.round(trussState.bldgLength / trussState.baySpacing) + 1);
  const prevCenter = trussState.hasCenterCol;
  trussState.hasCenterCol = getChk('trussHasCenterCol', false);

  if (newN !== trussState.numTrusses || prevCenter !== trussState.hasCenterCol) {
    trussState.numTrusses = newN;
    const nInput = document.getElementById('trussNumTrusses');
    if (nInput) nInput.value = newN;
    resetColumnGridMap('default');
  }

  trussState.overhangLeft = Math.max(0, Math.min(4.0, getNum('trussOverhangLeft', 0)));
  trussState.overhangRight = Math.max(0, Math.min(4.0, getNum('trussOverhangRight', 0)));

  trussState.span = Math.max(4.0, Math.min(60.0, getNum('trussSpan', 12.0)));
  trussState.ridgeHeight = Math.max(0.4, Math.min(10.0, getNum('trussRidgeHeight', 1.8)));
  trussState.eaveHeight = Math.max(0.2, Math.min(8.0, getNum('trussEaveHeight', 0.5)));

  let rawPanels = Math.round(getNum('trussPanels', 8));
  if (rawPanels % 2 !== 0) rawPanels += 1;
  trussState.panels = Math.max(4, Math.min(20, rawPanels));

  trussState.shape = getStr('trussShape', 'triangular');
  trussState.diagPattern = getStr('trussDiagPattern', 'pratt');

  trussState.hasColumns = getChk('trussHasColumns', true);
  trussState.colHeight = Math.max(2.0, getNum('trussColHeight', 5.0));
  trussState.secCol = getStr('trussSecCol', 'H200x200x8x12');
  trussState.centerColType = getStr('trussCenterColType', 'roller');

  trussState.dlRoof = Math.max(5, getNum('trussDlRoof', 25));
  trussState.llRoof = Math.max(0, getNum('trussLlRoof', 50));
  trussState.hasSolar = getChk('trussHasSolar', true);
  trussState.solarLoad = Math.max(0, getNum('trussSolarLoad', 20));
  trussState.solarFrame = Math.max(0, getNum('trussSolarFrame', 8));

  trussState.windOn = getChk('trussWindOn', true);
  trussState.windZone = parseInt(getStr('trussWindZone', '1'), 10) || 1;
  trussState.windTerrain = getStr('trussWindTerrain', 'B');
  trussState.windCp = Math.max(0.1, getNum('trussWindCp', 0.9));

  trussState.secTop = getStr('trussSecTop', 'SHS75x75x3.2');
  trussState.secBot = getStr('trussSecBot', 'SHS75x75x3.2');
  trussState.secDia = getStr('trussSecDia', 'SHS50x50x2.3');
  trussState.secVer = getStr('trussSecVer', 'SHS50x50x2.3');

  trussState.secPurlin = getStr('trussSecPurlin', 'C125x50x20x2.3');
  trussState.purlinSpacing = Math.max(0.4, getNum('trussPurlinSpacing', 1.0));
  trussState.purlinSagRods = parseInt(getStr('trussPurlinSag', '1'), 10) || 0;
  trussState.purlinContinuity = getStr('trussPurlinCont', 'cont2');
  trussState.purlinDeflLimit = parseInt(getStr('trussPurlinDefl', '180'), 10) || 180;

  solveAndRenderTruss();
}

// ============================================================================
// 5. CORE STRUCTURAL TRUSS FEA & DESIGN SOLVER
// ============================================================================
function buildTrussGeometryAndSolve() {
  const L = trussState.span;
  const n = trussState.panels;
  const dx = L / n;
  const H_ridge = trussState.ridgeHeight;
  const H_eave = trussState.eaveHeight;
  const shape = trussState.shape;
  const pattern = trussState.diagPattern;

  const nodes = [];
  const members = [];

  // Helper to compute top & bottom chord y at x in [0, L]
  function getChordY(x) {
    const u = x / L; // 0..1
    const sym = 1 - Math.abs(2 * u - 1); // 0 at ends, 1 at midspan
    let yBot = 0;
    let yTop = H_eave + (H_ridge - H_eave) * sym;

    if (shape === 'flat') {
      yTop = H_ridge;
      yBot = 0;
    } else if (shape === 'triangular-inv') {
      // Inverted V (Butterfly): high at eaves, low at center
      const hi = Math.max(H_eave, H_ridge);
      const lo = Math.min(H_eave, H_ridge);
      yTop = hi - (hi - lo) * sym;
      yBot = 0;
    } else if (shape === 'bowstring') {
      // Curved top chord (parabolic arch), flat bottom chord
      const parabola = 4 * u * (1 - u);
      yTop = H_eave + (H_ridge - H_eave) * parabola;
      yBot = 0;
    } else if (shape === 'parabolic') {
      // Parabolic vault: both top and bottom chords curve upward
      const parabola = 4 * u * (1 - u);
      yBot = 0.45 * H_ridge * parabola;
      const depth = H_eave + (H_ridge - H_eave) * 0.45 * parabola;
      yTop = yBot + Math.max(0.45, depth);
    } else if (shape === 'circular') {
      const parabola = Math.sin(Math.PI * u);
      yBot = 0.35 * H_ridge * parabola;
      yTop = yBot + H_eave + (H_ridge - H_eave) * 0.5 * parabola;
    }
    return { yBot, yTop };
  }

  // Create Bottom Chord Nodes B0..Bn (indices 0..n)
  for (let i = 0; i <= n; i++) {
    const x = i * dx;
    const { yBot } = getChordY(x);
    nodes.push({
      id: i,
      label: `B${i}`,
      group: 'bot',
      panelIdx: i,
      x: +x.toFixed(4),
      y: +yBot.toFixed(4)
    });
  }

  // Create Top Chord Nodes T0..Tn (indices n+1 .. 2n+1)
  for (let i = 0; i <= n; i++) {
    const x = i * dx;
    const { yTop } = getChordY(x);
    nodes.push({
      id: (n + 1) + i,
      label: `T${i}`,
      group: 'top',
      panelIdx: i,
      x: +x.toFixed(4),
      y: +yTop.toFixed(4)
    });
  }

  const bNode = (i) => i;
  const tNode = (i) => (n + 1) + i;

  let mId = 1;
  function addMem(n1, n2, group, label, panelIdx = -1) {
    const nodeA = nodes[n1];
    const nodeB = nodes[n2];
    const len = Math.hypot(nodeB.x - nodeA.x, nodeB.y - nodeA.y);
    members.push({
      id: mId++,
      n1,
      n2,
      group, // 'TC', 'BC', 'V', 'D'
      label,
      panelIdx,
      length: len
    });
  }

  // 1. Bottom Chord Members BC1..BCn
  for (let i = 0; i < n; i++) {
    addMem(bNode(i), bNode(i + 1), 'BC', `BC${i + 1}`, i);
  }

  // 2. Top Chord Members TC1..TCn
  for (let i = 0; i < n; i++) {
    addMem(tNode(i), tNode(i + 1), 'TC', `TC${i + 1}`, i);
  }

  // 3. Verticals V0..Vn
  for (let i = 0; i <= n; i++) {
    if (pattern === 'warren-pure' && i > 0 && i < n && i !== n / 2) {
      continue; // Pure warren skips internal verticals except center/ends
    }
    addMem(bNode(i), tNode(i), 'V', `V${i}`, i);
  }

  // 4. Diagonals D1..Dn
  const half = n / 2;
  for (let i = 0; i < n; i++) {
    const flipped = !!trussState.flippedDiags[i];
    if (pattern === 'x-brace') {
      addMem(bNode(i), tNode(i + 1), 'D', `D${i + 1}a`, i);
      addMem(tNode(i), bNode(i + 1), 'D', `D${i + 1}b`, i);
      continue;
    }

    let slashUpRight = true; // true: B_i -> T_{i+1}, false: T_i -> B_{i+1}
    if (pattern === 'pratt') {
      // Pratt: diagonals slope down toward center (T_i -> B_{i+1} on left, B_i -> T_{i+1} on right)
      slashUpRight = (i >= half);
    } else if (pattern === 'howe') {
      // Howe: diagonals slope up toward center (B_i -> T_{i+1} on left, T_i -> B_{i+1} on right)
      slashUpRight = (i < half);
    } else if (pattern === 'warren' || pattern === 'warren-pure') {
      slashUpRight = (i % 2 === 0);
    }

    if (flipped) slashUpRight = !slashUpRight;

    if (slashUpRight) {
      addMem(bNode(i), tNode(i + 1), 'D', `D${i + 1}`, i);
    } else {
      addMem(tNode(i), bNode(i + 1), 'D', `D${i + 1}`, i);
    }
  }

  // Estimate roof slope angle theta
  const avgSlopeRad = Math.atan2(Math.abs(H_ridge - H_eave), L / 2);
  const avgSlopeDeg = avgSlopeRad * (180 / Math.PI);

  // Calculate Loads per m² (Horizontal projection)
  const dlRoof = trussState.dlRoof / Math.cos(avgSlopeRad); // sloped roof weight projected to plan
  const solarTotal = trussState.hasSolar ? (trussState.solarLoad + trussState.solarFrame) : 0;
  const llRoof = trussState.llRoof;

  // Estimate Truss + Purlin self-weight (kg/m²)
  const secTC = getTrussSec(trussState.secTop);
  const secBC = getTrussSec(trussState.secBot);
  const secDia = getTrussSec(trussState.secDia);
  const secVer = getTrussSec(trussState.secVer);
  const secPur = getTrussSec(trussState.secPurlin);

  let trussSteelWeightKg = 0;
  members.forEach(m => {
    const s = m.group === 'TC' ? secTC : m.group === 'BC' ? secBC : m.group === 'V' ? secVer : secDia;
    m.section = s;
    m.weightKg = m.length * s.kg;
    trussSteelWeightKg += m.weightKg;
  });

  const selfWeightPerM2 = (trussSteelWeightKg / (L * trussState.baySpacing)) + (secPur.kg / trussState.purlinSpacing);
  const totalDL_m2 = dlRoof + solarTotal + selfWeightPerM2;

  // Wind Load Calculation per มยผ. 1311-50
  const V50_map = { 1: 25, 2: 27, 3: 29, 4: 30 };
  const V50 = V50_map[trussState.windZone] || 25;
  const zWind = Math.max(4.0, trussState.colHeight + H_ridge);
  const Ce = trussState.windTerrain === 'A'
    ? Math.pow(zWind / 10, 0.28) * 1.15
    : Math.pow(zWind / 10, 0.40) * 0.92;
  const qz_Pa = 0.5 * 1.25 * V50 * V50 * Ce * 1.0; // Pa (N/m²)
  const qz_kgm2 = qz_Pa / 9.80665;
  const windUplift_m2 = trussState.windOn ? (qz_kgm2 * trussState.windCp) : 0;

  // Factored / Allowable Load Combinations (kg/m²)
  const isLRFD = trussState.designMethod === 'LRFD';
  const qGravity_m2 = isLRFD
    ? (1.2 * totalDL_m2 + 1.6 * llRoof)
    : (totalDL_m2 + llRoof);

  // Net uplift (positive = upward suction exceeding dead load)
  const qUpliftNet_m2 = trussState.windOn
    ? (isLRFD ? (0.9 * totalDL_m2 - 1.6 * windUplift_m2) : (0.6 * totalDL_m2 - windUplift_m2))
    : qGravity_m2;

  // Line load along truss w (kg/m)
  const wGravity = qGravity_m2 * trussState.baySpacing;
  const wUplift = qUpliftNet_m2 * trussState.baySpacing; // negative means net upward force!

  // Solve 2D Pin-Jointed Truss via Direct Stiffness Method for a given line load w (kg/m downward positive)
  function solveFEAForLineLoad(wLine) {
    const numNodes = nodes.length;
    const ndof = numNodes * 2;
    const K = Array.from({ length: ndof }, () => new Float64Array(ndof));
    const F = new Float64Array(ndof);

    // Apply tributary nodal loads at Top Chord joints T0..Tn
    for (let i = 0; i <= n; i++) {
      const tribDx = (i === 0 || i === n) ? (dx / 2) : dx;
      const P_down = wLine * tribDx; // kg
      const tIdx = tNode(i);
      F[2 * tIdx + 1] -= P_down; // -y is downward
    }

    // Assemble Truss Member Stiffness (EA/L)
    const E_ksc = trussState.E; // kg/cm²
    members.forEach(m => {
      const nA = nodes[m.n1];
      const nB = nodes[m.n2];
      const L_cm = m.length * 100;
      const c = (nB.x - nA.x) / m.length;
      const s = (nB.y - nA.y) / m.length;
      const kVal = (E_ksc * m.section.A) / L_cm; // kg/cm

      const idx = [2 * m.n1, 2 * m.n1 + 1, 2 * m.n2, 2 * m.n2 + 1];
      const ke = [
        [ c * c,  c * s, -c * c, -c * s],
        [ c * s,  s * s, -c * s, -s * s],
        [-c * c, -c * s,  c * c,  c * s],
        [-c * s, -s * s,  c * s,  s * s]
      ];
      for (let r = 0; r < 4; r++) {
        for (let col = 0; col < 4; col++) {
          K[idx[r]][idx[col]] += kVal * ke[r][col];
        }
      }
    });

    // Small diagonal stabilization for collinear nodes
    for (let d = 0; d < ndof; d++) {
      K[d][d] += 1e-4;
    }

    // Boundary Conditions:
    // Left support B0: Pin (ux=0, uy=0)
    // Right support Bn: Roller (uy=0)
    // Optional Center support B_{n/2}: Roller (uy=0) or Pin (ux=0, uy=0)
    const fixedDofs = new Set([0, 1, 2 * bNode(n) + 1]);
    if (trussState.hasCenterCol) {
      const midIdx = bNode(Math.floor(n / 2));
      fixedDofs.add(2 * midIdx + 1);
      if (trussState.centerColType === 'pin') {
        fixedDofs.add(2 * midIdx);
      }
    }

    const freeDofs = [];
    for (let d = 0; d < ndof; d++) {
      if (!fixedDofs.has(d)) freeDofs.push(d);
    }

    // Gaussian Elimination on freeDofs
    const mSize = freeDofs.length;
    const A_mat = Array.from({ length: mSize }, (_, r) => {
      const row = new Float64Array(mSize + 1);
      for (let c = 0; c < mSize; c++) {
        row[c] = K[freeDofs[r]][freeDofs[c]];
      }
      row[mSize] = F[freeDofs[r]];
      return row;
    });

    for (let i = 0; i < mSize; i++) {
      let maxRow = i;
      for (let k = i + 1; k < mSize; k++) {
        if (Math.abs(A_mat[k][i]) > Math.abs(A_mat[maxRow][i])) maxRow = k;
      }
      const tmp = A_mat[i]; A_mat[i] = A_mat[maxRow]; A_mat[maxRow] = tmp;
      const piv = A_mat[i][i];
      if (Math.abs(piv) < 1e-12) continue;
      for (let k = i + 1; k < mSize; k++) {
        const factor = A_mat[k][i] / piv;
        for (let j = i; j <= mSize; j++) {
          A_mat[k][j] -= factor * A_mat[i][j];
        }
      }
    }

    const uFree = new Float64Array(mSize);
    for (let i = mSize - 1; i >= 0; i--) {
      let sum = A_mat[i][mSize];
      for (let j = i + 1; j < mSize; j++) {
        sum -= A_mat[i][j] * uFree[j];
      }
      uFree[i] = Math.abs(A_mat[i][i]) > 1e-12 ? (sum / A_mat[i][i]) : 0;
    }

    const U = new Float64Array(ndof);
    for (let i = 0; i < mSize; i++) {
      U[freeDofs[i]] = uFree[i]; // in cm
    }

    // Compute Member Axial Forces (positive = Tension, negative = Compression)
    const memberForces = members.map(m => {
      const nA = nodes[m.n1];
      const nB = nodes[m.n2];
      const L_cm = m.length * 100;
      const c = (nB.x - nA.x) / m.length;
      const s = (nB.y - nA.y) / m.length;
      const du = (U[2 * m.n2] - U[2 * m.n1]) * c + (U[2 * m.n2 + 1] - U[2 * m.n1 + 1]) * s;
      const axialKg = ((E_ksc * m.section.A) / L_cm) * du;
      return axialKg;
    });

    // Compute Support Vertical Reactions (kg, upward positive)
    const totalDownLoad = wLine * L;
    let RA = totalDownLoad / 2;
    let RB = totalDownLoad / 2;
    let RM = 0;
    if (trussState.hasCenterCol) {
      // 2-span continuous reaction distribution (3/16 W, 10/16 W, 3/16 W)
      RA = 0.1875 * totalDownLoad;
      RM = 0.6250 * totalDownLoad;
      RB = 0.1875 * totalDownLoad;
    }

    // Max nodal vertical deflection (mm)
    let maxDeflMm = 0;
    for (let i = 0; i < numNodes; i++) {
      const dyMm = Math.abs(U[2 * i + 1]) * 10;
      if (dyMm > maxDeflMm) maxDeflMm = dyMm;
    }

    return { U, memberForces, RA, RB, RM, totalDownLoad, maxDeflMm };
  }

  const gravRes = solveFEAForLineLoad(wGravity);
  const upliftRes = solveFEAForLineLoad(wUplift);

  // Per-Member Capacity Check (EIT 1009-34 ASD / EIT 1010-50 LRFD)
  const Fy = trussState.Fy;
  const E = trussState.E;
  const Cc = Math.sqrt((2 * Math.PI * Math.PI * E) / Fy);

  let passCount = 0;
  let maxRatio = 0;

  members.forEach((m, idx) => {
    const fGrav = gravRes.memberForces[idx];     // +Tension, -Compression (kg)
    const fUplift = upliftRes.memberForces[idx]; // +Tension, -Compression (kg)

    m.fGrav = fGrav;
    m.fUplift = fUplift;

    // Critical tension and critical compression across both load cases
    const maxTension = Math.max(0, fGrav, fUplift);
    const maxComp = Math.max(0, -fGrav, -fUplift);

    // Dominant force for display
    m.force = Math.abs(fGrav) >= Math.abs(fUplift) ? fGrav : fUplift;

    const L_cm = m.length * 100;
    const rMin = Math.min(m.section.rx, m.section.ry);
    const KLr = L_cm / rMin;
    m.KLr = KLr;

    // Allowable / Design Tensile Stress (ksc)
    const Ft_ksc = isLRFD ? (0.90 * Fy) : (0.60 * Fy);
    const capTensionKg = Ft_ksc * m.section.A;

    // Allowable / Design Compressive Stress (ksc)
    let Fa_ksc = 0;
    if (isLRFD) {
      const Fe = (Math.PI * Math.PI * E) / (KLr * KLr);
      const Fcr = (KLr <= 4.71 * Math.sqrt(E / Fy))
        ? (Math.pow(0.658, Fy / Fe) * Fy)
        : (0.877 * Fe);
      Fa_ksc = 0.90 * Fcr;
    } else {
      if (KLr <= Cc) {
        const ratio = KLr / Cc;
        const FS = (5 / 3) + (3 / 8) * ratio - (1 / 8) * Math.pow(ratio, 3);
        Fa_ksc = ((1 - 0.5 * ratio * ratio) * Fy) / FS;
      } else {
        Fa_ksc = (12 * Math.PI * Math.PI * E) / (23 * KLr * KLr);
      }
    }
    const capCompKg = Fa_ksc * m.section.A;

    const ratioT = capTensionKg > 0 ? (maxTension / capTensionKg) : 0;
    const ratioC = capCompKg > 0 ? (maxComp / capCompKg) : 0;
    const slendernessLimit = maxComp > maxTension ? 200 : 300;
    const slendernessPenalty = KLr > slendernessLimit ? (KLr / slendernessLimit) : 0;

    m.capTensionKg = capTensionKg;
    m.capCompKg = capCompKg;
    m.Fa_ksc = Fa_ksc;
    m.Ft_ksc = Ft_ksc;
    m.ratio = Math.max(ratioT, ratioC, slendernessPenalty * 0.85);
    m.status = (m.ratio <= 1.0 && KLr <= slendernessLimit) ? 'PASS' : 'FAIL';

    if (m.status === 'PASS') passCount++;
    if (m.ratio > maxRatio) maxRatio = m.ratio;
  });

  // Global Shear V(x) and Moment M(x) sampling
  const samples = [];
  const numSamples = 60;
  let maxGlobalV = 0;
  let maxGlobalM = 0;
  for (let i = 0; i <= numSamples; i++) {
    const x = (i / numSamples) * L;
    let V = 0;
    let M = 0;
    if (!trussState.hasCenterCol) {
      V = gravRes.RA - wGravity * x;
      M = gravRes.RA * x - 0.5 * wGravity * x * x;
    } else {
      const halfL = L / 2;
      if (x <= halfL) {
        V = gravRes.RA - wGravity * x;
        M = gravRes.RA * x - 0.5 * wGravity * x * x;
      } else {
        V = gravRes.RA + gravRes.RM - wGravity * x;
        M = gravRes.RA * x + gravRes.RM * (x - halfL) - 0.5 * wGravity * x * x;
      }
    }
    if (Math.abs(V) > maxGlobalV) maxGlobalV = Math.abs(V);
    if (Math.abs(M) > maxGlobalM) maxGlobalM = Math.abs(M);
    samples.push({ x, V, M });
  }

  trussSolution = {
    nodes,
    members,
    avgSlopeDeg,
    avgSlopeRad,
    dlRoof,
    solarTotal,
    llRoof,
    selfWeightPerM2,
    totalDL_m2,
    V50,
    Ce,
    qz_Pa,
    qz_kgm2,
    windUplift_m2,
    qGravity_m2,
    qUpliftNet_m2,
    wGravity,
    wUplift,
    gravRes,
    upliftRes,
    trussSteelWeightKg,
    passCount,
    maxRatio,
    samples,
    maxGlobalV,
    maxGlobalM
  };

  return trussSolution;
}

// ============================================================================
// 6. MASTER RENDER CONTROLLER FOR TRUSS WORKSPACE
// ============================================================================
function solveAndRenderTruss() {
  buildTrussGeometryAndSolve();
  updateTrussTopBadgesAndSummary();
  renderTrussActiveSubTab();
  if (typeof populateTrussCalculationReport === 'function') {
    populateTrussCalculationReport();
  }
}

function switchTrussSubTab(tabName) {
  trussState.activeSubTab = tabName;
  const allTabs = ['grid', 'truss2d', 'truss3d', 'fbd', 'forces', 'shear', 'moment', 'sections', 'wind', 'purlin', 'formulas'];
  allTabs.forEach(t => {
    const btn = document.getElementById(`btnTrussTab_${t}`);
    const pane = document.getElementById(`paneTruss_${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-cyan-400 text-cyan-400 bg-cyan-500/10 flex items-center space-x-1.5 whitespace-nowrap transition';
      } else {
        btn.className = 'px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 whitespace-nowrap transition';
      }
    }
    if (pane) {
      if (t === tabName) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
  });
  renderTrussActiveSubTab();
}

function renderTrussActiveSubTab() {
  if (!trussSolution) buildTrussGeometryAndSolve();
  const t = trussState.activeSubTab;
  if (t === 'grid') renderTrussColumnGridTab();
  else if (t === 'truss2d') renderTruss2DBlueprintTab();
  else if (t === 'truss3d') renderTruss3DViewerTab();
  else if (t === 'fbd') renderTrussFBDTab();
  else if (t === 'forces') renderTrussForcesTab();
  else if (t === 'shear') renderTrussShearTab();
  else if (t === 'moment') renderTrussMomentTab();
  else if (t === 'sections') renderTrussSectionsTab();
  else if (t === 'wind') renderTrussWindTab();
  else if (t === 'purlin') renderTrussPurlinTab();
  else if (t === 'formulas') renderTrussFormulasTab();
}

function updateTrussTopBadgesAndSummary() {
  const s = trussSolution;
  if (!s) return;

  const setTxt = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  setTxt('trussChipMethod', `🇹🇭 มาตรฐานไทย • <b>${trussState.designMethod}</b>`);
  setTxt('trussChipSteel', `เหล็ก: <b>${trussState.steelGrade}</b> (Fy=${trussState.Fy.toLocaleString()} ksc)`);
  setTxt('trussChipLoads', `DL/LL: <b>${trussState.dlRoof}/${trussState.llRoof}</b> kg/m²`);
  setTxt('trussChipSolar', trussState.hasSolar ? `☀ Solar: <b>${s.solarTotal} kg/m²</b>` : `☀ Solar: ปิด`);
  setTxt('trussChipWind', trussState.windOn ? `🌬 ลมโซน ${trussState.windZone}: <b>-${s.windUplift_m2.toFixed(0)} kg/m²</b>` : `🌬 ลม: ปิด`);
  setTxt('trussChipGeom', `Span: <b>L=${trussState.span}m</b> • s=${trussState.baySpacing}m • N=${trussState.numTrusses}`);

  const allPass = s.passCount === s.members.length;
  setTxt('trussVerdictBadge', allPass
    ? `<span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs">✓ ผ่านทุกชิ้นส่วน (${s.passCount}/${s.members.length}) • Ratio สูงสุด ${s.maxRatio.toFixed(2)}</span>`
    : `<span class="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs">⚠ ไม่ผ่าน ${s.members.length - s.passCount} ชิ้น • Ratio สูงสุด ${s.maxRatio.toFixed(2)}</span>`
  );

  // Summary Chips at bottom
  const chipsContainer = document.getElementById('trussSummaryChips');
  if (chipsContainer) {
    const items = [
      { lbl: 'ช่วงพาด (Span L)', val: `${trussState.span.toFixed(1)} m` },
      { lbl: 'ความลึกยอด/ชายคา', val: `${trussState.ridgeHeight.toFixed(2)} / ${trussState.eaveHeight.toFixed(2)} m` },
      { lbl: 'มุมลาดหลังคา (θ)', val: `${s.avgSlopeDeg.toFixed(1)}°` },
      { lbl: 'จำนวนช่อง (Panels)', val: `${trussState.panels} ช่อง` },
      { lbl: 'ระยะห่างทรัส × จำนวน', val: `${trussState.baySpacing} m × ${trussState.numTrusses} ตัว` },
      { lbl: 'น้ำหนักรวมออกแบบ (q)', val: `${s.qGravity_m2.toFixed(1)} kg/m²` },
      { lbl: 'แรงปฏิกิริยา RA / RB', val: `${(s.gravRes.RA / 1000).toFixed(2)} ตัน` },
      { lbl: 'น้ำหนักเหล็ก 1 โครงทรัส', val: `${s.trussSteelWeightKg.toFixed(1)} kg` },
      { lbl: 'การแอ่นตัวสูงสุด (δ)', val: `${s.gravRes.maxDeflMm.toFixed(2)} mm` },
      { lbl: 'อัตราส่วนกำลังสูงสุด', val: `${s.maxRatio.toFixed(2)} (${allPass ? 'OK' : 'NG'})` }
    ];
    chipsContainer.innerHTML = items.map(it => `
      <div class="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs flex items-center space-x-2">
        <span class="text-slate-400">${it.lbl}:</span>
        <span class="font-mono font-bold text-cyan-300">${it.val}</span>
      </div>
    `).join('');
  }
}

// ============================================================================
// 7. SUB-TAB 1: COLUMN GRID (ผังเสา A/B/C x 1..N)
// ============================================================================
function renderTrussColumnGridTab() {
  const s = trussSolution;
  const container = document.getElementById('trussColumnGridSvgWrap');
  const tableEl = document.getElementById('trussColumnGridSummary');
  if (!container || !s) return;

  const N = trussState.numTrusses;
  const axes = ['A', 'B', 'C'];
  const W = Math.max(760, N * 95 + 160);
  const H = 260;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto select-none">`;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#09101f" />`;

  const leftPad = 95;
  const topPad = 52;
  const rowH = 68;
  const colW = (W - leftPad - 50) / Math.max(1, N - 1);

  // Draw longitudinal axis lines A, B, C
  axes.forEach((ax, rIdx) => {
    const y = topPad + rIdx * rowH;
    const isAxisActive = (ax !== 'B') || trussState.hasCenterCol;
    svg += `<line x1="${leftPad - 25}" y1="${y}" x2="${W - 30}" y2="${y}" stroke="${isAxisActive ? '#334155' : '#1e293b'}" stroke-width="1.5" stroke-dasharray="6,4" />`;
    svg += `<circle cx="38" cy="${y}" r="15" fill="${ax === 'B' ? '#0e7490' : '#1e293b'}" stroke="#22d3ee" stroke-width="1.5" />`;
    svg += `<text x="38" y="${y + 4}" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">${ax}</text>`;
    svg += `<text x="64" y="${y + 4}" fill="#94a3b8" font-size="10">${ax === 'A' ? 'ซ้าย' : ax === 'B' ? 'กลาง' : 'ขวา'}</text>`;
  });

  // Draw transverse truss lines 1..N and interactive column nodes
  for (let i = 1; i <= N; i++) {
    const x = leftPad + (i - 1) * colW;
    svg += `<line x1="${x}" y1="${topPad - 18}" x2="${x}" y2="${topPad + 2 * rowH + 18}" stroke="#1e293b" stroke-width="1.5" />`;
    svg += `<text x="${x}" y="26" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">T-${i}</text>`;
    if (i < N) {
      svg += `<text x="${x + colW / 2}" y="${H - 14}" text-anchor="middle" fill="#64748b" font-size="10">${trussState.baySpacing} m</text>`;
    }

    axes.forEach((ax, rIdx) => {
      const y = topPad + rIdx * rowH;
      const hasCol = !!trussState.columnGrid[`${i}_${ax}`];
      const fill = hasCol ? (ax === 'B' ? '#f59e0b' : '#10b981') : '#0f172a';
      const stroke = hasCol ? '#ffffff' : '#475569';
      svg += `
        <g class="cursor-pointer" onclick="toggleColumnGridPoint(${i}, '${ax}')">
          <rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2" />
          <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${hasCol ? '#090d16' : '#64748b'}" font-size="10" font-weight="bold">
            ${hasCol ? `${i}${ax}` : '—'}
          </text>
        </g>
      `;
    });
  }

  svg += `</svg>`;
  container.innerHTML = svg;

  // Summarize active columns & reactions
  let countA = 0, countB = 0, countC = 0;
  for (let i = 1; i <= N; i++) {
    if (trussState.columnGrid[`${i}_A`]) countA++;
    if (trussState.columnGrid[`${i}_B`]) countB++;
    if (trussState.columnGrid[`${i}_C`]) countC++;
  }
  if (tableEl) {
    tableEl.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div class="text-slate-400">แกนเสา A (ด้านซ้าย)</div>
          <div class="text-base font-bold text-emerald-400 font-mono mt-0.5">${countA} / ${N} ต้น • R_A = ${(s.gravRes.RA).toFixed(0)} kg/ต้น</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div class="text-slate-400">แกนเสา B (เสากลาง Center Column)</div>
          <div class="text-base font-bold text-amber-400 font-mono mt-0.5">${trussState.hasCenterCol ? `${countB} / ${N} ต้น • R_M = ${s.gravRes.RM.toFixed(0)} kg/ต้น` : 'ปิดใช้งาน (Single Span)'}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div class="text-slate-400">แกนเสา C (ด้านขวา)</div>
          <div class="text-base font-bold text-emerald-400 font-mono mt-0.5">${countC} / ${N} ต้น • R_B = ${(s.gravRes.RB).toFixed(0)} kg/ต้น</div>
        </div>
      </div>
    `;
  }
}

// ============================================================================
// 8. SUB-TAB 2: TRUSS 2D INTERACTIVE BLUEPRINT (แผนภาพโครงถัก 2D)
// ============================================================================
function flipTrussDiagonal(panelIdx) {
  if (panelIdx < 0) return;
  trussState.flippedDiags[panelIdx] = !trussState.flippedDiags[panelIdx];
  solveAndRenderTruss();
}

function renderTruss2DBlueprintTab() {
  const s = trussSolution;
  const wrap = document.getElementById('truss2DSvgContainer');
  if (!wrap || !s) return;

  const W = 1100;
  const H = 430;
  const padX = 95;
  const padY = 75;
  const L = trussState.span;
  const maxY = Math.max(trussState.ridgeHeight, trussState.eaveHeight, 1.5);

  const scaleX = (W - 2 * padX) / L;
  const scaleY = Math.min(scaleX * 1.15, (H - 2 * padY) / (maxY + 0.6));

  const toX = (x) => padX + x * scaleX;
  const toY = (y) => (H - padY) - y * scaleY;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto select-none">`;
  // Engineering grid background
  svg += `
    <defs>
      <pattern id="truss2dGrid" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" rx="16" fill="#070d19" />
    <rect width="${W}" height="${H}" rx="16" fill="url(#truss2dGrid)" />
  `;

  // Legend top right
  svg += `
    <g transform="translate(${W - 240}, 20)">
      <rect x="0" y="0" width="220" height="72" rx="10" fill="rgba(15,23,42,0.9)" stroke="#1e293b"/>
      <line x1="14" y1="18" x2="40" y2="18" stroke="#22d3ee" stroke-width="3.5"/>
      <text x="48" y="22" fill="#cbd5e1" font-size="11">Top / Bottom Chord (TC, BC)</text>
      <line x1="14" y1="38" x2="40" y2="38" stroke="#a78bfa" stroke-width="2.5"/>
      <text x="48" y="42" fill="#cbd5e1" font-size="11">Vertical Member (V)</text>
      <line x1="14" y1="56" x2="40" y2="56" stroke="#f472b6" stroke-width="2.5"/>
      <text x="48" y="60" fill="#cbd5e1" font-size="11">Diagonal (คลิกเพื่อสลับฝั่ง ⇆)</text>
    </g>
  `;

  // Draw Support Icons at B0, Bn, and optional B_{n/2}
  const n = trussState.panels;
  const nLeft = s.nodes[0];
  const nRight = s.nodes[n];

  // Pin at B0
  const lx = toX(nLeft.x), ly = toY(nLeft.y);
  svg += `<polygon points="${lx},${ly} ${lx - 13},${ly + 20} ${lx + 13},${ly + 20}" fill="none" stroke="#22d3ee" stroke-width="2.2"/>`;
  svg += `<text x="${lx}" y="${ly + 34}" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="bold">Pin (A)</text>`;

  // Roller at Bn
  const rx = toX(nRight.x), ry = toY(nRight.y);
  svg += `<polygon points="${rx},${ry} ${rx - 13},${ry + 17} ${rx + 13},${ry + 17}" fill="none" stroke="#22d3ee" stroke-width="2.2"/>`;
  svg += `<circle cx="${rx - 6}" cy="${ry + 22}" r="3.5" fill="none" stroke="#22d3ee" stroke-width="1.8"/>`;
  svg += `<circle cx="${rx + 6}" cy="${ry + 22}" r="3.5" fill="none" stroke="#22d3ee" stroke-width="1.8"/>`;
  svg += `<text x="${rx}" y="${ry + 36}" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="bold">Roller (C)</text>`;

  // Optional Center Column at B_{n/2}
  if (trussState.hasCenterCol) {
    const nMid = s.nodes[Math.floor(n / 2)];
    const mx = toX(nMid.x), my = toY(nMid.y);
    svg += `<polygon points="${mx},${my} ${mx - 13},${my + 18} ${mx + 13},${my + 18}" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" stroke-width="2.2"/>`;
    svg += `<text x="${mx}" y="${my + 33}" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Center Col (B)</text>`;
  }

  // Draw Members
  s.members.forEach(m => {
    const nA = s.nodes[m.n1];
    const nB = s.nodes[m.n2];
    const x1 = toX(nA.x), y1 = toY(nA.y);
    const x2 = toX(nB.x), y2 = toY(nB.y);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

    let color = '#22d3ee';
    let sw = 3.6;
    if (m.group === 'V') { color = '#a78bfa'; sw = 2.4; }
    if (m.group === 'D') { color = '#f472b6'; sw = 2.4; }

    const clickAttr = m.group === 'D' ? `onclick="flipTrussDiagonal(${m.panelIdx})" class="cursor-pointer hover:opacity-80"` : '';
    svg += `<g ${clickAttr}>`;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
    svg += `<text x="${mx}" y="${my - 5}" text-anchor="middle" fill="#cbd5e1" font-size="10" font-family="JetBrains Mono,monospace">${m.label}</text>`;
    svg += `</g>`;
  });

  // Draw Joints
  s.nodes.forEach(nd => {
    const cx = toX(nd.x), cy = toY(nd.y);
    svg += `<circle cx="${cx}" cy="${cy}" r="4.2" fill="#09101f" stroke="#e2e8f0" stroke-width="2"/>`;
    const dy = nd.group === 'top' ? -11 : 16;
    svg += `<text x="${cx}" y="${cy + dy}" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600">${nd.label}</text>`;
  });

  // Dimension Line at bottom
  const dimY = H - 22;
  svg += `<line x1="${lx}" y1="${dimY}" x2="${rx}" y2="${dimY}" stroke="#64748b" stroke-width="1.5"/>`;
  svg += `<text x="${(lx + rx) / 2}" y="${dimY - 6}" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="bold">L = ${L.toFixed(2)} m (${n} Panels @ ${(L / n).toFixed(2)} m)</text>`;

  // Ridge height annotation
  const midTop = s.nodes[(n + 1) + Math.floor(n / 2)];
  const midBot = s.nodes[Math.floor(n / 2)];
  const rtx = toX(midTop.x), rty = toY(midTop.y), rby = toY(midBot.y);
  svg += `<line x1="${rtx - 18}" y1="${rty}" x2="${rtx - 18}" y2="${rby}" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3"/>`;
  svg += `<text x="${rtx - 24}" y="${(rty + rby) / 2}" text-anchor="end" fill="#38bdf8" font-size="11" font-weight="bold">h = ${(midTop.y - midBot.y).toFixed(2)} m</text>`;
  svg += `<text x="${rtx}" y="${rty - 24}" text-anchor="middle" fill="#22d3ee" font-size="11" font-weight="bold">ความชันเฉลี่ย θ = ${s.avgSlopeDeg.toFixed(1)}°</text>`;

  svg += `</svg>`;
  wrap.innerHTML = svg;
}

// ============================================================================
// 9. SUB-TAB 3: 3D INTERACTIVE BUILDING & ROOF TRUSS VIEWER (มุมมอง 3 มิติ)
// ============================================================================
let truss3DCam = {
  yaw: -0.62,
  pitch: 0.32,
  zoom: 1.0,
  panX: 0,
  panY: 15,
  isDragging: false,
  dragMode: 'orbit',
  lastX: 0,
  lastY: 0
};

function setTruss3DCameraPreset(preset) {
  if (preset === 'iso') {
    truss3DCam.yaw = -0.65; truss3DCam.pitch = 0.34; truss3DCam.zoom = 1.0; truss3DCam.panX = 0; truss3DCam.panY = 15;
  } else if (preset === 'front') {
    truss3DCam.yaw = 0.0; truss3DCam.pitch = 0.08; truss3DCam.zoom = 1.15; truss3DCam.panX = 0; truss3DCam.panY = 20;
  } else if (preset === 'side') {
    truss3DCam.yaw = -Math.PI / 2; truss3DCam.pitch = 0.08; truss3DCam.zoom = 1.05; truss3DCam.panX = 0; truss3DCam.panY = 20;
  } else if (preset === 'top') {
    truss3DCam.yaw = 0.0; truss3DCam.pitch = 1.42; truss3DCam.zoom = 0.95; truss3DCam.panX = 0; truss3DCam.panY = 0;
  } else if (preset === 'fit') {
    truss3DCam.zoom = 1.0; truss3DCam.panX = 0; truss3DCam.panY = 15;
  }
  renderTruss3DViewerTab();
}

function onTruss3DOptionToggle() {
  const getChk = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };
  trussState.view3DAllBuilding = getChk('chkTruss3DAll');
  trussState.view3DPurlin = getChk('chkTruss3DPurlin');
  trussState.view3DRoof = getChk('chkTruss3DRoof');
  trussState.view3DPassFail = getChk('chkTruss3DPassFail');
  trussState.view3DTensionComp = getChk('chkTruss3DTenComp');
  trussState.view3DGrid = getChk('chkTruss3DGrid');
  renderTruss3DViewerTab();
}

function toggleTrussMobileParamsDrawer() {
  const aside = document.getElementById('trussSidebarAside');
  const lbl = document.getElementById('lblTrussMobileDrawer');
  if (!aside) return;
  const isHidden = aside.classList.toggle('hidden');
  if (lbl) {
    lbl.innerText = isHidden
      ? '⚙ แสดงแผงตั้งค่าพารามิเตอร์โครงถัก (Show Parameters)'
      : '▲ ซ่อนแผงพารามิเตอร์ (Hide Parameters)';
  }
}

window.zoomTruss3DMobile = function(factor) {
  truss3DCam.zoom = Math.max(0.35, Math.min(3.5, truss3DCam.zoom * factor));
  renderTruss3DViewerTab();
};

function initTruss3DCanvasInteraction() {
  const canvas = document.getElementById('truss3DCanvas');
  if (!canvas || canvas.dataset.bound === 'true') return;
  canvas.dataset.bound = 'true';

  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('mousedown', e => {
    truss3DCam.isDragging = true;
    truss3DCam.dragMode = (e.button === 2 || e.shiftKey) ? 'pan' : 'orbit';
    truss3DCam.lastX = e.clientX;
    truss3DCam.lastY = e.clientY;
  });

  window.addEventListener('mousemove', e => {
    if (!truss3DCam.isDragging) return;
    const dx = e.clientX - truss3DCam.lastX;
    const dy = e.clientY - truss3DCam.lastY;
    truss3DCam.lastX = e.clientX;
    truss3DCam.lastY = e.clientY;

    if (truss3DCam.dragMode === 'orbit') {
      truss3DCam.yaw += dx * 0.008;
      truss3DCam.pitch = Math.max(-0.25, Math.min(1.48, truss3DCam.pitch + dy * 0.008));
    } else {
      truss3DCam.panX += dx;
      truss3DCam.panY += dy;
    }
    if (trussState.activeSubTab === 'truss3d') renderTruss3DViewerTab();
  });

  window.addEventListener('mouseup', () => {
    truss3DCam.isDragging = false;
  });

  // Mobile Touch Support for Truss 3D Canvas (1-finger Orbit, 2-finger Pan + Pinch-to-Zoom)
  let t3dLastDist = 0;
  let t3dLastMidX = 0;
  let t3dLastMidY = 0;

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      truss3DCam.isDragging = true;
      truss3DCam.dragMode = 'orbit';
      truss3DCam.lastX = e.touches[0].clientX;
      truss3DCam.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      truss3DCam.isDragging = true;
      truss3DCam.dragMode = 'pan';
      const t1 = e.touches[0], t2 = e.touches[1];
      t3dLastDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      t3dLastMidX = (t1.clientX + t2.clientX) / 2;
      t3dLastMidY = (t1.clientY + t2.clientY) / 2;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    if (!truss3DCam.isDragging) return;
    if (e.touches.length === 1 && truss3DCam.dragMode === 'orbit') {
      e.preventDefault();
      const dx = e.touches[0].clientX - truss3DCam.lastX;
      const dy = e.touches[0].clientY - truss3DCam.lastY;
      truss3DCam.lastX = e.touches[0].clientX;
      truss3DCam.lastY = e.touches[0].clientY;
      truss3DCam.yaw += dx * 0.009;
      truss3DCam.pitch = Math.max(-0.25, Math.min(1.48, truss3DCam.pitch + dy * 0.009));
      if (trussState.activeSubTab === 'truss3d') renderTruss3DViewerTab();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      if (t3dLastDist > 10) {
        const factor = dist / t3dLastDist;
        truss3DCam.zoom = Math.max(0.35, Math.min(3.5, truss3DCam.zoom * factor));
      }
      truss3DCam.panX += (midX - t3dLastMidX);
      truss3DCam.panY += (midY - t3dLastMidY);
      t3dLastDist = dist;
      t3dLastMidX = midX;
      t3dLastMidY = midY;
      if (trussState.activeSubTab === 'truss3d') renderTruss3DViewerTab();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
      truss3DCam.isDragging = false;
    } else if (e.touches.length === 1) {
      truss3DCam.dragMode = 'orbit';
      truss3DCam.lastX = e.touches[0].clientX;
      truss3DCam.lastY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    truss3DCam.zoom = Math.max(0.35, Math.min(3.5, truss3DCam.zoom * factor));
    renderTruss3DViewerTab();
  }, { passive: false });
}

function renderTruss3DViewerTab() {
  const canvas = document.getElementById('truss3DCanvas');
  if (!canvas || !trussSolution) return;
  initTruss3DCanvasInteraction();

  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width > 50) {
    canvas.width = rect.width;
    canvas.height = window.innerWidth < 640 ? 380 : 540;
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const s = trussSolution;

  // Sky / Ground Studio Background matching structural 3D viewer
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(0.58, '#f1f5f9');
  grad.addColorStop(0.60, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const L = trussState.span;
  const Lb = trussState.view3DAllBuilding ? trussState.bldgLength : 0;
  const N = trussState.view3DAllBuilding ? trussState.numTrusses : 1;
  const colH = trussState.hasColumns ? trussState.colHeight : 0;

  const centerX = L / 2;
  const centerY = colH + trussState.ridgeHeight / 2;
  const centerZ = Lb / 2;

  const baseScale = Math.min(W, H) / Math.max(L * 1.15, Lb * 0.85, 14) * 1.12 * truss3DCam.zoom;

  const cy = Math.cos(truss3DCam.yaw), sy = Math.sin(truss3DCam.yaw);
  const cp = Math.cos(truss3DCam.pitch), sp = Math.sin(truss3DCam.pitch);

  function project3D(x, y, z) {
    const rx = x - centerX;
    const ry = y - centerY;
    const rz = z - centerZ;

    const x1 = rx * cy - rz * sy;
    const z1 = rx * sy + rz * cy;
    const y2 = ry * cp - z1 * sp;
    const z2 = ry * sp + z1 * cp;

    const fov = 55;
    const persp = fov / Math.max(12, fov + z2 * 0.45);
    return {
      px: W / 2 + truss3DCam.panX + x1 * baseScale * persp,
      py: H / 2 + truss3DCam.panY - y2 * baseScale * persp,
      depth: z2
    };
  }

  // 1. Draw Ground Grid & Column Axis Labels
  if (trussState.view3DGrid) {
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
    ctx.lineWidth = 1;
    const gStep = 2;
    for (let gx = -4; gx <= L + 4; gx += gStep) {
      const p1 = project3D(gx, 0, -4);
      const p2 = project3D(gx, 0, Lb + 4);
      ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
    }
    for (let gz = -4; gz <= Lb + 4; gz += gStep) {
      const p1 = project3D(-4, 0, gz);
      const p2 = project3D(L + 4, 0, gz);
      ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
    }

    // Axis lines A (x=0), B (x=L/2), C (x=L) and Bay lines 1..N
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.75)';
    ctx.setLineDash([6, 4]);
    [0, L / 2, L].forEach((axX, idx) => {
      if (idx === 1 && !trussState.hasCenterCol) return;
      const p1 = project3D(axX, 0, -2);
      const p2 = project3D(axX, 0, Lb + 2);
      ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();

      // Axis badge A, B, C
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(p1.px, p1.py, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(idx === 0 ? 'A' : idx === 1 ? 'B' : 'C', p1.px, p1.py + 4);
    });

    for (let i = 0; i < N; i++) {
      const zPos = i * trussState.baySpacing;
      const pL = project3D(-2.2, 0, zPos);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(pL.px, pL.py, 12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([]);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, pL.px, pL.py + 4);
    }
    ctx.setLineDash([]);
  }

  // 2. Collect 3D Line Segments for Depth Sorting
  const segments = [];
  function pushSeg(x1, y1, z1, x2, y2, z2, color, width) {
    const p1 = project3D(x1, y1, z1);
    const p2 = project3D(x2, y2, z2);
    segments.push({ p1, p2, depth: (p1.depth + p2.depth) / 2, color, width });
  }

  const n = trussState.panels;

  // Draw Columns, Trusses for each bay i = 0..N-1
  for (let i = 0; i < N; i++) {
    const z = i * trussState.baySpacing;
    const tIdx = i + 1;

    // Columns at A, B, C
    if (trussState.hasColumns) {
      if (trussState.columnGrid[`${tIdx}_A`]) {
        pushSeg(0, 0, z, 0, colH + s.nodes[0].y, z, '#334155', 4.5);
      }
      if (trussState.hasCenterCol && trussState.columnGrid[`${tIdx}_B`]) {
        const midNode = s.nodes[Math.floor(n / 2)];
        pushSeg(midNode.x, 0, z, midNode.x, colH + midNode.y, z, '#d97706', 4.5);
      }
      if (trussState.columnGrid[`${tIdx}_C`]) {
        pushSeg(L, 0, z, L, colH + s.nodes[n].y, z, '#334155', 4.5);
      }
    }

    // Truss Members
    s.members.forEach(m => {
      const nA = s.nodes[m.n1];
      const nB = s.nodes[m.n2];

      let col = '#15803d'; // default green structural steel
      if (trussState.view3DPassFail) {
        col = m.status === 'PASS' ? '#16a34a' : '#dc2626';
      } else if (trussState.view3DTensionComp) {
        col = m.force >= 0 ? '#0284c7' : '#15803d'; // Tension blue, Compression green
      }

      const lw = (m.group === 'TC' || m.group === 'BC') ? 3.4 : 2.1;
      pushSeg(nA.x, colH + nA.y, z, nB.x, colH + nB.y, z, col, lw);
    });
  }

  // 3. Draw Purlins spanning longitudinally across trusses
  if (trussState.view3DPurlin && N > 1) {
    for (let j = 0; j <= n; j++) {
      const tNode = s.nodes[(n + 1) + j];
      for (let i = 0; i < N - 1; i++) {
        const z1 = i * trussState.baySpacing;
        const z2 = (i + 1) * trussState.baySpacing;
        pushSeg(tNode.x, colH + tNode.y + 0.06, z1, tNode.x, colH + tNode.y + 0.06, z2, '#475569', 1.6);
      }
    }
  }

  // Sort back-to-front and render segments
  segments.sort((a, b) => b.depth - a.depth);
  segments.forEach(seg => {
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = seg.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(seg.p1.px, seg.p1.py);
    ctx.lineTo(seg.p2.px, seg.p2.py);
    ctx.stroke();
  });

  // 4. Semi-transparent Roof Sheeting overlay if enabled
  if (trussState.view3DRoof && N > 1) {
    const zStart = 0;
    const zEnd = (N - 1) * trussState.baySpacing;
    const nLeft = s.nodes[(n + 1)];
    const nMid = s.nodes[(n + 1) + Math.floor(n / 2)];
    const nRight = s.nodes[(n + 1) + n];

    const drawQuad = (a, b, c, d, fill) => {
      const pA = project3D(a.x, a.y, a.z);
      const pB = project3D(b.x, b.y, b.z);
      const pC = project3D(c.x, c.y, c.z);
      const pD = project3D(d.x, d.y, d.z);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(pA.px, pA.py); ctx.lineTo(pB.px, pB.py);
      ctx.lineTo(pC.px, pC.py); ctx.lineTo(pD.px, pD.py);
      ctx.closePath(); ctx.fill();
    };

    drawQuad(
      { x: nLeft.x, y: colH + nLeft.y + 0.1, z: zStart },
      { x: nMid.x, y: colH + nMid.y + 0.1, z: zStart },
      { x: nMid.x, y: colH + nMid.y + 0.1, z: zEnd },
      { x: nLeft.x, y: colH + nLeft.y + 0.1, z: zEnd },
      'rgba(14, 165, 233, 0.18)'
    );
    drawQuad(
      { x: nMid.x, y: colH + nMid.y + 0.1, z: zStart },
      { x: nRight.x, y: colH + nRight.y + 0.1, z: zStart },
      { x: nRight.x, y: colH + nRight.y + 0.1, z: zEnd },
      { x: nMid.x, y: colH + nMid.y + 0.1, z: zEnd },
      'rgba(20, 184, 166, 0.18)'
    );
  }

  // Update 3D Summary Cards
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  const purlinLines = n + 1;
  const purlinSec = getTrussSec(trussState.secPurlin);
  const totalPurlinKg = purlinLines * trussState.bldgLength * purlinSec.kg;
  const totalSteelKg = s.trussSteelWeightKg * trussState.numTrusses + totalPurlinKg;

  setTxt('truss3DValSpacing', `${trussState.baySpacing.toFixed(2)} m`);
  setTxt('truss3DValCount', `${trussState.numTrusses} โครง`);
  setTxt('truss3DValLength', `${trussState.bldgLength.toFixed(1)} m`);
  setTxt('truss3DValWeight1', `${s.trussSteelWeightKg.toFixed(1)} kg`);
  setTxt('truss3DValPurlinKg', `${totalPurlinKg.toFixed(0)} kg`);
  setTxt('truss3DValTotalKg', `${(totalSteelKg / 1000).toFixed(2)} ตัน (${totalSteelKg.toFixed(0)} kg)`);
}

// ============================================================================
// 10. SUB-TAB 4: FBD (FREE BODY DIAGRAM - ผังวัตถุอิสระ)
// ============================================================================
function renderTrussFBDTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussFBDSvgContainer');
  if (!wrap || !s) return;

  const W = 1100, H = 420, padX = 95, padY = 85;
  const L = trussState.span;
  const n = trussState.panels;
  const maxY = Math.max(trussState.ridgeHeight, trussState.eaveHeight, 1.5);
  const scaleX = (W - 2 * padX) / L;
  const scaleY = Math.min(scaleX * 1.1, (H - 2 * padY) / (maxY + 0.8));
  const toX = (x) => padX + x * scaleX;
  const toY = (y) => (H - padY) - y * scaleY;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">`;
  svg += `<rect width="${W}" height="${H}" rx="16" fill="#070d19"/>`;

  // Draw truss outline
  s.members.forEach(m => {
    const nA = s.nodes[m.n1], nB = s.nodes[m.n2];
    svg += `<line x1="${toX(nA.x)}" y1="${toY(nA.y)}" x2="${toX(nB.x)}" y2="${toY(nB.y)}" stroke="#334155" stroke-width="2.5"/>`;
  });

  // Draw Point Loads P at Top Chord Joints
  const dx = L / n;
  const P_full = s.wGravity * dx;
  const P_end = P_full / 2;

  for (let i = 0; i <= n; i++) {
    const nd = s.nodes[(n + 1) + i];
    const x = toX(nd.x), y = toY(nd.y);
    const P = (i === 0 || i === n) ? P_end : P_full;
    const arrowLen = (i === 0 || i === n) ? 34 : 48;

    svg += `<line x1="${x}" y1="${y - arrowLen}" x2="${x}" y2="${y - 6}" stroke="#ef4444" stroke-width="2.5"/>`;
    svg += `<polygon points="${x},${y - 2} ${x - 5},${y - 12} ${x + 5},${y - 12}" fill="#ef4444"/>`;
    svg += `<text x="${x}" y="${y - arrowLen - 6}" text-anchor="middle" fill="#fca5a5" font-size="10" font-family="JetBrains Mono,monospace" font-weight="bold">${P.toFixed(0)} kg</text>`;
  }

  // Draw Support Reaction Vectors (Green upward arrows)
  const drawReaction = (nd, valKg, label) => {
    const x = toX(nd.x), y = toY(nd.y);
    svg += `<line x1="${x}" y1="${y + 52}" x2="${x}" y2="${y + 8}" stroke="#22c55e" stroke-width="3.5"/>`;
    svg += `<polygon points="${x},${y + 2} ${x - 6},${y + 14} ${x + 6},${y + 14}" fill="#22c55e"/>`;
    svg += `<text x="${x}" y="${y + 68}" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="bold">${label} = ${valKg.toFixed(0)} kg</text>`;
  };

  drawReaction(s.nodes[0], s.gravRes.RA, 'R_A');
  drawReaction(s.nodes[n], s.gravRes.RB, 'R_B');
  if (trussState.hasCenterCol) {
    drawReaction(s.nodes[Math.floor(n / 2)], s.gravRes.RM, 'R_M');
  }

  svg += `</svg>`;
  wrap.innerHTML = svg;

  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setTxt('trussFbdRA', `${s.gravRes.RA.toFixed(0)} kg (${(s.gravRes.RA / 1000).toFixed(2)} ตัน)`);
  setTxt('trussFbdRB', `${s.gravRes.RB.toFixed(0)} kg (${(s.gravRes.RB / 1000).toFixed(2)} ตัน)`);
  setTxt('trussFbdWtot', `${s.gravRes.totalDownLoad.toFixed(0)} kg`);
  setTxt('trussFbdPjoint', `${P_full.toFixed(0)} kg / Joint (ปลาย ${P_end.toFixed(0)} kg)`);
}

// ============================================================================
// 11. SUB-TAB 5: INTERNAL MEMBER FORCES (แรงภายในชิ้นส่วน Method of Joints)
// ============================================================================
function renderTrussForcesTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussForcesSvgContainer');
  const tbody = document.getElementById('trussForcesTableBody');
  if (!wrap || !s) return;

  const W = 1100, H = 420, padX = 95, padY = 75;
  const L = trussState.span;
  const maxY = Math.max(trussState.ridgeHeight, trussState.eaveHeight, 1.5);
  const scaleX = (W - 2 * padX) / L;
  const scaleY = Math.min(scaleX * 1.15, (H - 2 * padY) / (maxY + 0.6));
  const toX = (x) => padX + x * scaleX;
  const toY = (y) => (H - padY) - y * scaleY;

  let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">`;
  svg += `<rect width="${W}" height="${H}" rx="16" fill="#070d19"/>`;

  s.members.forEach(m => {
    const nA = s.nodes[m.n1], nB = s.nodes[m.n2];
    const x1 = toX(nA.x), y1 = toY(nA.y), x2 = toX(nB.x), y2 = toY(nB.y);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const isTen = m.fGrav >= 0;
    const col = isTen ? '#ef4444' : '#22c55e'; // Red Tension, Green Compression
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="3.2"/>`;
    svg += `<rect x="${mx - 28}" y="${my - 9}" width="56" height="16" rx="4" fill="rgba(9,13,22,0.88)" stroke="${col}" stroke-width="0.8"/>`;
    svg += `<text x="${mx}" y="${my + 3}" text-anchor="middle" fill="${col}" font-size="9.5" font-family="JetBrains Mono,monospace" font-weight="bold">${m.fGrav >= 0 ? '+' : ''}${m.fGrav.toFixed(0)}</text>`;
  });

  svg += `</svg>`;
  wrap.innerHTML = svg;

  if (tbody) {
    tbody.innerHTML = s.members.map(m => {
      const isTen = m.fGrav >= 0;
      const typeBadge = isTen
        ? `<span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold text-[11px]">Tension (ดึง)</span>`
        : `<span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[11px]">Compression (อัด)</span>`;
      return `
        <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
          <td class="py-2 px-3 font-mono font-bold text-cyan-300">${m.label}</td>
          <td class="py-2 px-3 text-slate-300">${m.group === 'TC' ? 'Top Chord' : m.group === 'BC' ? 'Bottom Chord' : m.group === 'V' ? 'Vertical' : 'Diagonal'}</td>
          <td class="py-2 px-3 font-mono">${m.length.toFixed(2)} m</td>
          <td class="py-2 px-3 font-mono font-bold ${isTen ? 'text-rose-400' : 'text-emerald-400'}">${m.fGrav >= 0 ? '+' : ''}${m.fGrav.toFixed(0)} kg</td>
          <td class="py-2 px-3 font-mono ${m.fUplift >= 0 ? 'text-rose-400' : 'text-emerald-400'}">${m.fUplift >= 0 ? '+' : ''}${m.fUplift.toFixed(0)} kg</td>
          <td class="py-2 px-3">${typeBadge}</td>
        </tr>
      `;
    }).join('');
  }
}

// ============================================================================
// 12. SUB-TAB 6 & 7: GLOBAL SHEAR & BENDING MOMENT DIAGRAMS
// ============================================================================
function renderTrussShearTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussShearSvgContainer');
  if (!wrap || !s) return;

  const W = 1050, H = 300, padX = 85, midY = H / 2;
  const L = trussState.span;
  const maxV = Math.max(s.maxGlobalV, 1);
  const scaleX = (W - 2 * padX) / L;
  const scaleY = (H / 2 - 45) / maxV;

  let pts = `${padX},${midY} `;
  s.samples.forEach(pt => {
    const x = padX + pt.x * scaleX;
    const y = midY - pt.V * scaleY;
    pts += `${x.toFixed(1)},${y.toFixed(1)} `;
  });
  pts += `${padX + L * scaleX},${midY}`;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">
      <rect width="${W}" height="${H}" rx="14" fill="#070d19"/>
      <line x1="${padX}" y1="${midY}" x2="${W - padX}" y2="${midY}" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4"/>
      <polygon points="${pts}" fill="rgba(244,63,94,0.22)" stroke="#f43f5e" stroke-width="2.5"/>
      <text x="${padX}" y="28" fill="#f43f5e" font-size="12" font-weight="bold">+V_max = +${s.maxGlobalV.toFixed(0)} kg</text>
      <text x="${W - padX}" y="${H - 18}" text-anchor="end" fill="#f43f5e" font-size="12" font-weight="bold">-V_max = -${s.maxGlobalV.toFixed(0)} kg</text>
    </svg>
  `;

  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setTxt('trussShearVmax', `${s.maxGlobalV.toFixed(0)} kg (${(s.maxGlobalV / 1000).toFixed(2)} ตัน)`);
  setTxt('trussShearVA', `+${s.gravRes.RA.toFixed(0)} kg`);
  setTxt('trussShearVB', `-${s.gravRes.RB.toFixed(0)} kg`);
}

function renderTrussMomentTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussMomentSvgContainer');
  if (!wrap || !s) return;

  const W = 1050, H = 300, padX = 85, baseY = 65;
  const L = trussState.span;
  const maxM = Math.max(s.maxGlobalM, 1);
  const scaleX = (W - 2 * padX) / L;
  const scaleY = (H - 115) / maxM;

  let pts = `${padX},${baseY} `;
  s.samples.forEach(pt => {
    const x = padX + pt.x * scaleX;
    const y = baseY + pt.M * scaleY;
    pts += `${x.toFixed(1)},${y.toFixed(1)} `;
  });
  pts += `${padX + L * scaleX},${baseY}`;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto">
      <rect width="${W}" height="${H}" rx="14" fill="#070d19"/>
      <line x1="${padX}" y1="${baseY}" x2="${W - padX}" y2="${baseY}" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4"/>
      <polygon points="${pts}" fill="rgba(34,211,238,0.20)" stroke="#22d3ee" stroke-width="2.5"/>
      <text x="${W / 2}" y="${H - 16}" text-anchor="middle" fill="#22d3ee" font-size="13" font-weight="bold">M_max = ${s.maxGlobalM.toFixed(0)} kg·m (${(s.maxGlobalM / 1000).toFixed(2)} ton·m)</text>
    </svg>
  `;

  const wL2_8 = (s.wGravity * L * L) / 8;
  const fChordApprox = s.maxGlobalM / Math.max(0.4, trussState.ridgeHeight);
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setTxt('trussMomentMmax', `${s.maxGlobalM.toFixed(0)} kg·m`);
  setTxt('trussMomentFormula', `${wL2_8.toFixed(0)} kg·m`);
  setTxt('trussMomentFchord', `≈ ${fChordApprox.toFixed(0)} kg`);
}

// ============================================================================
// 13. SUB-TAB 8: SECTIONS & CAPACITY CHECK (รูปร่างหน้าตัด & ตารางตรวจสอบกำลัง)
// ============================================================================
function renderTrussSectionsTab() {
  const s = trussSolution;
  const cardsEl = document.getElementById('trussSectionCardsGrid');
  const tbody = document.getElementById('trussCapacityCheckTableBody');
  if (!cardsEl || !s) return;

  const groups = [
    { title: 'คอร์ดบน (Top Chord - TC)', sec: getTrussSec(trussState.secTop), color: '#22d3ee' },
    { title: 'คอร์ดล่าง (Bottom Chord - BC)', sec: getTrussSec(trussState.secBot), color: '#38bdf8' },
    { title: 'เหล็กทแยง (Diagonal - D)', sec: getTrussSec(trussState.secDia), color: '#f472b6' },
    { title: 'เหล็กตั้ง (Vertical - V)', sec: getTrussSec(trussState.secVer), color: '#a78bfa' }
  ];

  cardsEl.innerHTML = groups.map(g => {
    const sec = g.sec;
    return `
      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-4">
        <div class="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 60 60" class="w-12 h-12">
            ${sec.type === 'CHS'
              ? `<circle cx="30" cy="30" r="20" fill="none" stroke="${g.color}" stroke-width="4"/>`
              : `<rect x="12" y="12" width="36" height="36" rx="3" fill="none" stroke="${g.color}" stroke-width="4"/>`
            }
          </svg>
        </div>
        <div class="text-xs space-y-1 flex-1">
          <div class="text-slate-400 font-semibold">${g.title}</div>
          <div class="text-sm font-bold text-white">${sec.name}</div>
          <div class="text-slate-400 font-mono">A = ${sec.A} cm² • Ix = ${sec.Ix} cm⁴ • r = ${Math.min(sec.rx, sec.ry)} cm • ${sec.kg} kg/m</div>
        </div>
      </div>
    `;
  }).join('');

  if (tbody) {
    tbody.innerHTML = s.members.map(m => {
      const badge = m.status === 'PASS'
        ? `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">ผ่าน (OK)</span>`
        : `<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[11px]">ไม่ผ่าน (FAIL)</span>`;
      const capKg = m.force >= 0 ? m.capTensionKg : m.capCompKg;
      return `
        <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
          <td class="py-2 px-3 font-mono font-bold text-cyan-300">${m.label}</td>
          <td class="py-2 px-3">${m.section.name}</td>
          <td class="py-2 px-3 font-mono">${m.length.toFixed(2)} m</td>
          <td class="py-2 px-3 font-mono">${m.KLr.toFixed(1)}</td>
          <td class="py-2 px-3 font-mono font-bold ${m.force >= 0 ? 'text-rose-400' : 'text-emerald-400'}">${Math.abs(m.force).toFixed(0)} kg (${m.force >= 0 ? 'T' : 'C'})</td>
          <td class="py-2 px-3 font-mono">${capKg.toFixed(0)} kg</td>
          <td class="py-2 px-3 font-mono font-bold ${m.ratio <= 1 ? 'text-emerald-400' : 'text-rose-400'}">${m.ratio.toFixed(2)}</td>
          <td class="py-2 px-3">${badge}</td>
        </tr>
      `;
    }).join('');
  }
}

// ============================================================================
// 14. SUB-TAB 9: WIND LOAD ANALYSIS (แรงลม มยผ. 1311-50)
// ============================================================================
function renderTrussWindTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussWindContentWrap');
  if (!wrap || !s) return;

  wrap.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-xs">
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">ความเร็วลมอ้างอิง (V50)</div>
        <div class="text-lg font-bold font-mono text-cyan-300 mt-1">โซน ${trussState.windZone} = ${s.V50} m/s</div>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">ตัวคูณความสูง/ภูมิประเทศ (Ce)</div>
        <div class="text-lg font-bold font-mono text-cyan-300 mt-1">Terrain ${trussState.windTerrain} • Ce = ${s.Ce.toFixed(2)}</div>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">แรงดันลมสถิต (qz)</div>
        <div class="text-lg font-bold font-mono text-amber-300 mt-1">${s.qz_kgm2.toFixed(1)} kg/m² (${s.qz_Pa.toFixed(0)} Pa)</div>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">แรงลมดูดหลังคาสุทธิ (Wind Uplift)</div>
        <div class="text-lg font-bold font-mono text-rose-400 mt-1">-${s.windUplift_m2.toFixed(1)} kg/m² (Cp=${trussState.windCp})</div>
      </div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
      <div class="font-bold text-cyan-400 text-sm">หลักการตรวจสอบแรงลมยก (Wind Uplift Reversal Check ตาม มยผ. 1311-50)</div>
      <p>• สมการแรงดันลมอ้างอิง: <code class="text-amber-300">qz = ½ · ρ · V50² · Ce · Iw</code> โดยความหนาแน่นอากาศ ρ = 1.25 kg/m³</p>
      <p>• แรงลมดูดสุทธิที่กระทำตั้งฉากผิวหลังคา: <code class="text-amber-300">w_uplift = qz × Cp = ${s.qz_kgm2.toFixed(1)} × ${trussState.windCp} = ${s.windUplift_m2.toFixed(1)} kg/m²</code></p>
      <p>• เมื่อเกิดลมดูดรุนแรง น้ำหนักสุทธิ <code class="text-rose-300">q_net = ${s.qUpliftNet_m2.toFixed(1)} kg/m²</code> หากมีค่าติดลบ แรงในคอร์ดล่าง (Bottom Chord) จะเปลี่ยนจากแรงดึงเป็นแรงอัดทันที ซึ่งระบบได้ตรวจสอบการโก่งเดาะ (Buckling KL/r) ทั้งสองทิศทางให้อัตโนมัติแล้ว</p>
    </div>
  `;
}

// ============================================================================
// 15. SUB-TAB 10: PURLIN DESIGN (การคำนวณออกแบบแปหลังคา)
// ============================================================================
function renderTrussPurlinTab() {
  const s = trussSolution;
  const wrap = document.getElementById('trussPurlinResultWrap');
  if (!wrap || !s) return;

  const sec = getTrussSec(trussState.secPurlin);
  const spanP = trussState.baySpacing; // Purlin spans between trusses (s)
  const sp = trussState.purlinSpacing;
  const theta = s.avgSlopeRad;

  // Total load on purlin (kg/m)
  const wTotal = (s.qGravity_m2 * sp) + sec.kg;
  const wx = wTotal * Math.cos(theta); // major axis (normal to roof)
  const wy = wTotal * Math.sin(theta); // minor axis (parallel to roof slope)

  // Continuity moment coefficients
  const contMap = { simple: 1 / 8, cont2: 1 / 8, cont3: 1 / 10 };
  const deflMap = { simple: 5 / 384, cont2: 2.1 / 384, cont3: 2.6 / 384 };
  const mCoeff = contMap[trussState.purlinContinuity] || (1 / 8);
  const dCoeff = deflMap[trussState.purlinContinuity] || (5 / 384);

  const Mx_kgm = mCoeff * wx * spanP * spanP;
  const Ly = spanP / (trussState.purlinSagRods + 1);
  const My_kgm = (1 / 8) * wy * Ly * Ly;

  const Sx = sec.Ix / (sec.d / 20); // cm³
  const Sy = sec.Iy / (sec.b / 20); // cm³

  const fbx = (Mx_kgm * 100) / Sx; // ksc
  const fby = (My_kgm * 100) / Sy; // ksc
  const Fb = trussState.designMethod === 'LRFD' ? (0.90 * trussState.Fy) : (0.60 * trussState.Fy);

  const ratioPurlin = (fbx / Fb) + (fby / Fb);

  // Deflection check (cm -> mm)
  const w_kgcm = wx / 100;
  const L_cm = spanP * 100;
  const deflMm = ((dCoeff * w_kgcm * Math.pow(L_cm, 4)) / (trussState.E * sec.Ix)) * 10;
  const allowDeflMm = (spanP * 1000) / trussState.purlinDeflLimit;

  const isOk = ratioPurlin <= 1.0 && deflMm <= allowDeflMm;

  wrap.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">หน้าตัดแปที่เลือก</div>
        <div class="text-sm font-bold text-cyan-300 mt-1">${sec.name}</div>
        <div class="text-slate-400 font-mono mt-0.5">Sx = ${Sx.toFixed(1)} cm³ • Sy = ${Sy.toFixed(1)} cm³</div>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">โมเมนต์ดัดสองแกน (Mx / My)</div>
        <div class="text-sm font-bold font-mono text-amber-300 mt-1">Mx = ${Mx_kgm.toFixed(1)} kg·m • My = ${My_kgm.toFixed(1)} kg·m</div>
        <div class="text-slate-400 font-mono mt-0.5">wx = ${wx.toFixed(1)} kg/m • wy = ${wy.toFixed(1)} kg/m</div>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
        <div class="text-slate-400">ผลการตรวจสอบแป (Interaction & Deflection)</div>
        <div class="text-sm font-bold font-mono ${isOk ? 'text-emerald-400' : 'text-rose-400'} mt-1">
          Ratio = ${ratioPurlin.toFixed(2)} • δ = ${deflMm.toFixed(1)} / ${allowDeflMm.toFixed(1)} mm (${isOk ? 'ผ่าน OK' : 'ไม่ผ่าน FAIL'})
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 16. SUB-TAB 11: ENGINEERING FORMULAS & STANDARDS (สูตรการคำนวณ)
// ============================================================================
function renderTrussFormulasTab() {
  const wrap = document.getElementById('trussFormulasGrid');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
      <div class="font-bold text-cyan-400 text-sm">1. การถ่ายน้ำหนักบรรทุกหลังคาสู่ข้อต่อ (Nodal Load Transfer)</div>
      <div class="p-3 rounded-xl bg-slate-950 font-mono text-slate-300">
        q_total = DL / cos(θ) + Solar + LL (kg/m²)<br/>
        w_truss = q_total × s (kg/m)<br/>
        P_joint = w_truss × (L / n) , P_end = ½ P_joint
      </div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
      <div class="font-bold text-cyan-400 text-sm">2. การวิเคราะห์แรงในชิ้นส่วน (Matrix Stiffness / Method of Joints)</div>
      <div class="p-3 rounded-xl bg-slate-950 font-mono text-slate-300">
        ∑F_x = 0 , ∑F_y = 0 ที่ทุกจุดต่อ (Pin-Jointed Truss)<br/>
        k_e = (EA / L) [c² cs -c² -cs ; cs s² -cs -s² ...]<br/>
        F_chord ≈ M_max / h_ridge
      </div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
      <div class="font-bold text-cyan-400 text-sm">3. กำลังรับแรงดึงและแรงอัด (วสท. 1009-34 ASD & วสท. 1010-50 LRFD)</div>
      <div class="p-3 rounded-xl bg-slate-950 font-mono text-slate-300">
        ASD Tension: F_t = 0.60 F_y (KL/r ≤ 300)<br/>
        ASD Compression: C_c = √(2π²E / F_y), KL/r ≤ 200<br/>
        เมื่อ KL/r ≤ C_c: F_a = [1 - (KL/r)²/(2C_c²)]·F_y / FS<br/>
        เมื่อ KL/r > C_c: F_a = 12π²E / [23(KL/r)²]
      </div>
    </div>
    <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
      <div class="font-bold text-cyan-400 text-sm">4. การออกแบบแปรับแรงดัดสองแกน (Biaxial Bending Purlin Design)</div>
      <div class="p-3 rounded-xl bg-slate-950 font-mono text-slate-300">
        w_x = w cos(θ) , w_y = w sin(θ)<br/>
        M_x = c_m · w_x · s² , M_y = (1/8) · w_y · (s / (N_sag + 1))²<br/>
        f_bx / F_bx + f_by / F_by ≤ 1.00 , δ_max ≤ L / 180
      </div>
    </div>
  `;
}

// ============================================================================
// 17. ROOF TRUSS 2D & 3D PDF REPORT & PRINT ENGINE (VERSION 2.0)
// ============================================================================
function openTrussReportPDF(autoPrint = false) {
  if (!trussSolution) buildTrussGeometryAndSolve();
  if (autoPrint && typeof exportReportByType === 'function') {
    exportReportByType('truss');
    return;
  }
  if (typeof switchWorkspace === 'function') {
    switchWorkspace('report');
  }
  if (typeof setReportSource === 'function') {
    setReportSource('truss');
  }
  populateTrussCalculationReport();

  if (autoPrint) {
    setTimeout(() => {
      window.print();
    }, 180);
  } else if (typeof showNotification === 'function') {
    showNotification(
      'เปิดหน้ารายงาน PDF โครงหลังคา 2D & 3D (แยกอิสระ)',
      'แสดงเฉพาะรายงานโครงหลังคาเหล็ก 2D & 3D (แผ่นที่ 1–2) พร้อมกดปุ่มพิมพ์ PDF เฉพาะหมวดหมู่นี้ได้ทันที'
    );
  }
}

function drawReportTruss2DCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c || !trussSolution) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const s = trussSolution;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Subtle light blueprint grid
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= W; gx += 35) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy <= H; gy += 35) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  const padX = 115, padY = 95;
  const L = trussState.span;
  const n = trussState.panels;
  const maxY = Math.max(trussState.ridgeHeight, trussState.eaveHeight, 1.5);
  const scaleX = (W - 2 * padX) / L;
  const scaleY = Math.min(scaleX * 1.15, (H - 2 * padY) / (maxY + 0.9));

  const toX = x => padX + x * scaleX;
  const toY = y => (H - padY) - y * scaleY;

  // Draw Nodal Point Loads P at Top Chord Joints (Red downward arrows)
  const dx = L / n;
  const P_full = s.wGravity * dx;
  const P_end = P_full / 2;

  for (let i = 0; i <= n; i++) {
    const nd = s.nodes[(n + 1) + i];
    const x = toX(nd.x), y = toY(nd.y);
    const P = (i === 0 || i === n) ? P_end : P_full;
    const arrowLen = (i === 0 || i === n) ? 34 : 50;

    ctx.strokeStyle = '#dc2626';
    ctx.fillStyle = '#dc2626';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y - arrowLen);
    ctx.lineTo(x, y - 7);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x - 5.5, y - 13);
    ctx.lineTo(x + 5.5, y - 13);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${P.toFixed(0)}kg`, x, y - arrowLen - 6);
  }

  // Draw Support Icons & Upward Reaction Arrows
  const drawSupportAndReaction = (nd, type, rVal, label) => {
    const x = toX(nd.x), y = toY(nd.y);
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#e2e8f0';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 14, y + 20);
    ctx.lineTo(x + 14, y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (type === 'roller') {
      ctx.beginPath(); ctx.arc(x - 6, y + 25, 3.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 6, y + 25, 3.5, 0, Math.PI * 2); ctx.stroke();
    }

    // Green Upward Reaction Vector
    ctx.strokeStyle = '#15803d';
    ctx.fillStyle = '#15803d';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(x, y + 60);
    ctx.lineTo(x, y + 32);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + 28);
    ctx.lineTo(x - 6, y + 38);
    ctx.lineTo(x + 6, y + 38);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 13px Inter, Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${label} = ${rVal.toFixed(0)} kg`, x, y + 76);
  };

  drawSupportAndReaction(s.nodes[0], 'pin', s.gravRes.RA, 'R_A');
  drawSupportAndReaction(s.nodes[n], 'roller', s.gravRes.RB, 'R_B');
  if (trussState.hasCenterCol) {
    drawSupportAndReaction(s.nodes[Math.floor(n / 2)], trussState.centerColType, s.gravRes.RM, 'R_M');
  }

  // Draw Members with Axial Force Color Coding (Blue=Tension, Green=Compression)
  s.members.forEach(m => {
    const nA = s.nodes[m.n1], nB = s.nodes[m.n2];
    const x1 = toX(nA.x), y1 = toY(nA.y), x2 = toX(nB.x), y2 = toY(nB.y);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

    const isTen = m.fGrav >= 0;
    const col = isTen ? '#0369a1' : '#15803d';
    ctx.strokeStyle = col;
    ctx.lineWidth = (m.group === 'TC' || m.group === 'BC') ? 3.8 : 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Label tag with member ID and force
    const tagTxt = `${m.label} (${m.fGrav >= 0 ? '+' : ''}${m.fGrav.toFixed(0)})`;
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    const tw = ctx.measureText(tagTxt).width + 8;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.fillRect(mx - tw / 2, my - 8, tw, 15);
    ctx.strokeRect(mx - tw / 2, my - 8, tw, 15);

    ctx.fillStyle = col;
    ctx.textAlign = 'center';
    ctx.fillText(tagTxt, mx, my + 3);
  });

  // Draw Joint Circles
  s.nodes.forEach(nd => {
    const cx = toX(nd.x), cy = toY(nd.y);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Dimension Line at Bottom
  const lx = toX(0), rx = toX(L), dimY = H - 14;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lx, dimY);
  ctx.lineTo(rx, dimY);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Inter, Sarabun, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`ช่วงพาดโครงถัก L = ${L.toFixed(2)} m (${n} ช่อง × ${(L / n).toFixed(2)} m) • ความสูงยอดจั่ว H = ${trussState.ridgeHeight.toFixed(2)} m • มุมลาด θ = ${s.avgSlopeDeg.toFixed(1)}°`, (lx + rx) / 2, dimY - 5);
}

function drawReportTruss3DCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c || !trussSolution) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const s = trussSolution;

  ctx.clearRect(0, 0, W, H);
  // Crisp light studio background suitable for PDF paper printing
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.65, '#f8fafc');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const L = trussState.span;
  const Lb = trussState.bldgLength;
  const N = trussState.numTrusses;
  const colH = trussState.hasColumns ? trussState.colHeight : 0;

  const centerX = L / 2;
  const centerY = colH + trussState.ridgeHeight / 2;
  const centerZ = Lb / 2;

  const yaw = -0.62;
  const pitch = 0.33;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const baseScale = Math.min(W, H) / Math.max(L * 1.15, Lb * 0.85, 14) * 1.16;

  function project3D(x, y, z) {
    const rx = x - centerX;
    const ry = y - centerY;
    const rz = z - centerZ;

    const x1 = rx * cy - rz * sy;
    const z1 = rx * sy + rz * cy;
    const y2 = ry * cp - z1 * sp;
    const z2 = ry * sp + z1 * cp;

    const fov = 55;
    const persp = fov / Math.max(12, fov + z2 * 0.45);
    return {
      px: W / 2 + x1 * baseScale * persp,
      py: H / 2 + 18 - y2 * baseScale * persp,
      depth: z2
    };
  }

  // Ground Grid & Axes A, B, C & 1..N
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
  ctx.lineWidth = 1;
  for (let gx = -2; gx <= L + 2; gx += 2) {
    const p1 = project3D(gx, 0, -2), p2 = project3D(gx, 0, Lb + 2);
    ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
  }
  for (let gz = -2; gz <= Lb + 2; gz += 2) {
    const p1 = project3D(-2, 0, gz), p2 = project3D(L + 2, 0, gz);
    ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
  }

  // Axis Lines A, B, C
  [0, L / 2, L].forEach((axX, idx) => {
    if (idx === 1 && !trussState.hasCenterCol) return;
    const p1 = project3D(axX, 0, -1.8), p2 = project3D(axX, 0, Lb + 1.8);
    ctx.strokeStyle = '#d97706';
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(p1.px, p1.py, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(idx === 0 ? 'A' : idx === 1 ? 'B' : 'C', p1.px, p1.py + 4);
  });

  for (let i = 0; i < N; i++) {
    const zPos = i * trussState.baySpacing;
    const pL = project3D(-1.8, 0, zPos);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(pL.px, pL.py, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, pL.px, pL.py + 3.5);
  }

  // Collect 3D segments
  const segments = [];
  function pushSeg(x1, y1, z1, x2, y2, z2, color, width) {
    const p1 = project3D(x1, y1, z1);
    const p2 = project3D(x2, y2, z2);
    segments.push({ p1, p2, depth: (p1.depth + p2.depth) / 2, color, width });
  }

  const n = trussState.panels;
  for (let i = 0; i < N; i++) {
    const z = i * trussState.baySpacing;
    const tIdx = i + 1;

    if (trussState.hasColumns) {
      if (trussState.columnGrid[`${tIdx}_A`]) {
        pushSeg(0, 0, z, 0, colH + s.nodes[0].y, z, '#334155', 4.5);
      }
      if (trussState.hasCenterCol && trussState.columnGrid[`${tIdx}_B`]) {
        const midNode = s.nodes[Math.floor(n / 2)];
        pushSeg(midNode.x, 0, z, midNode.x, colH + midNode.y, z, '#d97706', 4.5);
      }
      if (trussState.columnGrid[`${tIdx}_C`]) {
        pushSeg(L, 0, z, L, colH + s.nodes[n].y, z, '#334155', 4.5);
      }
    }

    s.members.forEach(m => {
      const nA = s.nodes[m.n1], nB = s.nodes[m.n2];
      const col = m.force >= 0 ? '#0284c7' : '#15803d';
      const lw = (m.group === 'TC' || m.group === 'BC') ? 3.2 : 2.0;
      pushSeg(nA.x, colH + nA.y, z, nB.x, colH + nB.y, z, col, lw);
    });
  }

  // Purlins
  if (N > 1) {
    for (let j = 0; j <= n; j++) {
      const tNode = s.nodes[(n + 1) + j];
      for (let i = 0; i < N - 1; i++) {
        const z1 = i * trussState.baySpacing;
        const z2 = (i + 1) * trussState.baySpacing;
        pushSeg(tNode.x, colH + tNode.y + 0.06, z1, tNode.x, colH + tNode.y + 0.06, z2, '#64748b', 1.4);
      }
    }
  }

  segments.sort((a, b) => b.depth - a.depth);
  segments.forEach(seg => {
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = seg.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(seg.p1.px, seg.p1.py);
    ctx.lineTo(seg.p2.px, seg.p2.py);
    ctx.stroke();
  });

  // Top-left 3D Info Box on Canvas
  const purlinSec = getTrussSec(trussState.secPurlin);
  const totalPurlinKg = (n + 1) * trussState.bldgLength * purlinSec.kg;
  const totalSteelKg = s.trussSteelWeightKg * trussState.numTrusses + totalPurlinKg;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.fillRect(18, 16, 390, 68);
  ctx.strokeRect(18, 16, 390, 68);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Inter, Sarabun, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`แบบจำลอง 3 มิติ (Isometric): ${trussState.numTrusses} โครง × ระยะห่าง ${trussState.baySpacing} m (ยาว ${trussState.bldgLength} m)`, 30, 38);
  ctx.font = '12px JetBrains Mono, monospace';
  ctx.fillStyle = '#334155';
  ctx.fillText(`น้ำหนักเหล็กทรัส 1 โครง = ${s.trussSteelWeightKg.toFixed(1)} kg | แปหลังคา = ${totalPurlinKg.toFixed(0)} kg`, 30, 57);
  ctx.fillStyle = '#0f766e';
  ctx.font = 'bold 12px JetBrains Mono, monospace';
  ctx.fillText(`น้ำหนักเหล็กรวมทั้งอาคาร = ${(totalSteelKg / 1000).toFixed(2)} ตัน (${totalSteelKg.toFixed(0)} kg)`, 30, 74);
}

function drawReportTrussDiagramsCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  if (!c || !trussSolution) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const s = trussSolution;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const L = trussState.span;
  const halfW = W / 2;

  // LEFT HALF: Global Shear Force Diagram (SFD)
  {
    const padL = 70, padR = 40, padT = 42, padB = 45;
    const plotW = halfW - padL - padR;
    const plotH = H - padT - padB;
    const midY = padT + plotH / 2;
    const maxV = Math.max(s.maxGlobalV, 1);

    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(padL, padT, plotW, plotH);

    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(padL + plotW, midY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(padL, midY);
    s.samples.forEach(pt => {
      const x = padL + (pt.x / L) * plotW;
      const y = midY - (pt.V / maxV) * (plotH * 0.42);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padL + plotW, midY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(225, 29, 72, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px Inter, Sarabun, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`แผนภาพแรงเฉือนรวม V(x) — Max |V| = ${s.maxGlobalV.toFixed(0)} kg`, padL, 26);

    ctx.fillStyle = '#be123c';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillText(`+${s.gravRes.RA.toFixed(0)} kg`, padL + 6, padT + 18);
    ctx.textAlign = 'right';
    ctx.fillText(`-${s.gravRes.RB.toFixed(0)} kg`, padL + plotW - 6, padT + plotH - 8);
  }

  // RIGHT HALF: Global Bending Moment Diagram (BMD)
  {
    const offsetX = halfW;
    const padL = 60, padR = 50, padT = 42, padB = 45;
    const plotW = halfW - padL - padR;
    const plotH = H - padT - padB;
    const baseY = padT + 25;
    const maxM = Math.max(s.maxGlobalM, 1);

    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(offsetX + padL, padT, plotW, plotH);

    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(offsetX + padL, baseY); ctx.lineTo(offsetX + padL + plotW, baseY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(offsetX + padL, baseY);
    s.samples.forEach(pt => {
      const x = offsetX + padL + (pt.x / L) * plotW;
      const y = baseY + (pt.M / maxM) * (plotH - 45);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(offsetX + padL + plotW, baseY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(2, 132, 199, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const fChord = s.maxGlobalM / Math.max(0.4, trussState.ridgeHeight);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px Inter, Sarabun, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`แผนภาพโมเมนต์ดัดรวม M(x) — M_max = ${s.maxGlobalM.toFixed(0)} kg·m`, offsetX + padL, 26);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`M_max = ${s.maxGlobalM.toFixed(0)} kg·m (${(s.maxGlobalM / 1000).toFixed(2)} ton·m) • แรงคอร์ดโดยประมาณ M/h ≈ ${fChord.toFixed(0)} kg`, offsetX + padL + plotW / 2, padT + plotH + 24);
  }
}

function populateTrussCalculationReport() {
  if (!trussSolution) buildTrussGeometryAndSolve();
  const s = trussSolution;
  if (!s) return;

  const presetObj = TRUSS_EDUCATIONAL_PRESETS[trussState.presetKey];
  const modelTitle = presetObj ? presetObj.title : `Roof Truss L=${trussState.span}m (${trussState.diagPattern.toUpperCase()})`;
  const allPass = s.passCount === s.members.length;

  const setTxt = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  setTxt('repTrussModelTitle', modelTitle);
  setTxt('repTrussMethodSteel', `${trussState.designMethod} • ${trussState.steelGrade} (Fy = ${trussState.Fy.toLocaleString()} ksc)`);
  setTxt('repTrussDimSummary', `Span L = ${trussState.span.toFixed(1)} m × ยาว ${trussState.bldgLength.toFixed(1)} m (${trussState.numTrusses} โครง @ ${trussState.baySpacing} m)`);

  const statusEl = document.getElementById('repTrussStatusBadge');
  if (statusEl) {
    statusEl.className = allPass ? 'ml-1 font-bold text-emerald-700' : 'ml-1 font-bold text-rose-600';
    statusEl.innerText = allPass
      ? `ผ่านทุกชิ้นส่วน (${s.passCount}/${s.members.length}) • Ratio=${s.maxRatio.toFixed(2)}`
      : `ไม่ผ่าน ${s.members.length - s.passCount} ชิ้น • Ratio=${s.maxRatio.toFixed(2)}`;
  }

  // 1. Parameters Table
  const paramsTable = document.getElementById('repTrussParamsTable');
  if (paramsTable) {
    const purlinSec = getTrussSec(trussState.secPurlin);
    const totalPurlinKg = (trussState.panels + 1) * trussState.bldgLength * purlinSec.kg;
    const totalSteelKg = s.trussSteelWeightKg * trussState.numTrusses + totalPurlinKg;

    paramsTable.innerHTML = `
      <thead>
        <tr>
          <th>พารามิเตอร์เรขาคณิต</th>
          <th>ค่าที่ใช้</th>
          <th>พารามิเตอร์น้ำหนักบรรทุก & ผลลัพธ์</th>
          <th>ค่าที่คำนวณได้</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ช่วงพาดโครงถัก (Span L) / จำนวนช่อง</td>
          <td><strong>${trussState.span.toFixed(2)} m</strong> (${trussState.panels} ช่อง)</td>
          <td>น้ำหนักคงที่ (DL) / น้ำหนักจรหลังคา (LL)</td>
          <td><strong>${trussState.dlRoof.toFixed(1)} / ${trussState.llRoof.toFixed(1)} kg/m²</strong></td>
        </tr>
        <tr>
          <td>ความสูงยอดจั่ว (H_ridge) / ชายคา (H_eave)</td>
          <td><strong>${trussState.ridgeHeight.toFixed(2)} m / ${trussState.eaveHeight.toFixed(2)} m</strong> (θ = ${s.avgSlopeDeg.toFixed(1)}°)</td>
          <td>น้ำหนักแผงโซลาร์เซลล์ (Solar Roof)</td>
          <td><strong>${trussState.hasSolar ? `${s.solarTotal.toFixed(1)} kg/m²` : 'ไม่มี (0 kg/m²)'}</strong></td>
        </tr>
        <tr>
          <td>ระยะห่างโครงถัก (s) × จำนวนโครง (N)</td>
          <td><strong>${trussState.baySpacing.toFixed(2)} m × ${trussState.numTrusses} โครง</strong> (ยาว ${trussState.bldgLength.toFixed(1)} m)</td>
          <td>น้ำหนักรวมออกแบบ (q_design) / แรงกระจาย (w)</td>
          <td><strong>${s.qGravity_m2.toFixed(1)} kg/m² (${s.wGravity.toFixed(1)} kg/m)</strong></td>
        </tr>
        <tr>
          <td>เสารับโครงหลังคา / เสากลาง (แกน B)</td>
          <td><strong>${trussState.hasColumns ? `สูง ${trussState.colHeight.toFixed(1)} m (${trussState.secCol})` : 'ไม่คิดเสา'} • ${trussState.hasCenterCol ? 'มีเสากลาง' : 'ช่วงเดี่ยว'}</strong></td>
          <td>แรงปฏิกิริยาที่จุดรองรับ (RA / RB${trussState.hasCenterCol ? ' / RM' : ''})</td>
          <td><strong>RA = ${s.gravRes.RA.toFixed(0)} kg, RB = ${s.gravRes.RB.toFixed(0)} kg${trussState.hasCenterCol ? `, RM = ${s.gravRes.RM.toFixed(0)} kg` : ''}</strong></td>
        </tr>
        <tr>
          <td>น้ำหนักเหล็กโครงถัก 1 โครง / รวมทั้งอาคาร</td>
          <td><strong>${s.trussSteelWeightKg.toFixed(1)} kg/โครง • รวม ${(totalSteelKg / 1000).toFixed(2)} ตัน</strong></td>
          <td>การแอ่นตัวสูงสุด (δ_max) / อัตราส่วนกำลังสูงสุด</td>
          <td><strong>δ = ${s.gravRes.maxDeflMm.toFixed(2)} mm • Max Ratio = ${s.maxRatio.toFixed(2)} (${allPass ? 'PASS' : 'FAIL'})</strong></td>
        </tr>
      </tbody>
    `;
  }

  // 2 & 3. Draw 2D FBD, 3D Isometric, and SFD/BMD Canvases
  drawReportTruss2DCanvas('repTruss2DCanvas');
  drawReportTruss3DCanvas('repTruss3DCanvas');
  drawReportTrussDiagramsCanvas('repTrussDiagramsCanvas');

  // 4.1 Wind Load Box
  const windBox = document.getElementById('repTrussWindBox');
  if (windBox) {
    windBox.innerHTML = `
      <div>พื้นที่ลม: <strong>โซน ${trussState.windZone} (V50 = ${s.V50} m/s)</strong> • ภูมิประเทศ: <strong>Terrain ${trussState.windTerrain} (Ce = ${s.Ce.toFixed(2)})</strong></div>
      <div>หน่วยแรงดันลมอ้างอิง (qz): <strong>${s.qz_kgm2.toFixed(1)} kg/m² (${s.qz_Pa.toFixed(0)} Pa)</strong></div>
      <div>แรงลมดูดยกหลังคา (w_uplift): <strong>-${s.windUplift_m2.toFixed(1)} kg/m² (|Cp| = ${trussState.windCp})</strong></div>
      <div>น้ำหนักสุทธิกรณีลมยก (q_net): <strong>${s.qUpliftNet_m2.toFixed(1)} kg/m² (${s.wUplift.toFixed(1)} kg/m)</strong></div>
    `;
  }

  // 4.2 Purlin Design Box
  const purlinBox = document.getElementById('repTrussPurlinBox');
  if (purlinBox) {
    const sec = getTrussSec(trussState.secPurlin);
    const spanP = trussState.baySpacing;
    const sp = trussState.purlinSpacing;
    const theta = s.avgSlopeRad;
    const wTotal = (s.qGravity_m2 * sp) + sec.kg;
    const wx = wTotal * Math.cos(theta);
    const wy = wTotal * Math.sin(theta);
    const contMap = { simple: 1 / 8, cont2: 1 / 8, cont3: 1 / 10 };
    const deflMap = { simple: 5 / 384, cont2: 2.1 / 384, cont3: 2.6 / 384 };
    const mCoeff = contMap[trussState.purlinContinuity] || (1 / 8);
    const dCoeff = deflMap[trussState.purlinContinuity] || (5 / 384);
    const Mx_kgm = mCoeff * wx * spanP * spanP;
    const Ly = spanP / (trussState.purlinSagRods + 1);
    const My_kgm = (1 / 8) * wy * Ly * Ly;
    const Sx = sec.Ix / (sec.d / 20);
    const Sy = sec.Iy / (sec.b / 20);
    const fbx = (Mx_kgm * 100) / Sx;
    const fby = (My_kgm * 100) / Sy;
    const Fb = trussState.designMethod === 'LRFD' ? (0.90 * trussState.Fy) : (0.60 * trussState.Fy);
    const ratioPurlin = (fbx / Fb) + (fby / Fb);
    const deflMm = ((dCoeff * (wx / 100) * Math.pow(spanP * 100, 4)) / (trussState.E * sec.Ix)) * 10;
    const allowDeflMm = (spanP * 1000) / trussState.purlinDeflLimit;
    const isOk = ratioPurlin <= 1.0 && deflMm <= allowDeflMm;

    purlinBox.innerHTML = `
      <div>หน้าตัดแป: <strong>${sec.name}</strong> (@ ${sp.toFixed(2)} m, Sag Rod ${trussState.purlinSagRods} เส้น)</div>
      <div>โมเมนต์ดัดสองแกน: <strong>Mx = ${Mx_kgm.toFixed(1)} kg·m, My = ${My_kgm.toFixed(1)} kg·m</strong></div>
      <div>การแอ่นตัวของแป: <strong>δ = ${deflMm.toFixed(2)} mm ≤ L/${trussState.purlinDeflLimit} (${allowDeflMm.toFixed(1)} mm)</strong></div>
      <div>อัตราส่วนกำลังแป (Interaction): <strong>Ratio = ${ratioPurlin.toFixed(2)} → ${isOk ? 'ผ่านเกณฑ์ (PASS)' : 'ไม่ผ่าน (FAIL)'}</strong></div>
    `;
  }

  // 6. Selected Steel Sections Table
  const secTable = document.getElementById('repTrussSectionsTable');
  if (secTable) {
    const secRows = [
      { role: 'คอร์ดบน (Top Chord - TC)', sec: getTrussSec(trussState.secTop) },
      { role: 'คอร์ดล่าง (Bottom Chord - BC)', sec: getTrussSec(trussState.secBot) },
      { role: 'เหล็กทแยง (Diagonal - D)', sec: getTrussSec(trussState.secDia) },
      { role: 'เหล็กตั้ง (Vertical - V)', sec: getTrussSec(trussState.secVer) },
      { role: 'แปหลังคา (Roof Purlin)', sec: getTrussSec(trussState.secPurlin) },
      { role: 'เสาอาคาร (Building Column)', sec: getTrussSec(trussState.secCol) }
    ];
    secTable.innerHTML = `
      <thead>
        <tr>
          <th>หมวดหมู่ชิ้นส่วนโครงสร้าง</th>
          <th>ขนาดหน้าตัดเหล็ก (Section)</th>
          <th>พื้นที่หน้าตัด A (cm²)</th>
          <th>โมเมนต์ความเฉื่อย Ix / Iy (cm⁴)</th>
          <th>รัศมีไจเรชัน r_min (cm)</th>
          <th>น้ำหนัก (kg/m)</th>
        </tr>
      </thead>
      <tbody>
        ${secRows.map(r => `
          <tr>
            <td class="text-left font-semibold">${r.role}</td>
            <td class="font-mono font-bold">${r.sec.name}</td>
            <td class="font-mono">${r.sec.A.toFixed(2)}</td>
            <td class="font-mono">${r.sec.Ix.toFixed(1)} / ${r.sec.Iy.toFixed(1)}</td>
            <td class="font-mono">${Math.min(r.sec.rx, r.sec.ry).toFixed(2)}</td>
            <td class="font-mono">${r.sec.kg.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 7. Member Forces & Capacity Check Table
  const memTable = document.getElementById('repTrussMembersTable');
  if (memTable) {
    memTable.innerHTML = `
      <thead>
        <tr>
          <th>ชิ้นส่วน</th>
          <th>หมวดหมู่</th>
          <th>หน้าตัดเหล็ก</th>
          <th>ความยาว (m)</th>
          <th>KL/r</th>
          <th>แรงกด Gravity (kg)</th>
          <th>แรงลมยก Uplift (kg)</th>
          <th>กำลังที่ยอมให้ (kg)</th>
          <th>Ratio</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        ${s.members.map(m => {
          const capKg = m.force >= 0 ? m.capTensionKg : m.capCompKg;
          const groupName = m.group === 'TC' ? 'Top Chord' : m.group === 'BC' ? 'Bottom Chord' : m.group === 'V' ? 'Vertical' : 'Diagonal';
          return `
            <tr>
              <td class="font-mono font-bold">${m.label}</td>
              <td>${groupName}</td>
              <td class="font-mono">${m.section.id}</td>
              <td class="font-mono">${m.length.toFixed(2)}</td>
              <td class="font-mono">${m.KLr.toFixed(1)}</td>
              <td class="font-mono">${m.fGrav >= 0 ? '+' : ''}${m.fGrav.toFixed(0)} (${m.fGrav >= 0 ? 'T' : 'C'})</td>
              <td class="font-mono">${m.fUplift >= 0 ? '+' : ''}${m.fUplift.toFixed(0)}</td>
              <td class="font-mono">${capKg.toFixed(0)}</td>
              <td class="font-mono font-bold">${m.ratio.toFixed(2)}</td>
              <td class="font-bold ${m.status === 'PASS' ? 'text-emerald-700' : 'text-rose-600'}">${m.status === 'PASS' ? 'ผ่าน (OK)' : 'ไม่ผ่าน (NG)'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
  }
}

// Ensure only the active module's report (1D, 2D, or Roof Truss 2D & 3D) is printed when Ctrl+P / window.print() is triggered
window.addEventListener('beforeprint', () => {
  if (typeof setReportSource === 'function') {
    if (typeof currentWorkspace !== 'undefined' && ['1d', '2d', 'truss'].includes(currentWorkspace)) {
      setReportSource(currentWorkspace);
    } else {
      const activeSrc = (typeof reportSourceMode !== 'undefined' && ['1d', '2d', 'truss'].includes(reportSourceMode))
        ? reportSourceMode
        : '1d';
      setReportSource(activeSrc);
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('workspace-truss')) {
      initTrussCalculator();
    }
  }, 80);
});

