/*************************************************************************
 * GLOBAL STATE & BILINGUAL DICTIONARY (THAI / ENGLISH)
 *************************************************************************/
let currentWorkspace = '1d'; // '1d', '2d', '3d', 'section', 'report'
let currentLang = 'th';
let unitSystem = 'metric';
let isDarkMode = document.documentElement.classList.contains('dark');
let hoveredBeamX = 2.485;
let isProbeLocked = false;
let customLogoDataUrl = null;
let reportSourceMode = '1d'; // '1d' or '2d'

const i18n = {
  th: {
    appSubHeader: "แพลตฟอร์มวิเคราะห์โครงสร้างวิศวกรรมโยธา • คาน 1D • โครง 2D • โมเดล 3D • แปลงหน่วย & ทฤษฎี",
    headerDevCredit: "พัฒนาโดย: นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)",
    nav1DBeam: "1D คำนวณคาน",
    nav2DFrame: "2D โครงข้อแข็ง & ถัก",
    nav3DViewer: "3D โมเดล",
    navTrussCalc: "คำนวณโครงถัก (2D/3D)",
    navSectionBuilder: "สร้างหน้าตัด",
    navConverters: "แปลงหน่วย & ทฤษฎี",
    navCalcReport: "รายงาน PDF",
    btnAIModeler: "AI สร้างโครงสร้าง",
    btnProjects: "โปรเจกต์ & ประวัติ",
    btn1DGalleryModal: "คลังตัวอย่างคาน 1D (Modal)",
    presetsLabel: "แม่แบบคาน 1D:",
    preset_ss_point: "คานช่วงเดี่ยว (แรงจุดกึ่งกลาง)",
    preset_ss_udl: "คานช่วงเดี่ยว (แรงกระจาย UDL)",
    preset_triangular: "แรงแผ่สามเหลี่ยม (เริ่มจาก 0)",
    preset_trapezoidal: "แรงแผ่คางหมู (w₁→w₂)",
    preset_cantilever: "คานยื่น Cantilever",
    preset_fixed_fixed: "คานยึดแน่น 2 ข้าง (Fixed-Fixed)",
    preset_continuous: "คานต่อเนื่อง 2 ช่วง (2-Span)",
    preset_overhang: "คานมีปลายยื่น (Overhanging)",
    btnHideBeamCards: "ซ่อนแผงรูปคาน",
    btnShowBeamCards: "แสดงแผงรูปคานทั้งหมด",
    vbHeaderTitle: "คลังรูปแบบคาน 1D สำเร็จรูป (Visual Beam Model Templates) — คลิกเลือกรูปคานเพื่อคำนวณทันที",
    vbHeaderSub: "เลื่อนซ้าย-ขวาได้ในกรณีหน้าจอเล็ก • แสดงผังโครงสร้างและแรงกระทำพร้อมคำนวณอัตโนมัติ",
    vbBadgeCount: "9 รูปแบบมาตรฐาน",
    vb1Sub: "คานต่อเนื่องยื่น 3 จุดรองรับ",
    vb1Meta: "L=5.4m • UDL+แรงจุด",
    vb2Title: "คานเดี่ยว + แรงจุด",
    vb2Sub: "แรงกระทำกึ่งกลาง",
    vb3Title: "คานเดี่ยว + UDL",
    vb3Sub: "แรงแผ่สม่ำเสมอ",
    vb4Title: "สามเหลี่ยม (เริ่มจาก 0)",
    vb4Sub: "ลาดเอียง 0 ถึง w₂",
    vb5Title: "คางหมู (w₁→w₂)",
    vb5Sub: "ไม่สมมาตร",
    vb6Title: "คานยื่น Cantilever",
    vb6Sub: "ปลายอิสระ (Fixed)",
    vb7Title: "ยึดแน่น 2 ข้าง",
    vb7Sub: "Fixed-Fixed",
    vb8Title: "คานต่อเนื่อง 2 ช่วง",
    vb8Sub: "3 จุดรองรับ",
    vb9Title: "คานมีปลายยื่น",
    vb9Sub: "สแปน + คานยื่น",
    vb9Meta: "L=8.0m • ยื่น 2.5m",
    vbSelectCalc: "เลือกคำนวณ",
    secPropertiesTitle: "เรขาคณิตและคุณสมบัติหน้าตัด",
    btnSecModeUse: "คิดหน้าตัด (ปกติ)",
    btnSecModeIgnore: "ไม่คิดหน้าตัด",
    noSecBannerTitle: "โหมดไม่คิดหน้าตัด (EI คงที่ • ตามโจทย์การบ้าน)",
    noSecBannerDesc: "คำนวณอิสระโดยไม่นำค่าหน้าตัด (E, I, A, h, y) มาคิด ค่าแรงปฏิกิริยา R, แรงเฉือน V, โมเมนต์ดัด M และการแอ่นตัวสัมพัทธ์ EIθ, EIδ จะตรงตามโจทย์ในหนังสือเรียน",
    materialPresetLabel: "เลือกหน้าตัดมาตรฐาน / คลังหน้าตัด",
    secOptNone: "★ ไม่คิดหน้าตัด — โหมดโจทย์การบ้านทั่วไป (EI คงที่ / ไม่ระบุหน้าตัด)",
    secOptSteelW: "เหล็กรูปพรรณ W-Beam W310x38.7 (W12x26)",
    secOptRCRect: "คอนกรีตเสริมเหล็ก RC (300 × 500 มม.)",
    secOptTimber: "ไม้โครงสร้าง Glulam (150 × 300 มม.)",
    secOptSteelTube: "เหล็กกล่องกลวง HSS (200 × 100 × 8 มม.)",
    secOptCustom: "กำหนดเอง (Custom Section...)",
    paramLength: "ความยาวคาน L",
    paramE: "มอดุลัสยืดหยุ่น E",
    paramI: "โมเมนต์ความเฉื่อย I",
    paramArea: "พื้นที่หน้าตัด A",
    paramDepth: "ความลึกหน้าตัด h",
    paramFiberY: "ระยะขอบนอกสุด y",
    supportsTitle: "จุดรองรับ (Supports)",
    supportTypeLabel: "ชนิดจุดรองรับ",
    sup_pinned: "ยึดหมุน Pinned (Ry)",
    sup_roller: "เลื่อนได้ Roller (Ry)",
    sup_fixed: "ยึดแน่น Fixed (Ry, Mz)",
    supportPosLabel: "ตำแหน่ง x",
    thType: "ชนิด",
    thPosition: "ตำแหน่ง x",
    thAction: "ลบ",
    loadsTitle: "แรงกระทำบนคาน (Loads)",
    tabPointLoad: "แรงจุด (Point)",
    tabUDLLoad: "แรงกระจาย (UDL)",
    tabMomentLoad: "โมเมนต์ (Moment)",
    loadMagP: "ขนาดแรง P",
    loadPosLabel: "ตำแหน่ง x",
    lblPointDir: "ทิศทางแรงจุด (Direction)",
    optPointDown: "↓ แรงกดลงจากข้างบน (Downward Load)",
    optPointUp: "↑ แรงดันขึ้นจากข้างล่าง (Upward Force / Uplift)",
    lblUDLShape: "รูปแบบ:",
    btnUDLTriInc: "สามเหลี่ยม 0→w₂",
    btnUDLTriDec: "สามเหลี่ยม w₁→0",
    btnUDLTrap: "คางหมู",
    btnUDLUni: "สม่ำเสมอ",
    lblUDLw1: "w₁ เริ่มต้น",
    lblUDLw2: "w₂ สิ้นสุด",
    lblUDLDir: "ทิศทางแรงแผ่ (Direction)",
    optUDLDown: "↓ แรงแผ่กดลง (Downward Distributed Load)",
    optUDLUp: "↑ แรงแผ่ดันขึ้น (Upward Distributed Load)",
    btnAddLoad: "เพิ่มแรงกระทำบนคาน",
    thMagnitude: "ขนาด",
    thSpanStation: "ตำแหน่ง",
    schematicTitle: "แบบจำลองโครงสร้างคานและผังวัตถุอิสระ (1D Beam Schematic & FBD)",
    stationSliderLabel: "ตรวจสอบหน้าตัด x:",
    showFBDLabel: "แสดงแรงปฏิกิริยา FBD",
    showGhostDeflLabel: "เส้นการแอ่นตัว",
    cardMaxV: "แรงเฉือนสูงสุด |V|",
    cardMaxM: "โมเมนต์ดัดสูงสุด |M|",
    cardMaxSlope: "มุมลาดชันสูงสุด |θ|",
    cardMaxDelta: "การแอ่นตัวสูงสุด |δ|",
    cardMaxEITheta: "มุมลาดชันสัมพัทธ์ |EIθ|",
    cardMaxEIDelta: "การแอ่นตัวสัมพัทธ์ |EIδ|",
    reactionsTitle: "แรงปฏิกิริยาที่จุดรองรับ (Support Reactions)",
    w2dHeaderTitle: "2D Structural Analysis",
    w2dHeaderSub: "Frame & truss workspace (คลิกและลากชิ้นส่วนคำนวณอัตโนมัติแบบเรียลไทม์)",
    w2dAutoSaved: "บันทึกอัตโนมัติ • คำนวณ FEA แบบเรียลไทม์",
    btnView2DIn3D: "ดูโมเดล 3D",
    btnRunAnalysis: "Run analysis",
    toolSelect: "Select / ลากจุด",
    toolNode: "Node",
    toolMemberFrame: "Member (Frame)",
    toolMemberTruss: "Truss (Pin)",
    toolSupport: "Support",
    toolLoad: "Load",
    toolErase: "Erase",
    w3dTitle: "3D Interactive Structural Analysis Viewer (จำลองโครงสร้างและแรงกระทำ 3 มิติแบบเรียลไทม์)",
    w3dSub: "คลิกซ้ายค้างเพื่อจับหมุนโครงสร้าง 360° • คลิกขวาเพื่อเลื่อน • หมุนลูกกลิ้งเมาส์เพื่อซูม • แสดงค่าแรงแบบเรียลไทม์",
    repHeaderTitle: "รายงานรายการคำนวณโครงสร้าง",
    repBtn1D: "รายงานคำนวณคาน 1D (แผ่นที่ 1–3)",
    repBtn2D: "รายงานวิเคราะห์โครงสร้าง 2D (แผ่นที่ 1–2)",
    repBtnTruss: "รายงานโครงหลังคาเหล็ก 2D & 3D (แผ่นที่ 1–3)",
    repLblModelName: "ชื่อโมเดล:",
    repLblDesigner: "ผู้พัฒนา / ผู้ออกแบบ:",
    repLblDate: "วันที่:",
    repLblBrand: "หัวกระดาษ:",
    repBtnCustomLogo: "อัปโหลดโลโก้หน่วยงาน",
    repBtnExportPDF: "พิมพ์ / ส่งออก PDF",
    repChecklistTitle: "สรุปรายการในรายงานคำนวณ PDF (คาน 1D • โครงสร้าง 2D • โครงหลังคาเหล็ก 2D & 3D):",
    repCheck1: "✓ สรุปข้อมูลแบบจำลองคาน & โครงถัก",
    repCheck2: "✓ ข้อมูลแรงกระทำ แรงลม และจุดรองรับ",
    repCheck3: "✓ ผลลัพธ์แรงปฏิกิริยา & แรงในชิ้นส่วน",
    repCheck4: "✓ แผนภาพ 2D FBD, 3D Isometric, SFD & BMD",
    repCheck5: "✓ ตรวจสอบกำลังหน้าตัดเหล็ก & การออกแบบแป",
    repCheck6: "✓ รองรับโลโก้หน่วยงาน & ส่งออกรายงาน PDF ไม่จำกัด (Version 2.0)",
    repSheetModelName: "ชื่อโมเดล:",
    repSheetDesigner: "ผู้ออกแบบ:",
    repSheetUnits: "ระบบหน่วย:",
    repSheetDate: "วันที่:",
    repSheetNo: "แผ่นที่:",
    repPage1of3: "แผ่นที่ 1 จาก 3",
    repPage2of3: "แผ่นที่ 2 จาก 3",
    repPage3of3: "แผ่นที่ 3 จาก 3",
    repThType: "ประเภทข้อมูล (Type)",
    repThLoc: "ตำแหน่ง",
    repThLoad: "ขนาดแรง",
    repSecPropsHeading: "คุณสมบัติหน้าตัด (Section Properties):",
    repReactionsHeading: "แรงปฏิกิริยาที่จุดรองรับ (Reactions):",
    repStressCheckHeading: "ตรวจสอบหน่วยแรงดัดและกำลังรับน้ำหนัก (Stress & Capacity Check)",
    repStiffHeading: "รายละเอียดคุณสมบัติหน้าตัดและสติฟเนส (Section & Stiffness Breakdown)",
    repExportedBy: "จัดทำรายงานโดย CivilMech Studio Version 2.0 • พัฒนาโดย นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)",
    rep2DReportTitle: "รายงานการวิเคราะห์โครงสร้าง 2 มิติ (2D Structural Analysis Report)",
    rep2DModelLbl: "โมเดล 2D:",
    rep2DSec1: "1. สรุปแรงปฏิกิริยาที่จุดรองรับ (Support Reactions Summary)",
    rep2DSec2: "2. สรุปแรงภายในชิ้นส่วนสูงสุด — แรงตามแนวแกน (N), แรงเฉือน (V), โมเมนต์ดัด (M)",
    rep2DSec3: "3. พิกัดจุดต่อและการเคลื่อนตัวของโครงสร้าง (Nodal Coordinates & Displacements)",
    rep2DPage1: "แผ่นที่ 1 จาก 1 (รายงานวิเคราะห์โครงข้อแข็งและโครงถัก 2D)",
    footerEdition: "รุ่นเพื่อการศึกษา",
    footerDesc: "ระบบวิเคราะห์และออกแบบโครงสร้างวิศวกรรมโยธา (1D Beam, 2D Frame & Truss, 3D Interactive, Roof Truss 2D/3D, Unit Converters & PDF Report • Version 2.0)",
    footerDevCredit: "<i class=\"fa-solid fa-user-graduate mr-1.5\"></i> ผู้พัฒนา: นาย ธนัตถ์ วงษ์อุ่น (นักศึกษา ECE2NR68)"
  },
  en: {
    appSubHeader: "1D Beam • 2D Frame & Truss Workspace • 3D Viewer • Clean PDF Reports",
    headerDevCredit: "Developed by: Mr. Thanat Wong-un (ECE2NR68)",
    nav1DBeam: "1D Beam",
    nav2DFrame: "2D Frame & Truss",
    nav3DViewer: "3D Viewer",
    navTrussCalc: "Roof Truss (2D/3D)",
    navSectionBuilder: "Section Builder",
    navConverters: "Unit Converters",
    navCalcReport: "PDF Report",
    btnAIModeler: "AI Modeler",
    btnProjects: "Projects & History",
    btn1DGalleryModal: "1D Beam Library (Modal)",
    presetsLabel: "1D Beam Presets:",
    preset_ss_point: "Simply Supported (Point)",
    preset_ss_udl: "Simply Supported (UDL)",
    preset_triangular: "Triangular Load (0→w)",
    preset_trapezoidal: "Trapezoidal Load (w₁→w₂)",
    preset_cantilever: "Cantilever Beam",
    preset_fixed_fixed: "Fixed-Fixed Beam",
    preset_continuous: "2-Span Continuous",
    preset_overhang: "Overhanging Beam",
    btnHideBeamCards: "Hide Beam Cards",
    btnShowBeamCards: "Show All Beam Cards",
    vbHeaderTitle: "1D Visual Beam Model Templates — Click any card to load & solve immediately",
    vbHeaderSub: "Scroll left/right on smaller screens • Instant Free-Body Diagram & FEA calculation",
    vbBadgeCount: "9 Standard Models",
    vb1Sub: "3-Support Overhanging Beam",
    vb1Meta: "L=5.4m • UDL+Point",
    vb2Title: "Simply Supported + Point",
    vb2Sub: "Mid-Span Point Load",
    vb3Title: "Simply Supported + UDL",
    vb3Sub: "Uniform Distributed Load",
    vb4Title: "Triangular Ramp (0→w)",
    vb4Sub: "Linear Ramp 0 to w₂",
    vb5Title: "Trapezoidal (w₁→w₂)",
    vb5Sub: "Non-Uniform Ramp",
    vb6Title: "Cantilever Beam",
    vb6Sub: "Fixed-Free End Load",
    vb7Title: "Fixed-Fixed Beam",
    vb7Sub: "Both Ends Fixed",
    vb8Title: "2-Span Continuous",
    vb8Sub: "3 Supports Continuous",
    vb9Title: "Overhanging Beam",
    vb9Sub: "Main Span + Overhang",
    vb9Meta: "L=8.0m • Overhang 2.5m",
    vbSelectCalc: "Load & Solve",
    secPropertiesTitle: "Geometry & Section Properties",
    btnSecModeUse: "Use Section",
    btnSecModeIgnore: "No Section",
    noSecBannerTitle: "No Cross-Section Mode (Constant EI • Textbook Mode)",
    noSecBannerDesc: "Section properties (E, I, A, h, y) are ignored. Support reactions R, Shear V, Moment M, and relative EIθ, EIδ match textbook homework solutions.",
    materialPresetLabel: "Standard / Cloud Section Preset",
    secOptNone: "★ No Cross-Section — Textbook Homework Mode (Constant EI)",
    secOptSteelW: "Structural Steel W-Beam W310x38.7 (W12x26)",
    secOptRCRect: "Reinforced Concrete RC (300 × 500 mm)",
    secOptTimber: "Structural Glulam Timber (150 × 300 mm)",
    secOptSteelTube: "Hollow Structural Section HSS (200 × 100 × 8 mm)",
    secOptCustom: "Custom Section Properties...",
    paramLength: "Beam Length L",
    paramE: "Elastic Modulus E",
    paramI: "Moment of Inertia I",
    paramArea: "Cross-Section Area A",
    paramDepth: "Section Depth h",
    paramFiberY: "Extreme Fiber y",
    supportsTitle: "Boundary Supports",
    supportTypeLabel: "Support Type",
    sup_pinned: "Pinned (Ry)",
    sup_roller: "Roller (Ry)",
    sup_fixed: "Fixed (Ry, Mz)",
    supportPosLabel: "Position x",
    thType: "Type",
    thPosition: "Position x",
    thAction: "Del",
    loadsTitle: "Applied Loads",
    tabPointLoad: "Point Load",
    tabUDLLoad: "Distributed (UDL)",
    tabMomentLoad: "Moment",
    loadMagP: "Magnitude P",
    loadPosLabel: "Position x",
    lblPointDir: "Point Load Direction",
    optPointDown: "↓ Downward Load (Top-Down)",
    optPointUp: "↑ Upward Force / Uplift (Bottom-Up)",
    lblUDLShape: "Shape:",
    btnUDLTriInc: "Triangle 0→w₂",
    btnUDLTriDec: "Triangle w₁→0",
    btnUDLTrap: "Trapezoid",
    btnUDLUni: "Uniform",
    lblUDLw1: "Start w₁",
    lblUDLw2: "End w₂",
    lblUDLDir: "Distributed Load Direction",
    optUDLDown: "↓ Downward Distributed Load",
    optUDLUp: "↑ Upward Distributed Load",
    btnAddLoad: "Add Applied Load",
    thMagnitude: "Magnitude",
    thSpanStation: "Station",
    schematicTitle: "1D Beam Schematic & Free Body Diagram (FBD)",
    stationSliderLabel: "Inspect Station x:",
    showFBDLabel: "Show FBD Reactions",
    showGhostDeflLabel: "Deflected Shape",
    cardMaxV: "Max Shear Force |V|",
    cardMaxM: "Max Bending Moment |M|",
    cardMaxSlope: "Max Slope |θ|",
    cardMaxDelta: "Max Deflection |δ|",
    cardMaxEITheta: "Relative Slope |EIθ|",
    cardMaxEIDelta: "Relative Deflection |EIδ|",
    reactionsTitle: "Computed Support Reactions",
    w2dHeaderTitle: "2D Structural Analysis",
    w2dHeaderSub: "Frame & truss interactive workspace",
    w2dAutoSaved: "Recovered locally • Real-time FEA Solver Active",
    btnView2DIn3D: "View in 3D",
    btnRunAnalysis: "Run analysis",
    toolSelect: "Select",
    toolNode: "Node",
    toolMemberFrame: "Member (Frame)",
    toolMemberTruss: "Truss (Pin)",
    toolSupport: "Support",
    toolLoad: "Load",
    toolErase: "Erase",
    w3dTitle: "3D Interactive Structural Analysis Viewer",
    w3dSub: "Left-click drag to orbit 360° • Right-click drag to pan • Scroll to zoom • Real-time force vectors",
    repHeaderTitle: "CALCULATION REPORT",
    repBtn1D: "1D Beam Report (Sheets 1–3)",
    repBtn2D: "2D Structural Analysis Report (Sheets 1–2)",
    repBtnTruss: "Roof Truss 2D & 3D Report (Sheets 1–3)",
    repLblModelName: "Model Name:",
    repLblDesigner: "Designer:",
    repLblDate: "Date:",
    repLblBrand: "Brand:",
    repBtnCustomLogo: "Custom Company Logo",
    repBtnExportPDF: "Export Clean PDF",
    repChecklistTitle: "Create clean Beam, 2D & Roof Truss 2D/3D calculation reports:",
    repCheck1: "✓ Beam & Truss model summary",
    repCheck2: "✓ Loads, wind & supports data",
    repCheck3: "✓ Reaction & axial force results",
    repCheck4: "✓ 2D FBD, 3D Isometric, SFD & BMD diagrams",
    repCheck5: "✓ Steel capacity & purlin design checks",
    repCheck6: "✓ Custom company logo & Unlimited PDF reports (Version 2.0)",
    repSheetModelName: "Model Name:",
    repSheetDesigner: "Designer:",
    repSheetUnits: "Units:",
    repSheetDate: "Date:",
    repSheetNo: "Sheet No.:",
    repPage1of3: "Sheet 1 of 3",
    repPage2of3: "Sheet 2 of 3",
    repPage3of3: "Sheet 3 of 3",
    repThType: "Type",
    repThLoc: "Location",
    repThLoad: "Load",
    repSecPropsHeading: "Section Properties:",
    repReactionsHeading: "Reactions:",
    repStressCheckHeading: "Detailed Stress & Capacity Check",
    repStiffHeading: "Section Property & Stiffness Breakdown",
    repExportedBy: "Exported by CivilMech Studio Version 2.0 • Developed by Mr. Thanat Wong-un (ECE2NR68)",
    rep2DReportTitle: "2D Structural Analysis Report",
    rep2DModelLbl: "2D Model:",
    rep2DSec1: "1. Support Reactions Summary",
    rep2DSec2: "2. Member Internal Force Envelope — Axial (N), Shear (V), Moment (M)",
    rep2DSec3: "3. Nodal Coordinates & Displacements",
    rep2DPage1: "Sheet 1 of 1 (2D Frame & Truss Analysis)",
    footerEdition: "Academic Edition",
    footerDesc: "Civil & Structural Engineering Analysis Suite (1D Beam, 2D Frame & Truss, 3D Interactive, Roof Truss 2D/3D, Unit Converters & PDF Report • Version 2.0)",
    footerDevCredit: "<i class=\"fa-solid fa-user-graduate mr-1.5\"></i> Developer: Mr. Thanat Wong-un (Student ECE2NR68)"
  }
};

/*************************************************************************
 * WORKSPACE NAVIGATION & GLOBAL UI CONTROLS
 *************************************************************************/
function switchWorkspace(ws) {
  const prevWorkspace = currentWorkspace;
  currentWorkspace = ws;
  const sections = ['1d', '2d', '3d', 'truss', 'section', 'report', 'converters'];
  const tabIds = {
    '1d': 'navTab1D',
    '2d': 'navTab2D',
    '3d': 'navTab3D',
    'truss': 'navTabTruss',
    'section': 'navTabSection',
    'report': 'navTabReport',
    'converters': 'navTabConverters'
  };

  const mobTabIds = {
    '1d': 'mobNav1D',
    '2d': 'mobNav2D',
    '3d': 'mobNav3D',
    'truss': 'mobNavTruss',
    'section': 'mobNavSection',
    'report': 'mobNavReport',
    'converters': 'mobNavConverters'
  };

  sections.forEach(s => {
    const secEl = document.getElementById(`workspace-${s}`);
    const btnEl = document.getElementById(tabIds[s]);
    const mobBtnEl = document.getElementById(mobTabIds[s]);
    if (!secEl || !btnEl) return;
    if (s === ws) {
      secEl.classList.remove('hidden');
      secEl.classList.add('flex');
      btnEl.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs';
      if (mobBtnEl) {
        mobBtnEl.className = 'flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 transition-all';
      }
    } else {
      secEl.classList.add('hidden');
      secEl.classList.remove('flex');
      btnEl.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      if (mobBtnEl) {
        mobBtnEl.className = 'flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
      }
    }
  });

  if (window.innerWidth < 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (ws === '1d') {
    setTimeout(() => solveAndRender(), 20);
  } else if (ws === '2d') {
    setTimeout(() => {
      if (typeof resize2DCanvas === 'function') resize2DCanvas();
      if (typeof solve2DFrame === 'function') solve2DFrame();
    }, 30);
  } else if (ws === '3d') {
    setTimeout(() => {
      if (typeof resize3DCanvas === 'function') resize3DCanvas();
      if (typeof render3DScene === 'function') render3DScene();
    }, 30);
  } else if (ws === 'truss') {
    setTimeout(() => {
      if (typeof solveAndRenderTruss === 'function') solveAndRenderTruss();
    }, 30);
  } else if (ws === 'section') {
    setTimeout(() => {
      if (typeof computeSectionBuilder === 'function') computeSectionBuilder();
      if (typeof renderSavedSectionsLibrary === 'function') renderSavedSectionsLibrary();
    }, 30);
  } else if (ws === 'report') {
    setTimeout(() => {
      if (prevWorkspace === 'truss' && typeof setReportSource === 'function') {
        setReportSource('truss');
      } else if (prevWorkspace === '2d' && typeof setReportSource === 'function') {
        setReportSource('2d');
      } else if (prevWorkspace === '1d' && typeof setReportSource === 'function') {
        setReportSource('1d');
      } else if (typeof refreshCalculationReport === 'function') {
        refreshCalculationReport();
      }
    }, 40);
  } else if (ws === 'converters') {
    setTimeout(() => {
      if (typeof initConverters === 'function') initConverters();
    }, 30);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  const btnTH = document.getElementById('btnLangTH');
  const btnEN = document.getElementById('btnLangEN');
  if (lang === 'th') {
    btnTH.className = 'px-1.5 sm:px-2 py-0.5 rounded-md transition-all bg-sky-600 text-white shadow-2xs';
    btnEN.className = 'px-1.5 sm:px-2 py-0.5 rounded-md transition-all text-slate-600 dark:text-slate-400';
  } else {
    btnEN.className = 'px-1.5 sm:px-2 py-0.5 rounded-md transition-all bg-sky-600 text-white shadow-2xs';
    btnTH.className = 'px-1.5 sm:px-2 py-0.5 rounded-md transition-all text-slate-600 dark:text-slate-400';
  }

  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k]) el.innerHTML = dict[k];
  });

  // Update Hide/Show Beam Cards button based on current panel visibility
  const panel = document.getElementById('beamVisualTemplatesPanel');
  const lblBtn = document.getElementById('lblToggleTemplates');
  if (panel && lblBtn) {
    lblBtn.innerText = panel.classList.contains('hidden') ? dict.btnShowBeamCards : dict.btnHideBeamCards;
  }

  // Update Designer input default value when switching between TH and EN
  const designerInput = document.getElementById('repDesignerInput');
  if (designerInput) {
    const val = designerInput.value.trim();
    if (lang === 'en' && val === 'นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)') {
      designerInput.value = 'Mr. Thanat Wong-un (ECE2NR68)';
    } else if (lang === 'th' && val === 'Mr. Thanat Wong-un (ECE2NR68)') {
      designerInput.value = 'นาย ธนัตถ์ วงษ์อุ่น (ECE2NR68)';
    }
  }

  syncSectionModeUI();
  renderSupportsTable();
  renderLoadsTable();
  updateLoadActionButtons();
  renderCrossSectionVisualizer();
  updateKPIsAndReactions();
  renderBeamSchematic();
  renderAllDiagrams();
  updateProbeHUD(hoveredBeamX);
  if (typeof refreshCalculationReport === 'function') refreshCalculationReport();
  if (currentWorkspace === '2d' && typeof render2DWorkspace === 'function') render2DWorkspace();
  if (currentWorkspace === '3d' && typeof render3DScene === 'function') render3DScene();
}

function applyThemeIcon() {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    // Dark mode = moon icon, Light mode = sun icon (matches the currently active mode)
    icon.className = isDarkMode ? 'fa-solid fa-moon text-xs' : 'fa-solid fa-sun text-xs';
  }
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.title = isDarkMode ? 'โหมดมืด (กดเพื่อเปลี่ยนเป็นโหมดสว่าง)' : 'โหมดสว่าง (กดเพื่อเปลี่ยนเป็นโหมดมืด)';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDarkMode ? '#0f172a' : '#f8fafc');
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  const htmlEl = document.documentElement;
  if (isDarkMode) {
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
  }
  applyThemeIcon();
  try { localStorage.setItem('civilmech-theme', isDarkMode ? 'dark' : 'light'); } catch (e) {}
  renderCrossSectionVisualizer();
  renderBeamSchematic();
  renderAllDiagrams();
  if (currentWorkspace === '2d' && typeof render2DWorkspace === 'function') render2DWorkspace();
  if (currentWorkspace === '3d' && typeof render3DScene === 'function') render3DScene();
}

function showNotification(title, message, type = 'info') {
  const el = document.getElementById('appNotification');
  if (!el) return;
  document.getElementById('notifTitle').innerText = title;
  document.getElementById('notifMessage').innerText = message;
  const iconEl = document.getElementById('notifIcon');
  iconEl.innerHTML = type === 'error'
    ? '<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>'
    : '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
  el.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => el.classList.add('translate-y-24', 'opacity-0'), 3200);
}

/*************************************************************************
 * PART 1: 1D BEAM CALCULATOR & EXACT "4718-28th-SEC-D" MODEL
 *************************************************************************/
let model = {
  name: '4718-28th-SEC-D',
  sectionName: 'MK2 SOLDIER',
  ignoreSection: false, // true = โหมดไม่คิดหน้าตัด (EI คงที่ • ตามโจทย์การบ้าน)
  length: 5.4,
  E: 200.0,       // GPa (200,000 MPa)
  I: 534.6,       // cm⁴ (5,346,000 mm⁴)
  A: 22.52,       // cm² (2,252 mm²)
  depth: 225.0,   // mm
  y: 112.5,       // mm
  shape: 'steel_w',
  supports: [
    { id: 1, type: 'pinned', x: 0.4 },
    { id: 2, type: 'pinned', x: 1.85 },
    { id: 3, type: 'pinned', x: 4.85 }
  ],
  loads: [
    { id: 1, type: 'point', P: 27.5, x: 2.485 },
    { id: 2, type: 'point', P: 24.0, x: 4.285 },
    { id: 3, type: 'point', P: 12.4, x: 5.185 }
  ]
};

const sectionDatabase = {
  mk2_soldier: {
    name: 'MK2 SOLDIER', shape: 'steel_w',
    E_si: 200, I_si: 534.6, A_si: 22.52, d_si: 225, y_si: 112.5
  },
  steel_w: {
    name: 'W310x38.7 (W12x26)', shape: 'steel_w',
    E_si: 200, I_si: 8480, A_si: 49.4, d_si: 310, y_si: 155
  },
  rc_rect: {
    name: 'RC 300x500 mm', shape: 'rc_rect',
    E_si: 25, I_si: 312500, A_si: 1500, d_si: 500, y_si: 250
  },
  timber: {
    name: 'Glulam 150x300 mm', shape: 'timber',
    E_si: 12, I_si: 33750, A_si: 450, d_si: 300, y_si: 150
  },
  steel_tube: {
    name: 'HSS 200x100x8 mm', shape: 'steel_tube',
    E_si: 200, I_si: 2420, A_si: 45.4, d_si: 200, y_si: 100
  }
};

let solution = {
  isValid: false,
  dsi: 0,
  reactions: [],
  samples: [],
  maxPosV: { val: 0, x: 0 }, minNegV: { val: 0, x: 0 },
  maxPosM: { val: 0, x: 0 }, minNegM: { val: 0, x: 0 },
  maxPosSlope: { val: 0, x: 0 }, minNegSlope: { val: 0, x: 0 },
  maxPosDelta: { val: 0, x: 0 }, minNegDelta: { val: 0, x: 0 },
  maxV: { val: 0, x: 0 },
  maxM: { val: 0, x: 0 },
  maxSlope: { val: 0, x: 0 },
  maxDelta: { val: 0, x: 0 },
  maxSigma: { val: 0, x: 0 }
};

/*************************************************************************
 * UNIT CONVERSION ENGINE (INTERNAL SI <-> DISPLAY METRIC / IMPERIAL)
 *************************************************************************/
const Units = {
  isImp: () => unitSystem === 'imperial',
  // Unit Labels
  uLen: () => unitSystem === 'metric' ? 'm' : 'ft',
  uForce: () => unitSystem === 'metric' ? 'kN' : 'kip',
  uDist: () => unitSystem === 'metric' ? 'kN/m' : 'kip/ft',
  uMom: () => unitSystem === 'metric' ? 'kN·m' : 'kip·ft',
  uMomDash: () => unitSystem === 'metric' ? 'kN-m' : 'kip-ft',
  uDefl: () => unitSystem === 'metric' ? 'mm' : 'in',
  uDepth: () => unitSystem === 'metric' ? 'mm' : 'in',
  uE: () => unitSystem === 'metric' ? 'GPa' : 'ksi',
  uI: () => unitSystem === 'metric' ? 'cm⁴' : 'in⁴',
  uA: () => unitSystem === 'metric' ? 'cm²' : 'in²',
  uS: () => unitSystem === 'metric' ? 'cm³' : 'in³',
  uR: () => unitSystem === 'metric' ? 'cm' : 'in',
  uEI: () => unitSystem === 'metric' ? 'MN·m²' : 'kip·ft²',
  uEITheta: () => unitSystem === 'metric' ? 'kN·m²' : 'kip·ft²',
  uEIDelta: () => unitSystem === 'metric' ? 'kN·m³' : 'kip·ft³',
  uStress: () => unitSystem === 'metric' ? 'MPa' : 'ksi',

  // SI -> Display Value
  len: (m) => unitSystem === 'metric' ? m : m * 3.280839895,
  force: (kn) => unitSystem === 'metric' ? kn : kn * 0.2248089431,
  dist: (knm) => unitSystem === 'metric' ? knm : knm * 0.06852176586,
  mom: (knm) => unitSystem === 'metric' ? knm : knm * 0.7375621493,
  defl: (mm) => unitSystem === 'metric' ? mm : mm * 0.03937007874,
  depth: (mm) => unitSystem === 'metric' ? mm : mm * 0.03937007874,
  E: (gpa) => unitSystem === 'metric' ? gpa : gpa * 145.0377377,
  I: (cm4) => unitSystem === 'metric' ? cm4 : cm4 * 0.0240250961,
  A: (cm2) => unitSystem === 'metric' ? cm2 : cm2 * 0.15500031,
  S: (cm3) => unitSystem === 'metric' ? cm3 : cm3 * 0.0610237441,
  r: (cm) => unitSystem === 'metric' ? cm : cm * 0.3937007874,
  EI: (mnm2) => unitSystem === 'metric' ? mnm2 : mnm2 * 2419.846,
  eiTheta: (knm2) => unitSystem === 'metric' ? knm2 : knm2 * 0.2248089431 * Math.pow(3.280839895, 2),
  eiDelta: (knm3) => unitSystem === 'metric' ? knm3 : knm3 * 0.2248089431 * Math.pow(3.280839895, 3),
  stress: (mpa) => unitSystem === 'metric' ? mpa : mpa * 0.1450377377,

  // Display Value -> Internal SI
  toSILen: (v) => unitSystem === 'metric' ? v : v / 3.280839895,
  toSIForce: (v) => unitSystem === 'metric' ? v : v / 0.2248089431,
  toSIDist: (v) => unitSystem === 'metric' ? v : v / 0.06852176586,
  toSIMom: (v) => unitSystem === 'metric' ? v : v / 0.7375621493,
  toSIDepth: (v) => unitSystem === 'metric' ? v : v / 0.03937007874,
  toSIE: (v) => unitSystem === 'metric' ? v : v / 145.0377377,
  toSII: (v) => unitSystem === 'metric' ? v : v / 0.0240250961,
  toSIA: (v) => unitSystem === 'metric' ? v : v / 0.15500031
};

function setUnits(sys) {
  const prevSys = unitSystem;
  unitSystem = sys;

  document.getElementById('btnMetric').className = sys === 'metric'
    ? 'px-2 py-1 rounded-md transition-all bg-sky-600 text-white shadow-2xs'
    : 'px-2 py-1 rounded-md transition-all text-slate-600 dark:text-slate-400';
  document.getElementById('btnImperial').className = sys === 'imperial'
    ? 'px-2 py-1 rounded-md transition-all bg-sky-600 text-white shadow-2xs'
    : 'px-2 py-1 rounded-md transition-all text-slate-600 dark:text-slate-400';

  // Update all unit badge spans across the DOM
  document.querySelectorAll('.unit-len').forEach(el => el.innerText = Units.uLen());
  document.querySelectorAll('.unit-force').forEach(el => el.innerText = Units.uForce());
  document.querySelectorAll('.unit-dist').forEach(el => el.innerText = Units.uDist());
  document.querySelectorAll('.unit-moment').forEach(el => el.innerText = Units.uMom());
  document.querySelectorAll('.unit-e').forEach(el => el.innerText = Units.uE());
  document.querySelectorAll('.unit-i').forEach(el => el.innerText = Units.uI());
  document.querySelectorAll('.unit-area').forEach(el => el.innerText = Units.uA());
  document.querySelectorAll('.unit-d').forEach(el => el.innerText = Units.uDepth());
  document.querySelectorAll('.unit-s').forEach(el => el.innerText = Units.uS());
  document.querySelectorAll('.unit-ei').forEach(el => el.innerText = Units.uEI());
  document.querySelectorAll('.unit-r').forEach(el => el.innerText = Units.uR());
  document.querySelectorAll('.unit-stress').forEach(el => el.innerText = Units.uStress());

  // Convert transient form input boxes if switching between Metric and Imperial
  if (prevSys !== sys) {
    const convInput = (id, toImpFactor, decimals = 2) => {
      const el = document.getElementById(id);
      if (!el) return;
      const v = parseFloat(el.value);
      if (isNaN(v)) return;
      const newV = sys === 'imperial' ? v * toImpFactor : v / toImpFactor;
      el.value = +newV.toFixed(decimals);
    };
    convInput('newSupportX', 3.280839895, 2);
    convInput('newPointP', 0.2248089431, 2);
    convInput('newPointX', 3.280839895, 2);
    convInput('newUDLw1', 0.06852176586, 2);
    convInput('newUDLw2', 0.06852176586, 2);
    convInput('newUDLx1', 3.280839895, 2);
    convInput('newUDLx2', 3.280839895, 2);
    convInput('newMomentM', 0.7375621493, 2);
    convInput('newMomentX', 3.280839895, 2);
    convInput('tool2DLoadFx', 0.2248089431, 2);
    convInput('tool2DLoadFy', 0.2248089431, 2);
    convInput('tool2DLoadW', 0.06852176586, 2);
    convInput('sbE', 145.0377377, 1);
    convInput('sbD', 0.03937007874, 2);
    convInput('sbB', 0.03937007874, 2);
    convInput('sbTf', 0.03937007874, 2);
    convInput('sbTw', 0.03937007874, 2);
  }

  syncInputFields();
  solveAndRender();
  if (typeof update2DBadgesAndTables === 'function') update2DBadgesAndTables();
  if (typeof render2DWorkspace === 'function') render2DWorkspace();
  if (typeof render3DScene === 'function') render3DScene();
  if (typeof computeSectionBuilder === 'function') computeSectionBuilder();
  if (typeof renderSavedSectionsLibrary === 'function') renderSavedSectionsLibrary();
  if (typeof refreshCalculationReport === 'function') refreshCalculationReport();

  if (prevSys !== sys) {
    showNotification(
      sys === 'metric' ? 'เปลี่ยนเป็นระบบหน่วย Metric (SI)' : 'เปลี่ยนเป็นระบบหน่วย Imperial (US)',
      sys === 'metric'
        ? 'แปลงค่าทั้งหมดเป็น m, mm, kN, kN·m, MPa, GPa เรียบร้อยแล้ว'
        : 'แปลงค่าทั้งหมดเป็น ft, in, kip, kip·ft, ksi เรียบร้อยแล้ว'
    );
  }
}

function syncSectionModeUI() {
  const btnUse = document.getElementById('btnSecModeUse');
  const btnIgnore = document.getElementById('btnSecModeIgnore');
  const banner = document.getElementById('noSectionModeBanner');
  const wrapLen = document.getElementById('wrapInputLength');
  const propFields = document.querySelectorAll('.sec-prop-field');
  const propInputs = ['inputE', 'inputI', 'inputArea', 'inputDepth', 'inputY'];

  if (btnUse && btnIgnore) {
    if (model.ignoreSection) {
      btnIgnore.className = 'py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center space-x-1.5 bg-emerald-600 text-white shadow-2xs cursor-pointer';
      btnUse.className = 'py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer';
    } else {
      btnUse.className = 'py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center space-x-1.5 bg-sky-600 text-white shadow-2xs cursor-pointer';
      btnIgnore.className = 'py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer';
    }
  }

  if (banner) {
    if (model.ignoreSection) banner.classList.remove('hidden');
    else banner.classList.add('hidden');
  }

  if (wrapLen) {
    if (model.ignoreSection) wrapLen.classList.add('col-span-2');
    else wrapLen.classList.remove('col-span-2');
  }

  propFields.forEach(el => {
    if (model.ignoreSection) {
      el.classList.add('opacity-35', 'pointer-events-none', 'select-none');
    } else {
      el.classList.remove('opacity-35', 'pointer-events-none', 'select-none');
    }
  });

  propInputs.forEach(id => {
    const inp = document.getElementById(id);
    if (inp) inp.disabled = !!model.ignoreSection;
  });
}

function setIgnoreSectionMode(ignore, silent = false) {
  model.ignoreSection = !!ignore;
  const secSelect = document.getElementById('sectionPreset');
  if (model.ignoreSection) {
    if (secSelect) secSelect.value = 'none';
  } else {
    if (secSelect && secSelect.value === 'none') {
      let matchedKey = 'custom';
      for (const [k, v] of Object.entries(sectionDatabase)) {
        if (v.name === model.sectionName) {
          matchedKey = k;
          break;
        }
      }
      secSelect.value = matchedKey;
    }
  }
  syncSectionModeUI();
  syncInputFields();
  solveAndRender();

  if (!silent) {
    const isTH = currentLang === 'th';
    if (model.ignoreSection) {
      showNotification(
        isTH ? 'เปิดโหมดไม่คิดหน้าตัด (EI คงที่)' : 'No Cross-Section Mode Active',
        isTH
          ? 'คำนวณคาน 1D แบบอิสระตามโจทย์การบ้าน โดยไม่นำค่าหน้าตัด (E, I, A, h, y) มาคิด'
          : '1D beam solved independently of cross-section properties (Constant EI)'
      );
    } else {
      showNotification(
        isTH ? 'เปิดโหมดคิดคุณสมบัติหน้าตัด' : 'Cross-Section Mode Active',
        isTH
          ? `คำนวณร่วมกับคุณสมบัติหน้าตัด (${model.sectionName})`
          : `Calculating with section properties (${model.sectionName})`
      );
    }
  }
}

function updateSectionPresetDropdown(selectedId) {
  const select = document.getElementById('sectionPreset');
  if (!select) return;

  const isTH = (typeof currentLang === 'undefined' || currentLang === 'th');
  const libSections = (typeof savedCloudSections !== 'undefined' && Array.isArray(savedCloudSections)) ? savedCloudSections : [];

  let html = `<option value="none">${isTH ? '★ ไม่คิดหน้าตัด — โหมดโจทย์การบ้านทั่วไป (EI คงที่ / ไม่ระบุหน้าตัด)' : '★ No Cross-Section — Textbook Mode (Constant EI)'}</option>`;

  // 1. Saved Cloud & Custom Library Sections
  if (libSections.length > 0) {
    html += `<optgroup label="${isTH ? 'คลังหน้าตัดที่สร้างไว้ / บันทึกในระบบ (Saved Library Sections)' : 'Saved Library Sections'}">`;
    libSections.forEach(s => {
      const uE = typeof Units !== 'undefined' ? Units.uE() : 'GPa';
      const uI = typeof Units !== 'undefined' ? Units.uI() : 'cm⁴';
      const uA = typeof Units !== 'undefined' ? Units.uA() : 'cm²';
      const dispE = typeof Units !== 'undefined' ? +Units.E(s.E).toFixed(1) : s.E;
      const dispI = typeof Units !== 'undefined' ? +Units.I(s.I_cm4).toFixed(1) : s.I_cm4;
      const dispA = typeof Units !== 'undefined' ? +Units.A(s.A_cm2).toFixed(1) : s.A_cm2;
      html += `<option value="${s.id}">${s.name} (E=${dispE}${uE}, I=${dispI}${uI}, A=${dispA}${uA})</option>`;
    });
    html += `</optgroup>`;
  }

  // 2. Standard Built-in Presets
  html += `<optgroup label="${isTH ? 'หน้าตัดมาตรฐานของระบบ (Standard Presets)' : 'Standard Presets'}">`;
  html += `<option value="mk2_soldier">MK2 SOLDIER (E=200GPa, I=534.6cm⁴, A=22.52cm²)</option>`;
  html += `<option value="steel_w">${isTH ? 'เหล็กรูปพรรณ W-Beam W310x38.7 (W12x26)' : 'Steel W-Beam W310x38.7 (W12x26)'}</option>`;
  html += `<option value="rc_rect">${isTH ? 'คอนกรีตเสริมเหล็ก RC (300 × 500 มม.)' : 'Reinforced Concrete RC (300 × 500 mm)'}</option>`;
  html += `<option value="timber">${isTH ? 'ไม้โครงสร้าง Glulam (150 × 300 มม.)' : 'Structural Timber Glulam (150 × 300 mm)'}</option>`;
  html += `<option value="steel_tube">${isTH ? 'เหล็กกล่องกลวง HSS (200 × 100 × 8 มม.)' : 'Hollow Structural Section HSS (200 × 100 × 8 mm)'}</option>`;
  html += `</optgroup>`;

  html += `<option value="custom">${isTH ? 'กำหนดเอง (Custom Section...)' : 'Custom Section...'}</option>`;

  select.innerHTML = html;

  if (selectedId) {
    select.value = selectedId;
  } else if (model.ignoreSection) {
    select.value = 'none';
  } else {
    const matched = libSections.find(x => x.name === model.sectionName);
    if (matched) {
      select.value = matched.id;
    } else {
      let matchedDbKey = 'custom';
      for (const [k, v] of Object.entries(sectionDatabase)) {
        if (v.name === model.sectionName) {
          matchedDbKey = k;
          break;
        }
      }
      select.value = matchedDbKey;
    }
  }
}

function applySectionPreset() {
  const select = document.getElementById('sectionPreset');
  if (!select) return;
  const key = select.value;
  if (key === 'none') {
    setIgnoreSectionMode(true);
    return;
  }
  model.ignoreSection = false;
  syncSectionModeUI();
  if (key === 'custom') {
    solveAndRender();
    return;
  }

  // Check saved cloud library sections first
  const libSections = (typeof savedCloudSections !== 'undefined' && Array.isArray(savedCloudSections)) ? savedCloudSections : [];
  const cloudSec = libSections.find(x => x.id === key);
  if (cloudSec) {
    model.sectionName = cloudSec.name;
    model.shape = cloudSec.shape;
    model.E = cloudSec.E;
    model.I = cloudSec.I_cm4;
    model.A = cloudSec.A_cm2;
    model.depth = cloudSec.d;
    model.y = cloudSec.y_mm;

    if (typeof frame2D !== 'undefined') {
      frame2D.E = cloudSec.E * 1e6;
      frame2D.A_frame = cloudSec.A_cm2 * 1e-4;
      frame2D.I_frame = cloudSec.I_cm4 * 1e-8;
    }

    const lblActive = document.getElementById('lblActiveSectionName');
    if (lblActive) lblActive.innerText = cloudSec.name;
    syncInputFields();
    solveAndRender();
    if (typeof solve2DFrame === 'function') solve2DFrame();
    return;
  }

  // Check standard static database
  const p = sectionDatabase[key];
  if (!p) return;
  model.sectionName = p.name;
  model.shape = p.shape;
  model.E = p.E_si;
  model.I = p.I_si;
  model.A = p.A_si;
  model.depth = p.d_si;
  model.y = p.y_si;
  const lblActive = document.getElementById('lblActiveSectionName');
  if (lblActive) lblActive.innerText = p.name;
  syncInputFields();
  solveAndRender();
}

function onCustomPropEdit() {
  model.ignoreSection = false;
  syncSectionModeUI();
  document.getElementById('sectionPreset').value = 'custom';
  model.sectionName = 'CUSTOM SECTION';
  document.getElementById('lblActiveSectionName').innerText = model.sectionName;
  updateModel();
}

function onDepthChange() {
  const dDisp = parseFloat(document.getElementById('inputDepth').value);
  if (!isNaN(dDisp) && dDisp > 0) {
    model.depth = +Units.toSIDepth(dDisp).toFixed(3);
    model.y = +(model.depth / 2).toFixed(3);
    document.getElementById('inputY').value = +Units.depth(model.y).toFixed(2);
  }
  onCustomPropEdit();
}

function syncInputFields() {
  document.getElementById('inputLength').value = +Units.len(model.length).toFixed(3);
  document.getElementById('inputE').value = +Units.E(model.E).toFixed(2);
  document.getElementById('inputI').value = +Units.I(model.I).toFixed(2);
  document.getElementById('inputArea').value = +Units.A(model.A).toFixed(2);
  document.getElementById('inputDepth').value = +Units.depth(model.depth).toFixed(2);
  document.getElementById('inputY').value = +Units.depth(model.y).toFixed(2);
  const slider = document.getElementById('stationSlider');
  if (slider) {
    slider.max = model.length;
    if (hoveredBeamX > model.length) hoveredBeamX = model.length / 2;
    slider.value = hoveredBeamX;
  }
}

function updateModel() {
  const L = Units.toSILen(parseFloat(document.getElementById('inputLength').value));
  const E = Units.toSIE(parseFloat(document.getElementById('inputE').value));
  const I = Units.toSII(parseFloat(document.getElementById('inputI').value));
  const A = Units.toSIA(parseFloat(document.getElementById('inputArea').value));
  const d = Units.toSIDepth(parseFloat(document.getElementById('inputDepth').value));
  const y = Units.toSIDepth(parseFloat(document.getElementById('inputY').value));

  if (!isNaN(L) && L >= 0.2) model.length = +L.toFixed(4);
  if (!model.ignoreSection) {
    if (!isNaN(E) && E > 0) model.E = +E.toFixed(4);
    if (!isNaN(I) && I > 0) model.I = +I.toFixed(4);
    if (!isNaN(A) && A > 0) model.A = +A.toFixed(4);
    if (!isNaN(d) && d > 0) model.depth = +d.toFixed(4);
    if (!isNaN(y) && y > 0) model.y = +y.toFixed(4);
  }

  syncInputFields();
  solveAndRender();
}

let currentBeamPreset = 'report_example_4718';

function loadPreset(type) {
  if (type === 'report_example_4718' || type === 'report_example' || type === 'mk2_soldier') {
    currentBeamPreset = 'report_example_4718';
    model.name = '4718-28th-SEC-D';
    model.length = 5.4;
    if (!model.ignoreSection) {
      model.sectionName = 'MK2 SOLDIER';
      model.shape = 'steel_w';
      model.E = 200.0;
      model.I = 534.6;
      model.A = 22.52;
      model.depth = 225.0;
      model.y = 112.5;
      const secSelect = document.getElementById('sectionPreset');
      if (secSelect) secSelect.value = 'mk2_soldier';
    }
    model.supports = [
      { id: 1, type: 'pinned', x: 0.4 },
      { id: 2, type: 'pinned', x: 1.85 },
      { id: 3, type: 'pinned', x: 4.85 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 27.5, x: 2.485 },
      { id: 2, type: 'point', P: 24.0, x: 4.285 },
      { id: 3, type: 'point', P: 12.4, x: 5.185 }
    ];
  } else if (type === 'simply_supported_point' || type === 'ss_point') {
    currentBeamPreset = 'simply_supported_point';
    model.name = 'SS-POINT-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 30.0, x: 3.0 }
    ];
  } else if (type === 'simply_supported_udl' || type === 'ss_udl') {
    currentBeamPreset = 'simply_supported_udl';
    model.name = 'SS-UDL-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 15.0, w2: 15.0, x1: 0.0, x2: 6.0 }
    ];
  } else if (type === 'cantilever' || type === 'cantilever_point' || type === 'cantilever_beam') {
    currentBeamPreset = 'cantilever_point';
    model.name = 'CANTILEVER-4M';
    model.length = 4.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 20.0, x: 4.0 },
      { id: 2, type: 'udl', w1: 8.0, w2: 8.0, x1: 0.0, x2: 4.0 }
    ];
  } else if (type === 'fixed_fixed' || type === 'fixed_fixed_udl' || type === 'fixed_beam') {
    currentBeamPreset = 'fixed_fixed_udl';
    model.name = 'FIXED-FIXED-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 },
      { id: 2, type: 'fixed', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 18.0, w2: 18.0, x1: 0.0, x2: 6.0 },
      { id: 2, type: 'point', P: 25.0, x: 3.0 }
    ];
  } else if (type === 'continuous' || type === 'continuous_2span' || type === 'continuous_two_span' || type === 'continuous_beam') {
    currentBeamPreset = 'continuous_two_span';
    model.name = 'CONTINUOUS-2SPAN-10M';
    model.length = 10.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 5.0 },
      { id: 3, type: 'roller', x: 10.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 12.0, w2: 12.0, x1: 0.0, x2: 10.0 },
      { id: 2, type: 'point', P: 30.0, x: 2.5 }
    ];
  } else if (type === 'overhang' || type === 'overhanging_beam' || type === 'overhang_beam') {
    currentBeamPreset = 'overhanging_beam';
    model.name = 'OVERHANG-8M';
    model.length = 8.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 5.5 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 10.0, w2: 10.0, x1: 0.0, x2: 5.5 },
      { id: 2, type: 'point', P: 22.0, x: 8.0 }
    ];
  } else if (type === 'triangular_load_increasing' || type === 'triangular_load' || type === 'triangular' || type === 'triangle') {
    currentBeamPreset = 'triangular_load_increasing';
    model.name = 'TRIANGULAR-RAMP-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 0.0, w2: 25.0, x1: 0.0, x2: 6.0 }
    ];
  } else if (type === 'trapezoidal_load' || type === 'trapezoid') {
    currentBeamPreset = 'trapezoidal_load';
    model.name = 'TRAPEZOIDAL-LOAD-8M';
    model.length = 8.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 8.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 10.0, w2: 30.0, x1: 1.0, x2: 7.0 }
    ];
  } else if (type === 'simply_supported_two_point' || type === 'ss_two_point') {
    // Standard 4-point bending test (Third-point loading)
    currentBeamPreset = 'simply_supported_two_point';
    model.name = 'SS-TWO-POINT-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 25.0, x: 2.0 },
      { id: 2, type: 'point', P: 25.0, x: 4.0 }
    ];
  } else if (type === 'simply_supported_partial_udl' || type === 'ss_partial_udl') {
    // Partial span UDL over center
    currentBeamPreset = 'simply_supported_partial_udl';
    model.name = 'SS-PARTIAL-UDL-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 20.0, w2: 20.0, x1: 1.5, x2: 4.5 }
    ];
  } else if (type === 'triangular_symmetric' || type === 'triangle_sym') {
    // Symmetric triangular load (Peak at midspan)
    currentBeamPreset = 'triangular_symmetric';
    model.name = 'TRIANGLE-SYMMETRIC-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 0.0, w2: 24.0, x1: 0.0, x2: 3.0 },
      { id: 2, type: 'udl', w1: 24.0, w2: 0.0, x1: 3.0, x2: 6.0 }
    ];
  } else if (type === 'simply_supported_moment' || type === 'ss_moment') {
    // Concentrated moment load at midspan
    currentBeamPreset = 'simply_supported_moment';
    model.name = 'SS-PURE-MOMENT-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'moment', M: 35.0, x: 3.0 }
    ];
  } else if (type === 'cantilever_udl') {
    // Cantilever full UDL
    currentBeamPreset = 'cantilever_udl';
    model.name = 'CANTILEVER-UDL-4M';
    model.length = 4.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 15.0, w2: 15.0, x1: 0.0, x2: 4.0 }
    ];
  } else if (type === 'cantilever_triangular') {
    // Cantilever triangular ramp load (retaining wall action)
    currentBeamPreset = 'cantilever_triangular';
    model.name = 'CANTILEVER-TRIANGLE-4M';
    model.length = 4.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 30.0, w2: 0.0, x1: 0.0, x2: 4.0 }
    ];
  } else if (type === 'propped_cantilever_udl' || type === 'propped_cantilever') {
    // Propped cantilever with UDL (DSI = 1)
    currentBeamPreset = 'propped_cantilever_udl';
    model.name = 'PROPPED-CANTILEVER-UDL-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 16.0, w2: 16.0, x1: 0.0, x2: 6.0 }
    ];
  } else if (type === 'propped_cantilever_point') {
    // Propped cantilever with midspan point load (DSI = 1)
    currentBeamPreset = 'propped_cantilever_point';
    model.name = 'PROPPED-CANTILEVER-POINT-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 },
      { id: 2, type: 'roller', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 36.0, x: 3.0 }
    ];
  } else if (type === 'fixed_fixed_point') {
    // Fixed-Fixed with midspan point load (DSI = 2)
    currentBeamPreset = 'fixed_fixed_point';
    model.name = 'FIXED-FIXED-POINT-6M';
    model.length = 6.0;
    model.supports = [
      { id: 1, type: 'fixed', x: 0.0 },
      { id: 2, type: 'fixed', x: 6.0 }
    ];
    model.loads = [
      { id: 1, type: 'point', P: 40.0, x: 3.0 }
    ];
  } else if (type === 'continuous_three_span' || type === 'continuous_3span') {
    // 3-Span continuous beam with equal spans (DSI = 2)
    currentBeamPreset = 'continuous_three_span';
    model.name = 'CONTINUOUS-3SPAN-12M';
    model.length = 12.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 0.0 },
      { id: 2, type: 'roller', x: 4.0 },
      { id: 3, type: 'roller', x: 8.0 },
      { id: 4, type: 'roller', x: 12.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 12.0, w2: 12.0, x1: 0.0, x2: 12.0 },
      { id: 2, type: 'point', P: 25.0, x: 6.0 }
    ];
  } else if (type === 'double_overhang' || type === 'double_overhanging_beam') {
    // Symmetrical double overhang beam
    currentBeamPreset = 'double_overhang';
    model.name = 'DOUBLE-OVERHANG-10M';
    model.length = 10.0;
    model.supports = [
      { id: 1, type: 'pinned', x: 2.0 },
      { id: 2, type: 'roller', x: 8.0 }
    ];
    model.loads = [
      { id: 1, type: 'udl', w1: 14.0, w2: 14.0, x1: 0.0, x2: 10.0 },
      { id: 2, type: 'point', P: 18.0, x: 0.0 },
      { id: 3, type: 'point', P: 18.0, x: 10.0 }
    ];
  }

  const repInput = document.getElementById('repModelNameInput');
  if (repInput) repInput.value = model.name;
  const lblSec = document.getElementById('lblActiveSectionName');
  if (lblSec) {
    lblSec.innerText = model.ignoreSection
      ? (currentLang === 'th' ? 'ไม่คิดหน้าตัด (EI คงที่)' : 'NO SECTION (EI = CONST)')
      : model.sectionName;
  }
  hoveredBeamX = +(model.length / 2).toFixed(2);
  syncSectionModeUI();
  syncInputFields();
  solveAndRender();
  highlightActiveBeamPreset(currentBeamPreset);
}

function scrollBeamPresetBar(offset) {
  const container = document.getElementById('beamPresetScrollContainer');
  if (!container) return;
  container.scrollBy({ left: offset, behavior: 'smooth' });
}

function toggleVisualTemplatesPanel() {
  const panel = document.getElementById('beamVisualTemplatesPanel');
  const btn = document.getElementById('lblToggleTemplates');
  const icon = document.getElementById('iconToggleTemplates');
  if (!panel) return;
  const dict = i18n[currentLang] || i18n.th;
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    if (btn) btn.innerText = dict.btnHideBeamCards;
    if (icon) icon.className = 'fa-solid fa-chevron-up text-teal-500';
  } else {
    panel.classList.add('hidden');
    if (btn) btn.innerText = dict.btnShowBeamCards;
    if (icon) icon.className = 'fa-solid fa-chevron-down text-teal-500';
  }
}

function highlightActiveBeamPreset(presetKey) {
  // Update Top Bar active styling
  document.querySelectorAll('.top-preset-btn').forEach(btn => {
    const key = btn.getAttribute('data-preset-key');
    if (key === presetKey) {
      btn.classList.add('bg-sky-600', 'text-white', 'shadow-xs');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
    } else {
      btn.classList.remove('bg-sky-600', 'text-white', 'shadow-xs');
      btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
    }
  });

  // Update Visual Cards active styling
  document.querySelectorAll('.beam-preset-card').forEach(el => {
    const key = el.getAttribute('data-preset-key');
    if (key === presetKey) {
      el.classList.add('ring-2', 'ring-teal-500', 'border-teal-500', 'bg-teal-500/10', 'dark:bg-teal-950/40');
      el.classList.remove('border-slate-200', 'dark:border-slate-700/80', 'bg-white', 'dark:bg-slate-800/80');
    } else {
      el.classList.remove('ring-2', 'ring-teal-500', 'border-teal-500', 'bg-teal-500/10', 'dark:bg-teal-950/40');
      el.classList.add('border-slate-200', 'dark:border-slate-700/80', 'bg-white', 'dark:bg-slate-800/80');
    }
  });
}

/*************************************************************************
 * SUPPORTS & LOADS CRUD (1D BEAM)
 *************************************************************************/
let currentLoadTab = 'point';

function setLoadTab(tab) {
  currentLoadTab = tab;
  ['point', 'udl', 'moment'].forEach(t => {
    const btn = document.getElementById(t === 'point' ? 'tabLoadPoint' : t === 'udl' ? 'tabLoadUDL' : 'tabLoadMoment');
    const form = document.getElementById(t === 'point' ? 'formPointLoad' : t === 'udl' ? 'formUDLLoad' : 'formMomentLoad');
    if (t === tab) {
      btn.className = 'flex-1 py-1 rounded-lg bg-white dark:bg-slate-900 shadow-2xs text-slate-900 dark:text-white font-semibold';
      form.classList.remove('hidden');
    } else {
      btn.className = 'flex-1 py-1 rounded-lg text-slate-600 dark:text-slate-400';
      form.classList.add('hidden');
    }
  });
}

function addSupport() {
  const type = document.getElementById('newSupportType').value;
  let xDisp = parseFloat(document.getElementById('newSupportX').value);
  if (isNaN(xDisp)) return;
  let x = +Units.toSILen(xDisp).toFixed(4);
  x = Math.max(0, Math.min(model.length, x));
  const existingIdx = model.supports.findIndex(s => Math.abs(s.x - x) < 1e-4);
  if (existingIdx >= 0) {
    model.supports[existingIdx].type = type;
  } else {
    model.supports.push({ id: Date.now(), type, x });
  }
  model.supports.sort((a, b) => a.x - b.x);
  solveAndRender();
}

function removeSupport(id) {
  if (model.supports.length <= 1) {
    showNotification(
      currentLang === 'th' ? 'ไม่สามารถลบได้' : 'Cannot Delete',
      currentLang === 'th' ? 'คานต้องมีจุดรองรับอย่างน้อย 1 จุด' : 'Beam must have at least 1 support',
      'error'
    );
    return;
  }
  model.supports = model.supports.filter(s => s.id !== id);
  solveAndRender();
}

let editingLoadId = null;

function setUDLPreset(type) {
  const w1El = document.getElementById('newUDLw1');
  const w2El = document.getElementById('newUDLw2');
  const x1El = document.getElementById('newUDLx1');
  const x2El = document.getElementById('newUDLx2');
  if (!w1El || !w2El || !x1El || !x2El) return;
  const L = +Units.len(model.length).toFixed(2);
  x1El.value = '0.0';
  x2El.value = L;
  if (type === 'tri_increasing') {
    w1El.value = '0.0';
    w2El.value = +Units.dist(25.0).toFixed(1);
    showNotification(
      currentLang === 'th' ? 'แรงแผ่รูปสามเหลี่ยม (เริ่มจาก 0)' : 'Triangular Load (0→w₂)',
      currentLang === 'th' ? 'กำหนดแรงแผ่เริ่มจาก 0 ไล่ระดับขึ้นไป w₂' : 'Set distributed load ramping from 0 to w₂'
    );
  } else if (type === 'tri_decreasing') {
    w1El.value = +Units.dist(25.0).toFixed(1);
    w2El.value = '0.0';
    showNotification(
      currentLang === 'th' ? 'แรงแผ่รูปสามเหลี่ยม (ลดลงสู่ 0)' : 'Triangular Load (w₁→0)',
      currentLang === 'th' ? 'กำหนดแรงแผ่เริ่มจาก w₁ ลดหลั่นลงไปที่ 0' : 'Set distributed load tapering from w₁ to 0'
    );
  } else if (type === 'trapezoid') {
    w1El.value = +Units.dist(10.0).toFixed(1);
    w2El.value = +Units.dist(30.0).toFixed(1);
    showNotification(
      currentLang === 'th' ? 'แรงแผ่สี่เหลี่ยมคางหมู' : 'Trapezoidal Load',
      currentLang === 'th' ? 'กำหนดแรงแผ่ไล่ระดับจาก w₁ ไปยัง w₂' : 'Set distributed load varying from w₁ to w₂'
    );
  } else if (type === 'uniform') {
    w1El.value = +Units.dist(15.0).toFixed(1);
    w2El.value = +Units.dist(15.0).toFixed(1);
  }
}

function startEditLoad(id) {
  const l = model.loads.find(item => item.id === id);
  if (!l) return;
  editingLoadId = id;
  setLoadTab(l.type);
  if (l.type === 'point') {
    const isUp = l.P < 0;
    const pInput = document.getElementById('newPointP');
    const xInput = document.getElementById('newPointX');
    const dirInput = document.getElementById('newPointDir');
    if (pInput) pInput.value = +Units.force(Math.abs(l.P)).toFixed(2);
    if (xInput) xInput.value = +Units.len(l.x).toFixed(3);
    if (dirInput) dirInput.value = isUp ? 'up' : 'down';
  } else if (l.type === 'udl') {
    const isUp = l.w1 < 0 && l.w2 < 0;
    const w1Input = document.getElementById('newUDLw1');
    const w2Input = document.getElementById('newUDLw2');
    const x1Input = document.getElementById('newUDLx1');
    const x2Input = document.getElementById('newUDLx2');
    const dirInput = document.getElementById('newUDLDir');
    if (w1Input) w1Input.value = +Units.dist(Math.abs(l.w1)).toFixed(2);
    if (w2Input) w2Input.value = +Units.dist(Math.abs(l.w2)).toFixed(2);
    if (x1Input) x1Input.value = +Units.len(l.x1).toFixed(3);
    if (x2Input) x2Input.value = +Units.len(l.x2).toFixed(3);
    if (dirInput) dirInput.value = isUp ? 'up' : 'down';
  } else if (l.type === 'moment') {
    const mInput = document.getElementById('newMomentM');
    const xInput = document.getElementById('newMomentX');
    if (mInput) mInput.value = +Units.mom(l.M).toFixed(2);
    if (xInput) xInput.value = +Units.len(l.x).toFixed(3);
  }
  updateLoadActionButtons();
  renderLoadsTable();
  const formCard = document.getElementById('formPointLoad')?.parentElement;
  if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelEditLoad() {
  editingLoadId = null;
  updateLoadActionButtons();
  renderLoadsTable();
}

function updateLoadActionButtons() {
  const container = document.getElementById('loadActionButtonsContainer');
  if (!container) return;
  const isTH = currentLang === 'th';
  if (editingLoadId) {
    container.innerHTML = `
      <div class="flex space-x-2 w-full mt-2.5">
        <button onclick="saveEditLoad()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-1.5 text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm">
          <i class="fa-solid fa-check"></i>
          <span>${isTH ? 'บันทึกการแก้ไข (Update Load)' : 'Update Applied Load'}</span>
        </button>
        <button onclick="cancelEditLoad()" class="px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg py-1.5 text-xs font-semibold transition">
          ${isTH ? 'ยกเลิก' : 'Cancel'}
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="addLoad()" class="mt-2.5 w-full bg-rose-600 hover:bg-rose-500 text-white rounded-lg py-1.5 text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm">
        <i class="fa-solid fa-plus text-[10px]"></i>
        <span data-i18n="btnAddLoad">${isTH ? 'เพิ่มแรงกระทำบนคาน' : 'Add Applied Load'}</span>
      </button>
    `;
  }
}

function saveEditLoad() {
  if (!editingLoadId) return;
  const l = model.loads.find(item => item.id === editingLoadId);
  if (!l) { editingLoadId = null; updateLoadActionButtons(); return; }

  if (currentLoadTab === 'point') {
    const pDisp = parseFloat(document.getElementById('newPointP').value);
    const xDisp = parseFloat(document.getElementById('newPointX').value);
    const dir = document.getElementById('newPointDir')?.value || 'down';
    if (isNaN(pDisp) || isNaN(xDisp)) return;
    const sign = dir === 'up' ? -1 : 1;
    l.type = 'point';
    l.P = +(sign * Math.abs(Units.toSIForce(pDisp))).toFixed(4);
    l.x = Math.max(0, Math.min(model.length, +Units.toSILen(xDisp).toFixed(4)));
  } else if (currentLoadTab === 'udl') {
    const w1Disp = parseFloat(document.getElementById('newUDLw1').value);
    const w2Disp = parseFloat(document.getElementById('newUDLw2').value);
    const x1Disp = parseFloat(document.getElementById('newUDLx1').value);
    const x2Disp = parseFloat(document.getElementById('newUDLx2').value);
    const dir = document.getElementById('newUDLDir')?.value || 'down';
    if (isNaN(w1Disp) || isNaN(w2Disp) || isNaN(x1Disp) || isNaN(x2Disp)) return;
    const sign = dir === 'up' ? -1 : 1;
    l.type = 'udl';
    l.w1 = +(sign * Math.abs(Units.toSIDist(w1Disp))).toFixed(4);
    l.w2 = +(sign * Math.abs(Units.toSIDist(w2Disp))).toFixed(4);
    l.x1 = Math.max(0, Math.min(model.length, +Units.toSILen(x1Disp).toFixed(4)));
    l.x2 = Math.max(0, Math.min(model.length, +Units.toSILen(x2Disp).toFixed(4)));
    if (l.x2 <= l.x1) l.x2 = Math.min(model.length, l.x1 + 0.1);
  } else if (currentLoadTab === 'moment') {
    const mDisp = parseFloat(document.getElementById('newMomentM').value);
    const xDisp = parseFloat(document.getElementById('newMomentX').value);
    if (isNaN(mDisp) || isNaN(xDisp)) return;
    l.type = 'moment';
    l.M = +Units.toSIMom(mDisp).toFixed(4);
    l.x = Math.max(0, Math.min(model.length, +Units.toSILen(xDisp).toFixed(4)));
  }

  editingLoadId = null;
  updateLoadActionButtons();
  solveAndRender();
  showNotification(
    currentLang === 'th' ? 'แก้ไขสำเร็จ' : 'Load Updated',
    currentLang === 'th' ? 'อัปเดตแรงกระทำบนคานเรียบร้อยแล้ว' : 'Applied load has been updated'
  );
}

function addLoad() {
  if (currentLoadTab === 'point') {
    const pDisp = parseFloat(document.getElementById('newPointP').value);
    const xDisp = parseFloat(document.getElementById('newPointX').value);
    const dir = document.getElementById('newPointDir')?.value || 'down';
    if (isNaN(pDisp) || isNaN(xDisp)) return;
    const sign = dir === 'up' ? -1 : 1;
    const P = +(sign * Math.abs(Units.toSIForce(pDisp))).toFixed(4);
    let x = +Units.toSILen(xDisp).toFixed(4);
    x = Math.max(0, Math.min(model.length, x));
    model.loads.push({ id: Date.now(), type: 'point', P, x });
  } else if (currentLoadTab === 'udl') {
    const w1Disp = parseFloat(document.getElementById('newUDLw1').value);
    const w2Disp = parseFloat(document.getElementById('newUDLw2').value);
    const x1Disp = parseFloat(document.getElementById('newUDLx1').value);
    const x2Disp = parseFloat(document.getElementById('newUDLx2').value);
    const dir = document.getElementById('newUDLDir')?.value || 'down';
    if (isNaN(w1Disp) || isNaN(w2Disp) || isNaN(x1Disp) || isNaN(x2Disp)) return;
    const sign = dir === 'up' ? -1 : 1;
    const w1 = +(sign * Math.abs(Units.toSIDist(w1Disp))).toFixed(4);
    const w2 = +(sign * Math.abs(Units.toSIDist(w2Disp))).toFixed(4);
    let x1 = +Units.toSILen(x1Disp).toFixed(4);
    let x2 = +Units.toSILen(x2Disp).toFixed(4);
    x1 = Math.max(0, Math.min(model.length, x1));
    x2 = Math.max(0, Math.min(model.length, x2));
    if (x2 <= x1) return;
    model.loads.push({ id: Date.now(), type: 'udl', w1, w2, x1, x2 });
  } else if (currentLoadTab === 'moment') {
    const mDisp = parseFloat(document.getElementById('newMomentM').value);
    const xDisp = parseFloat(document.getElementById('newMomentX').value);
    if (isNaN(mDisp) || isNaN(xDisp)) return;
    const M = +Units.toSIMom(mDisp).toFixed(4);
    let x = +Units.toSILen(xDisp).toFixed(4);
    x = Math.max(0, Math.min(model.length, x));
    model.loads.push({ id: Date.now(), type: 'moment', M, x });
  }
  solveAndRender();
}

function removeLoad(id) {
  if (editingLoadId === id) {
    cancelEditLoad();
  }
  model.loads = model.loads.filter(l => l.id !== id);
  solveAndRender();
}

function renderSupportsTable() {
  const tbody = document.getElementById('supportsTableBody');
  if (!tbody) return;
  document.getElementById('supportCountBadge').innerText = `${model.supports.length} ${currentLang === 'th' ? 'จุด' : 'supports'}`;
  tbody.innerHTML = model.supports.map(s => {
    const label = s.type === 'pinned' ? 'Pinned (▲)' : s.type === 'roller' ? 'Roller (●)' : 'Fixed (█)';
    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
        <td class="py-1.5 px-3 font-sans font-semibold text-indigo-600 dark:text-indigo-400">${label}</td>
        <td class="py-1.5 px-3">${Units.len(s.x).toFixed(3)} ${Units.uLen()}</td>
        <td class="py-1.5 px-2 text-right">
          <button onclick="removeSupport(${s.id})" class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderLoadsTable() {
  const tbody = document.getElementById('loadsTableBody');
  if (!tbody) return;
  const isTH = currentLang === 'th';
  document.getElementById('loadCountBadge').innerText = `${model.loads.length} ${isTH ? 'รายการ' : 'loads'}`;
  const editTag = isTH ? '(แก้ไข)' : '(Editing)';
  const editTip = isTH ? 'แก้ไขแรงนี้' : 'Edit Load';
  const delTip = isTH ? 'ลบแรงนี้' : 'Delete Load';
  tbody.innerHTML = model.loads.map(l => {
    const isEditing = editingLoadId === l.id;
    const rowClass = isEditing 
      ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-400/40 font-bold' 
      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40';

    if (l.type === 'point') {
      const isUp = l.P < 0;
      const dirText = isUp ? (isTH ? '↑ ดันขึ้น' : '↑ Up') : (isTH ? '↓ กดลง' : '↓ Down');
      return `
        <tr class="${rowClass}">
          <td class="py-1.5 px-3 font-sans font-semibold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
            Point (${dirText}) ${isEditing ? `<span class="text-[10px] text-sky-500 ml-1 font-normal">${editTag}</span>` : ''}
          </td>
          <td class="py-1.5 px-3">${Units.force(Math.abs(l.P)).toFixed(2)} ${Units.uForce()}</td>
          <td class="py-1.5 px-3">x = ${Units.len(l.x).toFixed(3)} ${Units.uLen()}</td>
          <td class="py-1.5 px-2 text-right whitespace-nowrap">
            <button onclick="startEditLoad(${l.id})" class="text-sky-500 hover:text-sky-400 mr-2" title="${editTip}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="removeLoad(${l.id})" class="text-slate-400 hover:text-rose-500" title="${delTip}"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>`;
    } else if (l.type === 'udl') {
      const isUp = l.w1 < 0 && l.w2 < 0;
      const mag1 = Math.abs(l.w1);
      const mag2 = Math.abs(l.w2);
      let desc = 'UDL';
      if (mag1 === 0) desc = 'Tri (0→w₂)';
      else if (mag2 === 0) desc = 'Tri (w₁→0)';
      else if (Math.abs(mag1 - mag2) > 1e-3) desc = 'Trapezoid';

      return `
        <tr class="${rowClass}">
          <td class="py-1.5 px-3 font-sans font-semibold text-amber-600 dark:text-amber-400">
            ${desc} (${isUp ? '↑' : '↓'}) ${isEditing ? `<span class="text-[10px] text-sky-500 ml-1 font-normal">${editTag}</span>` : ''}
          </td>
          <td class="py-1.5 px-3">${Units.dist(mag1).toFixed(1)}→${Units.dist(mag2).toFixed(1)} ${Units.uDist()}</td>
          <td class="py-1.5 px-3">${Units.len(l.x1).toFixed(2)}–${Units.len(l.x2).toFixed(2)} ${Units.uLen()}</td>
          <td class="py-1.5 px-2 text-right whitespace-nowrap">
            <button onclick="startEditLoad(${l.id})" class="text-sky-500 hover:text-sky-400 mr-2" title="${editTip}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="removeLoad(${l.id})" class="text-slate-400 hover:text-rose-500" title="${delTip}"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>`;
    } else {
      return `
        <tr class="${rowClass}">
          <td class="py-1.5 px-3 font-sans font-semibold text-purple-600 dark:text-purple-400">
            Moment ${isEditing ? `<span class="text-[10px] text-sky-500 ml-1 font-normal">${editTag}</span>` : ''}
          </td>
          <td class="py-1.5 px-3">${Units.mom(l.M).toFixed(2)} ${Units.uMom()}</td>
          <td class="py-1.5 px-3">x = ${Units.len(l.x).toFixed(3)} ${Units.uLen()}</td>
          <td class="py-1.5 px-2 text-right whitespace-nowrap">
            <button onclick="startEditLoad(${l.id})" class="text-sky-500 hover:text-sky-400 mr-2" title="${editTip}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="removeLoad(${l.id})" class="text-slate-400 hover:text-rose-500" title="${delTip}"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        </tr>`;
    }
  }).join('');
}

/*************************************************************************
 * 1D EULER-BERNOULLI FINITE ELEMENT SOLVER (DIRECT STIFFNESS METHOD)
 *************************************************************************/
function solveGaussian(A, b) {
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
}

function solveBeamFEA() {
  const L_total = model.length;
  // Convert E (GPa) and I (cm⁴) to kN and m:
  // E in kN/m² = E_GPa * 1e6
  // I in m⁴ = I_cm4 * 1e-8
  // EI in kN·m² = E_GPa * I_cm4 * 0.01
  const EI = Math.max(1e-9, model.E * model.I * 0.01);

  // Step 1: Collect exact key stations (beam ends, supports, point/moment loads, UDL boundaries)
  const rawKeys = [0, L_total];
  model.supports.forEach(s => rawKeys.push(Math.max(0, Math.min(L_total, +s.x.toFixed(6)))));
  model.loads.forEach(l => {
    if (l.type === 'point' || l.type === 'moment') {
      rawKeys.push(Math.max(0, Math.min(L_total, +l.x.toFixed(6))));
    } else if (l.type === 'udl') {
      rawKeys.push(Math.max(0, Math.min(L_total, +l.x1.toFixed(6))));
      rawKeys.push(Math.max(0, Math.min(L_total, +l.x2.toFixed(6))));
    }
  });
  rawKeys.sort((a, b) => a - b);
  const keyPoints = [rawKeys[0]];
  for (let i = 1; i < rawKeys.length; i++) {
    if (rawKeys[i] - keyPoints[keyPoints.length - 1] > 1e-6) {
      keyPoints.push(rawKeys[i]);
    }
  }

  // Step 2: Subdivide each span [xA, xB] between consecutive key points uniformly
  // This guarantees no sliver elements ever occur and every support/load sits on an exact node
  const N_target = 250;
  const cleanNodes = [keyPoints[0]];
  for (let k = 0; k < keyPoints.length - 1; k++) {
    const xA = keyPoints[k];
    const xB = keyPoints[k + 1];
    const spanLen = xB - xA;
    const nSub = Math.max(1, Math.round((spanLen / L_total) * N_target));
    for (let j = 1; j <= nSub; j++) {
      cleanNodes.push(j === nSub ? xB : +(xA + (spanLen * j) / nSub).toFixed(7));
    }
  }

  const numNodes = cleanNodes.length;
  const ndof = 2 * numNodes; // [v_i (upward +), theta_i (CCW +)]
  const K = Array.from({ length: ndof }, () => new Array(ndof).fill(0));
  const F = new Array(ndof).fill(0);

  // Assemble element stiffness using unit flexural rigidity (EI_unit = 1.0)
  // This makes K, U_unit (= EI*U), and support reactions R = K*U_unit - F 100% invariant to cross-section
  for (let e = 0; e < numNodes - 1; e++) {
    const x1 = cleanNodes[e];
    const x2 = cleanNodes[e + 1];
    const Le = x2 - x1;
    const c = 1.0 / (Le * Le * Le);
    const ke = [
      [12 * c, 6 * Le * c, -12 * c, 6 * Le * c],
      [6 * Le * c, 4 * Le * Le * c, -6 * Le * c, 2 * Le * Le * c],
      [-12 * c, -6 * Le * c, 12 * c, -6 * Le * c],
      [6 * Le * c, 2 * Le * Le * c, -6 * Le * c, 4 * Le * Le * c]
    ];

    const dofs = [2 * e, 2 * e + 1, 2 * (e + 1), 2 * (e + 1) + 1];
    for (let r = 0; r < 4; r++) {
      for (let col = 0; col < 4; col++) {
        K[dofs[r]][dofs[col]] += ke[r][col];
      }
    }

    // Check overlapping UDL/trapezoidal loads on this element [x1, x2]
    model.loads.forEach(l => {
      if (l.type === 'udl') {
        if (x1 >= l.x1 - 1e-5 && x2 <= l.x2 + 1e-5) {
          const spanL = l.x2 - l.x1;
          const wa = l.w1 + (l.w2 - l.w1) * ((x1 - l.x1) / spanL);
          const wb = l.w1 + (l.w2 - l.w1) * ((x2 - l.x1) / spanL);
          // Downward distributed load -> negative upward force
          const f1 = -Le * (7 * wa + 3 * wb) / 20;
          const m1 = -Le * Le * (3 * wa + 2 * wb) / 60;
          const f2 = -Le * (3 * wa + 7 * wb) / 20;
          const m2 = Le * Le * (2 * wa + 3 * wb) / 60;
          F[dofs[0]] += f1;
          F[dofs[1]] += m1;
          F[dofs[2]] += f2;
          F[dofs[3]] += m2;
        }
      }
    });
  }

  // Apply concentrated point loads and moments at exact nodes
  model.loads.forEach(l => {
    if (l.type === 'point' || l.type === 'moment') {
      let bestIdx = 0;
      let minDist = Infinity;
      cleanNodes.forEach((nx, idx) => {
        const d = Math.abs(nx - l.x);
        if (d < minDist) { minDist = d; bestIdx = idx; }
      });
      if (l.type === 'point') {
        F[2 * bestIdx] -= l.P; // Downward P is negative upward
      } else if (l.type === 'moment') {
        F[2 * bestIdx + 1] -= l.M; // Clockwise moment M
      }
    }
  });

  // Identify constrained DOFs from supports
  const constrained = new Set();
  const supportNodeMap = [];
  let numRestraints = 0;
  model.supports.forEach(s => {
    let bestIdx = 0;
    let minDist = Infinity;
    cleanNodes.forEach((nx, idx) => {
      const d = Math.abs(nx - s.x);
      if (d < minDist) { minDist = d; bestIdx = idx; }
    });
    constrained.add(2 * bestIdx);
    numRestraints += 1;
    if (s.type === 'fixed') {
      constrained.add(2 * bestIdx + 1);
      numRestraints += 1;
    }
    supportNodeMap.push({ support: s, nodeIdx: bestIdx });
  });

  solution.dsi = numRestraints - 2;

  // Partition free DOFs and solve K_ff * uf_unit = F_f
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

  // U_unit holds [EI * v(x) in kN·m³, EI * theta(x) in kN·m²]
  const uf_unit = solveGaussian(Kff, Ff);
  const U_unit = new Array(ndof).fill(0);
  for (let i = 0; i < nf; i++) {
    U_unit[freeDofs[i]] = uf_unit[i];
  }

  // Compute nodal support reactions: R = K_unit * U_unit - F (100% independent of section E, I)
  solution.reactions = supportNodeMap.map(item => {
    const idx = item.nodeIdx;
    let Ry = -F[2 * idx];
    let Mz = -F[2 * idx + 1];
    for (let j = 0; j < ndof; j++) {
      Ry += K[2 * idx][j] * U_unit[j];
      Mz += K[2 * idx + 1][j] * U_unit[j];
    }
    return {
      x: item.support.x,
      type: item.support.type,
      Ry: Ry, // Upward reaction in kN
      ReportRy: -Ry, // Standard textbook report sign convention (7.7978, -36.3813, -35.3165)
      Mz: item.support.type === 'fixed' ? Mz : 0
    };
  });

  // Sample V(x), M(x), Slope, Deflection, Stress along the beam
  const samples = [];
  const S_mm3 = Math.max(1e-6, (model.I * 1e4) / model.y); // I(cm4->mm4) / y(mm) = mm³

  for (let i = 0; i < numNodes; i++) {
    const x = cleanNodes[i];
    const ei_v = U_unit[2 * i]; // EI * v in kN·m³ (upward +)
    const ei_theta = U_unit[2 * i + 1]; // EI * dv/dx in kN·m²

    let deflVal, slopeVal;
    if (model.ignoreSection) {
      // No Cross-Section / Constant-EI Mode:
      // Relative deflection EIδ in kN·m³ (upward +, downward -)
      deflVal = ei_v;
      // Relative slope EIθ in kN·m² (-EI * dv/dx matching textbook sign convention)
      slopeVal = -ei_theta;
    } else {
      // Standard Cross-Section Mode:
      const v_m = ei_v / EI; // upward deflection in meters
      const theta_rad = ei_theta / EI; // dv/dx in radians
      deflVal = v_m * 1000; // Deflection in mm
      slopeVal = -theta_rad * (180 / Math.PI); // Slope in Degrees
    }

    // Evaluate V(x) and M(x) from left-hand equilibrium (just to the left & right of x)
    const evalVM = (xEval) => {
      let V = 0;
      let M = 0;
      solution.reactions.forEach(r => {
        if (r.x <= xEval) {
          V += r.Ry;
          M += r.Ry * (xEval - r.x) - r.Mz;
        }
      });
      model.loads.forEach(l => {
        if (l.type === 'point' && l.x <= xEval) {
          V -= l.P;
          M -= l.P * (xEval - l.x);
        } else if (l.type === 'moment' && l.x <= xEval) {
          M += l.M;
        } else if (l.type === 'udl' && l.x1 < xEval) {
          const xb = Math.min(xEval, l.x2);
          const len = xb - l.x1;
          const span = l.x2 - l.x1;
          const wb = l.w1 + (l.w2 - l.w1) * (len / span);
          const F_rect = l.w1 * len;
          const F_tri = 0.5 * (wb - l.w1) * len;
          V -= (F_rect + F_tri);
          M -= F_rect * (xEval - (l.x1 + len / 2)) + F_tri * (xEval - (l.x1 + (2 * len) / 3));
        }
      });
      return { V, M };
    };

    // Push slightly-left and slightly-right at jump stations for crisp vertical step in SFD
    const isJump = model.supports.some(s => Math.abs(s.x - x) < 1e-5) ||
                   model.loads.some(l => (l.type === 'point' || l.type === 'moment') && Math.abs(l.x - x) < 1e-5);

    if (isJump && x > 0) {
      const leftVM = evalVM(x - 1e-7);
      samples.push({
        x,
        V: leftVM.V,
        M: leftVM.M,
        slope: slopeVal,
        defl: deflVal,
        sigma: model.ignoreSection ? 0 : (Math.abs(leftVM.M) * 1e6) / S_mm3
      });
    }

    const rightVM = evalVM(x + 1e-7);
    samples.push({
      x,
      V: x >= L_total - 1e-7 ? 0 : rightVM.V,
      M: x >= L_total - 1e-7 ? 0 : rightVM.M,
      slope: slopeVal,
      defl: deflVal,
      sigma: model.ignoreSection ? 0 : (Math.abs(rightVM.M) * 1e6) / S_mm3
    });
  }

  solution.samples = samples;
  solution.isValid = true;

  // Compute Positive and Negative Extrema
  let maxPosV = { val: -Infinity, x: 0 }, minNegV = { val: Infinity, x: 0 };
  let maxPosM = { val: -Infinity, x: 0 }, minNegM = { val: Infinity, x: 0 };
  let maxPosSlope = { val: -Infinity, x: 0 }, minNegSlope = { val: Infinity, x: 0 };
  let maxPosDelta = { val: -Infinity, x: 0 }, minNegDelta = { val: Infinity, x: 0 };
  let maxSigma = { val: 0, x: 0 };

  samples.forEach(s => {
    if (s.V > maxPosV.val) maxPosV = { val: s.V, x: s.x };
    if (s.V < minNegV.val) minNegV = { val: s.V, x: s.x };
    if (s.M > maxPosM.val) maxPosM = { val: s.M, x: s.x };
    if (s.M < minNegM.val) minNegM = { val: s.M, x: s.x };
    if (s.slope > maxPosSlope.val) maxPosSlope = { val: s.slope, x: s.x };
    if (s.slope < minNegSlope.val) minNegSlope = { val: s.slope, x: s.x };
    if (s.defl > maxPosDelta.val) maxPosDelta = { val: s.defl, x: s.x };
    if (s.defl < minNegDelta.val) minNegDelta = { val: s.defl, x: s.x };
    if (s.sigma > maxSigma.val) maxSigma = { val: s.sigma, x: s.x };
  });

  solution.maxPosV = maxPosV; solution.minNegV = minNegV;
  solution.maxPosM = maxPosM; solution.minNegM = minNegM;
  solution.maxPosSlope = maxPosSlope; solution.minNegSlope = minNegSlope;
  solution.maxPosDelta = maxPosDelta; solution.minNegDelta = minNegDelta;

  solution.maxV = Math.abs(maxPosV.val) >= Math.abs(minNegV.val) ? maxPosV : minNegV;
  solution.maxM = Math.abs(maxPosM.val) >= Math.abs(minNegM.val) ? maxPosM : minNegM;
  solution.maxSlope = Math.abs(maxPosSlope.val) >= Math.abs(minNegSlope.val) ? maxPosSlope : minNegSlope;
  solution.maxDelta = Math.abs(maxPosDelta.val) >= Math.abs(minNegDelta.val) ? maxPosDelta : minNegDelta;
  solution.maxSigma = maxSigma;
}

/*************************************************************************
 * RENDER 1D TABLES, KPI CARDS, CROSS-SECTION & DIAGRAMS
 *************************************************************************/
function solveAndRender() {
  renderSupportsTable();
  renderLoadsTable();
  solveBeamFEA();
  renderCrossSectionVisualizer();
  updateKPIsAndReactions();
  renderBeamSchematic();
  renderAllDiagrams();
  updateProbeHUD(hoveredBeamX);
  if (currentWorkspace === 'report' && typeof refreshCalculationReport === 'function') {
    refreshCalculationReport();
  }
}

function renderCrossSectionVisualizer() {
  const isTH = currentLang === 'th';
  const lblSec = document.getElementById('lblActiveSectionName');
  const valS = document.getElementById('valSecModulus');
  const unitS = document.getElementById('unitBadgeS');
  const valEI = document.getElementById('valFlexEI');
  const unitEI = document.getElementById('unitBadgeEI');
  const valR = document.getElementById('valRadGyr');
  const unitR = document.getElementById('unitBadgeR');

  const canvas = document.getElementById('sectionCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 100, 100);

  if (model.ignoreSection) {
    if (lblSec) lblSec.innerText = isTH ? 'ไม่คิดหน้าตัด (EI คงที่)' : 'NO SECTION (EI = CONST)';
    if (valS) valS.innerText = 'N/A';
    if (unitS) unitS.innerText = isTH ? 'ไม่ใช้' : '-';
    if (valEI) valEI.innerText = isTH ? 'EI คงที่' : 'Const EI';
    if (unitEI) unitEI.innerText = 'EI = 1';
    if (valR) valR.innerText = 'N/A';
    if (unitR) unitR.innerText = isTH ? 'ไม่ใช้' : '-';

    // Draw 1D Idealized Beam Line Schematic
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(16, 48);
    ctx.lineTo(84, 48);
    ctx.stroke();

    // Left pin support triangle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(13, 63);
    ctx.lineTo(27, 63);
    ctx.closePath();
    ctx.fill();

    // Right roller support triangle
    ctx.beginPath();
    ctx.moveTo(80, 50);
    ctx.lineTo(73, 63);
    ctx.lineTo(87, 63);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('1D BEAM', 50, 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText('EI = const', 50, 82);
    return;
  }

  if (lblSec) lblSec.innerText = model.sectionName;
  const S_cm3 = model.I / (model.y / 10);
  const EI_MNm2 = model.E * model.I * 1e-5;
  const r_cm = Math.sqrt(model.I / model.A);

  if (valS) valS.innerText = Units.S(S_cm3).toFixed(2);
  if (unitS) unitS.innerText = Units.uS();
  if (valEI) valEI.innerText = Units.EI(EI_MNm2).toFixed(2);
  if (unitEI) unitEI.innerText = Units.uEI();
  if (valR) valR.innerText = Units.r(r_cm).toFixed(2);
  if (unitR) unitR.innerText = Units.uR();

  ctx.strokeStyle = '#38bdf8';
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 2;

  if (model.shape === 'steel_w' || model.shape === 'ibeam') {
    // Draw I-Section
    ctx.beginPath();
    ctx.rect(24, 16, 52, 10);
    ctx.rect(45, 26, 10, 48);
    ctx.rect(24, 74, 52, 10);
    ctx.fill();
    ctx.stroke();
  } else if (model.shape === 'steel_tube' || model.shape === 'box') {
    // Draw Box / HSS Section
    ctx.beginPath();
    ctx.rect(26, 18, 48, 64);
    ctx.rect(34, 26, 32, 48);
    ctx.fill('evenodd');
    ctx.strokeRect(26, 18, 48, 64);
    ctx.strokeRect(34, 26, 32, 48);
  } else if (model.shape === 'channel') {
    // Draw C-Channel
    ctx.beginPath();
    ctx.moveTo(70, 18);
    ctx.lineTo(30, 18);
    ctx.lineTo(30, 82);
    ctx.lineTo(70, 82);
    ctx.lineTo(70, 72);
    ctx.lineTo(40, 72);
    ctx.lineTo(40, 28);
    ctx.lineTo(70, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (model.shape === 'pipe') {
    // Draw Circular Pipe
    ctx.beginPath();
    ctx.arc(50, 50, 32, 0, Math.PI * 2);
    ctx.arc(50, 50, 22, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.beginPath(); ctx.arc(50, 50, 32, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(50, 50, 22, 0, Math.PI * 2); ctx.stroke();
  } else if (model.shape === 'tbeam') {
    // Draw T-Beam
    ctx.beginPath();
    ctx.rect(22, 18, 56, 12);
    ctx.rect(44, 30, 12, 52);
    ctx.fill();
    ctx.stroke();
  } else {
    // Solid Rectangle (RC / Timber)
    ctx.fillRect(28, 16, 44, 68);
    ctx.strokeRect(28, 16, 44, 68);
  }

  // Neutral Axis line
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(8, 50);
  ctx.lineTo(92, 50);
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateKPIsAndReactions() {
  if (!solution.isValid) return;

  const dict = i18n[currentLang] || i18n.th;
  const dsiEl = document.getElementById('dsiBadge');
  if (solution.dsi === 0) {
    dsiEl.innerText = 'Determinate (DSI = 0)';
  } else if (solution.dsi > 0) {
    dsiEl.innerText = `Indeterminate (DSI = ${solution.dsi})`;
  } else {
    dsiEl.innerText = 'Unstable Mechanism';
  }

  document.getElementById('valMaxV').innerText = `${Units.force(Math.abs(solution.maxV.val)).toFixed(2)} ${Units.uForce()}`;
  document.getElementById('valMaxVLoc').innerText = `@ x = ${Units.len(solution.maxV.x).toFixed(3)} ${Units.uLen()}`;

  document.getElementById('valMaxM').innerText = `${Units.mom(Math.abs(solution.maxM.val)).toFixed(2)} ${Units.uMom()}`;
  document.getElementById('valMaxMLoc').innerText = `@ x = ${Units.len(solution.maxM.x).toFixed(3)} ${Units.uLen()}`;

  const lblCardSlope = document.getElementById('lblCardMaxSlope');
  const lblCardDelta = document.getElementById('lblCardMaxDelta');
  if (model.ignoreSection) {
    if (lblCardSlope) lblCardSlope.innerText = dict.cardMaxEITheta;
    if (lblCardDelta) lblCardDelta.innerText = dict.cardMaxEIDelta;
    document.getElementById('valMaxSlope').innerText = `${Units.eiTheta(Math.abs(solution.maxSlope.val)).toFixed(3)} ${Units.uEITheta()}`;
    document.getElementById('valMaxSlopeLoc').innerText = `@ x = ${Units.len(solution.maxSlope.x).toFixed(3)} ${Units.uLen()}`;
    document.getElementById('valMaxDelta').innerText = `${Units.eiDelta(solution.maxDelta.val).toFixed(3)} ${Units.uEIDelta()}`;
    document.getElementById('valMaxDeltaLoc').innerText = `@ x = ${Units.len(solution.maxDelta.x).toFixed(3)} ${Units.uLen()}`;
  } else {
    if (lblCardSlope) lblCardSlope.innerText = dict.cardMaxSlope;
    if (lblCardDelta) lblCardDelta.innerText = dict.cardMaxDelta;
    document.getElementById('valMaxSlope').innerText = `${Math.abs(solution.maxSlope.val).toFixed(3)} Deg`;
    document.getElementById('valMaxSlopeLoc').innerText = `@ x = ${Units.len(solution.maxSlope.x).toFixed(3)} ${Units.uLen()}`;
    document.getElementById('valMaxDelta').innerText = `${Units.defl(solution.maxDelta.val).toFixed(3)} ${Units.uDefl()}`;
    document.getElementById('valMaxDeltaLoc').innerText = `@ x = ${Units.len(solution.maxDelta.x).toFixed(3)} ${Units.uLen()}`;
  }

  const container = document.getElementById('reactionsDisplayContainer');
  if (!container) return;
  container.innerHTML = solution.reactions.map((r, i) => `
    <div class="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
      <div>
        <div class="text-[10px] font-bold uppercase text-indigo-500">Support R${i + 1} (${r.type})</div>
        <div class="text-xs text-slate-500 font-mono">x = ${Units.len(r.x).toFixed(2)} ${Units.uLen()}</div>
      </div>
      <div class="text-right font-mono">
        <div class="text-sm font-extrabold ${r.Ry >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}">
          Ry = ${r.Ry >= 0 ? '↑' : '↓'} ${Units.force(Math.abs(r.Ry)).toFixed(4)} ${Units.uForce()}
        </div>
        ${r.type === 'fixed' ? `<div class="text-[11px] text-purple-500">Mz = ${Units.mom(r.Mz).toFixed(3)} ${Units.uMom()}</div>` : `<div class="text-[10px] text-slate-400">Report Force: ${Units.force(r.ReportRy).toFixed(4)} ${Units.uForce()}</div>`}
      </div>
    </div>
  `).join('');
}

function renderBeamSchematic() {
  const canvas = document.getElementById('beamCanvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const padL = W < 480 ? 32 : 55, padR = W < 480 ? 32 : 55;
  const plotW = W - padL - padR;
  const beamY = H * 0.52;
  const L = model.length;
  const xToPx = x => padL + (x / L) * plotW;

  ctx.fillStyle = isDarkMode ? '#090f1d' : '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Subtle station grid lines
  ctx.strokeStyle = isDarkMode ? '#1e293b' : '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = 0; x <= L + 0.001; x += 0.5) {
    const px = xToPx(x);
    ctx.beginPath();
    ctx.moveTo(px, 20);
    ctx.lineTo(px, H - 25);
    ctx.stroke();
  }

  // Elastic Deflected Ghost Curve
  const showGhost = document.getElementById('chkShowElasticGhost')?.checked;
  if (showGhost && solution.samples.length > 0) {
    const maxAbsD = Math.max(1e-6, Math.abs(solution.maxDelta.val));
    ctx.save();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    solution.samples.forEach((s, idx) => {
      const px = xToPx(s.x);
      const py = beamY - (s.defl / maxAbsD) * 32;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  // Main Beam Bar
  ctx.fillStyle = isDarkMode ? '#64748b' : '#737373';
  ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#525252';
  ctx.lineWidth = 1.5;
  ctx.fillRect(padL, beamY - 7, plotW, 14);
  ctx.strokeRect(padL, beamY - 7, plotW, 14);

  // Supports (Red Triangles / Rollers / Fixed Walls)
  model.supports.forEach(s => {
    const px = xToPx(s.x);
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5;
    if (s.type === 'fixed') {
      ctx.fillRect(px - 5, beamY - 26, 10, 52);
    } else {
      ctx.beginPath();
      ctx.moveTo(px, beamY + 7);
      ctx.lineTo(px - 11, beamY + 27);
      ctx.lineTo(px + 11, beamY + 27);
      ctx.closePath();
      ctx.fill();
      if (s.type === 'roller') {
        ctx.beginPath();
        ctx.arc(px - 5, beamY + 31, 3, 0, Math.PI * 2);
        ctx.arc(px + 5, beamY + 31, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#334155';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${+Units.len(s.x).toFixed(2)}${Units.uLen()}`, px, beamY + 42);
  });

  // Applied Loads (Point Loads, Triangular/Trapezoidal Distributed Loads, Moments)
  const maxP = Math.max(10, ...model.loads.filter(l => l.type === 'point').map(l => Math.abs(l.P)));
  model.loads.forEach(l => {
    const isEditing = editingLoadId === l.id;

    if (l.type === 'point') {
      const px = xToPx(l.x);
      const isUp = l.P < 0;
      const mag = Math.abs(l.P);
      const len = 28 + (mag / maxP) * 32;

      ctx.strokeStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
      ctx.fillStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
      ctx.lineWidth = isEditing ? 3.5 : 2.5;

      if (isUp) {
        // Upward Point Load (แรงดันขึ้นจากข้างล่าง)
        const yStart = beamY + 9 + len;
        const yEnd = beamY + 9;
        ctx.beginPath();
        ctx.moveTo(px, yStart);
        ctx.lineTo(px, yEnd);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, yEnd);
        ctx.lineTo(px - 6, yEnd + 8);
        ctx.lineTo(px + 6, yEnd + 8);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`↑ ${+Units.force(mag).toFixed(2)} ${Units.uForce()}`, px, yStart + 13);
      } else {
        // Downward Point Load (แรงกดลงจากข้างบน)
        const yStart = beamY - 9 - len;
        const yEnd = beamY - 9;
        ctx.beginPath();
        ctx.moveTo(px, yStart);
        ctx.lineTo(px, yEnd);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, yEnd);
        ctx.lineTo(px - 6, yEnd - 8);
        ctx.lineTo(px + 6, yEnd - 8);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`↓ ${+Units.force(mag).toFixed(2)} ${Units.uForce()}`, px, yStart - 6);
      }
    } else if (l.type === 'udl') {
      const px1 = xToPx(l.x1);
      const px2 = xToPx(l.x2);
      const isUp = l.w1 < 0 && l.w2 < 0;
      const mag1 = Math.abs(l.w1);
      const mag2 = Math.abs(l.w2);
      const maxW = Math.max(mag1, mag2, 1);
      const maxH = 46;

      const h1 = (mag1 / maxW) * maxH;
      const h2 = (mag2 / maxW) * maxH;

      ctx.save();
      if (isUp) {
        // Upward Distributed Load (แรงแผ่ดันขึ้นใต้คาน)
        const yBase = beamY + 9;
        const y1 = yBase + h1;
        const y2 = yBase + h2;

        ctx.beginPath();
        ctx.moveTo(px1, yBase);
        ctx.lineTo(px1, y1);
        ctx.lineTo(px2, y2);
        ctx.lineTo(px2, yBase);
        ctx.closePath();
        ctx.fillStyle = isEditing ? 'rgba(56, 189, 248, 0.25)' : (isDarkMode ? 'rgba(244, 63, 94, 0.22)' : 'rgba(239, 68, 68, 0.15)');
        ctx.fill();
        ctx.strokeStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
        ctx.lineWidth = isEditing ? 2.5 : 1.5;
        ctx.stroke();

        // Arrowheads pointing UP
        const numArrows = Math.max(3, Math.min(12, Math.round((px2 - px1) / 28)));
        for (let k = 0; k <= numArrows; k++) {
          const t = k / numArrows;
          const ax = px1 + t * (px2 - px1);
          const ah = h1 + t * (h2 - h1);
          if (ah > 6) {
            ctx.beginPath();
            ctx.moveTo(ax, yBase + ah);
            ctx.lineTo(ax, yBase);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(ax, yBase);
            ctx.lineTo(ax - 3.5, yBase + 7);
            ctx.lineTo(ax + 3.5, yBase + 7);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
        if (Math.abs(mag1 - mag2) < 1e-3) {
          ctx.textAlign = 'center';
          ctx.fillText(`↑ ${+Units.dist(mag1).toFixed(2)} ${Units.uDist()}`, (px1 + px2) / 2, yBase + h1 + 14);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(mag1 === 0 ? '0' : `w₁=${+Units.dist(mag1).toFixed(1)}`, px1, y1 + 14);
          ctx.fillText(mag2 === 0 ? '0' : `w₂=${+Units.dist(mag2).toFixed(1)} ${Units.uDist()}`, px2, y2 + 14);
        }
      } else {
        // Downward Distributed Load (แรงแผ่กดลง: รองรับทั้งคงที่, สามเหลี่ยมเริ่มจาก 0, และคางหมู)
        const yBase = beamY - 9;
        const y1 = yBase - h1;
        const y2 = yBase - h2;

        ctx.beginPath();
        ctx.moveTo(px1, yBase);
        ctx.lineTo(px1, y1);
        ctx.lineTo(px2, y2);
        ctx.lineTo(px2, yBase);
        ctx.closePath();
        ctx.fillStyle = isEditing ? 'rgba(56, 189, 248, 0.25)' : (isDarkMode ? 'rgba(244, 63, 94, 0.22)' : 'rgba(239, 68, 68, 0.15)');
        ctx.fill();
        ctx.strokeStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
        ctx.lineWidth = isEditing ? 2.5 : 1.5;
        ctx.stroke();

        // Arrowheads pointing DOWN
        const numArrows = Math.max(3, Math.min(12, Math.round((px2 - px1) / 28)));
        for (let k = 0; k <= numArrows; k++) {
          const t = k / numArrows;
          const ax = px1 + t * (px2 - px1);
          const ah = h1 + t * (h2 - h1);
          if (ah > 6) {
            ctx.beginPath();
            ctx.moveTo(ax, yBase - ah);
            ctx.lineTo(ax, yBase);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(ax, yBase);
            ctx.lineTo(ax - 3.5, yBase - 7);
            ctx.lineTo(ax + 3.5, yBase - 7);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = isEditing ? '#38bdf8' : (isDarkMode ? '#f43f5e' : '#dc2626');
        if (Math.abs(mag1 - mag2) < 1e-3) {
          ctx.textAlign = 'center';
          ctx.fillText(`↓ ${+Units.dist(mag1).toFixed(2)} ${Units.uDist()}`, (px1 + px2) / 2, y1 - 6);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(mag1 === 0 ? '0' : `w₁=${+Units.dist(mag1).toFixed(1)}`, px1, y1 - 6);
          ctx.fillText(mag2 === 0 ? '0' : `w₂=${+Units.dist(mag2).toFixed(1)} ${Units.uDist()}`, px2, y2 - 6);
        }
      }
      ctx.restore();
    } else if (l.type === 'moment') {
      const px = xToPx(l.x);
      ctx.strokeStyle = isEditing ? '#38bdf8' : '#a855f7';
      ctx.fillStyle = isEditing ? '#38bdf8' : '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, beamY - 14, 16, Math.PI * 0.2, Math.PI * 1.8, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(px + 12, beamY - 26);
      ctx.lineTo(px + 17, beamY - 17);
      ctx.lineTo(px + 8, beamY - 18);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${+Units.mom(l.M).toFixed(1)} ${Units.uMom()}`, px, beamY - 34);
    }
  });

  // FBD Reaction Vectors
  if (document.getElementById('chkShowFBD')?.checked && solution.reactions) {
    solution.reactions.forEach(r => {
      const px = xToPx(r.x);
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, beamY + 68);
      ctx.lineTo(px, beamY + 46);
      ctx.stroke();
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`R=${Units.force(r.Ry).toFixed(2)}${Units.uForce()}`, px, beamY + 80);
    });
  }

  // Interactive Station Cursor Line
  const curPx = xToPx(hoveredBeamX);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(curPx, 12);
  ctx.lineTo(curPx, H - 12);
  ctx.stroke();
  ctx.setLineDash([]);
}

function renderSingleDiagram(canvasId, key, colorHex, fillRgba, unitStr, extremaPos, extremaNeg, captionId, convFn = v => v) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !solution.isValid) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const padL = W < 480 ? 32 : 55, padR = W < 480 ? 32 : 55, padT = 18, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const L = model.length;

  ctx.fillStyle = isDarkMode ? '#090f1d' : '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const vals = solution.samples.map(s => s[key]);
  const maxV = Math.max(0, ...vals);
  const minV = Math.min(0, ...vals);
  const absMax = Math.max(1e-6, Math.abs(maxV), Math.abs(minV));

  const zeroY = padT + plotH * 0.5;
  const scaleY = (plotH * 0.42) / absMax;
  const xToPx = x => padL + (x / L) * plotW;
  const yToPx = v => zeroY - v * scaleY;

  // Grid
  ctx.strokeStyle = isDarkMode ? '#1e293b' : '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = 0; x <= L + 0.001; x += 0.5) {
    const px = xToPx(x);
    ctx.beginPath();
    ctx.moveTo(px, padT);
    ctx.lineTo(px, H - padB);
    ctx.stroke();
    if (Math.abs(x % 1) < 1e-3 || Math.abs((x - 0.5) % 1) < 1e-3) {
      ctx.fillStyle = isDarkMode ? '#64748b' : '#475569';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(Units.len(x).toFixed(1), px, H - 6);
    }
  }

  // Zero baseline (Red reference line)
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, zeroY);
  ctx.lineTo(padL + plotW, zeroY);
  ctx.stroke();

  // Shaded Area
  ctx.beginPath();
  ctx.moveTo(xToPx(0), zeroY);
  solution.samples.forEach(s => ctx.lineTo(xToPx(s.x), yToPx(s[key])));
  ctx.lineTo(xToPx(L), zeroY);
  ctx.closePath();
  ctx.fillStyle = fillRgba;
  ctx.fill();

  // Curve Stroke
  ctx.beginPath();
  solution.samples.forEach((s, idx) => {
    if (idx === 0) ctx.moveTo(xToPx(s.x), yToPx(s[key]));
    else ctx.lineTo(xToPx(s.x), yToPx(s[key]));
  });
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Red Extrema Dots
  [extremaPos, extremaNeg].forEach(ext => {
    if (ext && isFinite(ext.val) && Math.abs(ext.val) > 1e-5) {
      const px = xToPx(ext.x);
      const py = yToPx(ext.val);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Hover Scrubber Line
  const curPx = xToPx(hoveredBeamX);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(curPx, padT);
  ctx.lineTo(curPx, H - padB);
  ctx.stroke();
  ctx.setLineDash([]);

  if (captionId && extremaPos && extremaNeg) {
    const capEl = document.getElementById(captionId);
    if (capEl) {
      const uL = Units.uLen();
      capEl.innerText = `Max +ve: ${convFn(extremaPos.val).toFixed(3)} ${unitStr} (${Units.len(extremaPos.x).toFixed(3)}${uL}) | Max -ve: ${convFn(extremaNeg.val).toFixed(3)} ${unitStr} (${Units.len(extremaNeg.x).toFixed(3)}${uL})`;
    }
  }
}

function renderAllDiagrams() {
  const isTH = currentLang === 'th';
  const suiteTitle = document.getElementById('diagramsSuiteHeaderTitle');
  const titleSlope = document.getElementById('titleDiagramSlope');
  const titleDefl = document.getElementById('titleDiagramDefl');
  const stressBlock = document.getElementById('diagramStressBlock');
  const sepSigma = document.getElementById('sepProbeSigma');
  const wrapSigma = document.getElementById('wrapProbeSigma');
  const lblTheta = document.getElementById('lblProbeTheta');
  const unitTheta = document.getElementById('unitProbeTheta');
  const lblDelta = document.getElementById('lblProbeDelta');
  const unitDelta = document.getElementById('unitProbeDelta');

  renderSingleDiagram('canvasSFD', 'V', '#38bdf8', 'rgba(56, 189, 248, 0.22)', Units.uForce(), solution.maxPosV, solution.minNegV, 'captionSFD', Units.force);
  renderSingleDiagram('canvasBMD', 'M', '#a855f7', 'rgba(168, 85, 247, 0.22)', Units.uMom(), solution.maxPosM, solution.minNegM, 'captionBMD', Units.mom);

  if (model.ignoreSection) {
    if (suiteTitle) {
      suiteTitle.innerText = isTH
        ? 'ชุดแผนภาพ 4 ระดับ (SFD, BMD, ความชันสัมพัทธ์ EIθ, การแอ่นตัวสัมพัทธ์ EIδ — โหมดไม่คิดหน้าตัด)'
        : '4-Diagram Suite (SFD, BMD, Relative Slope EIθ, Relative Deflection EIδ — No Cross-Section)';
    }
    if (titleSlope) {
      titleSlope.innerText = isTH
        ? `3. แผนภาพความชันสัมพัทธ์ EIθ (Relative Slope) [${Units.uEITheta()}]`
        : `3. Relative Slope Diagram EIθ [${Units.uEITheta()}]`;
    }
    if (titleDefl) {
      titleDefl.innerText = isTH
        ? `4. แผนภาพการแอ่นตัวสัมพัทธ์ EIδ (Relative Deflection) [${Units.uEIDelta()}]`
        : `4. Relative Deflection Diagram EIδ [${Units.uEIDelta()}]`;
    }
    if (stressBlock) stressBlock.classList.add('hidden');
    if (sepSigma) sepSigma.classList.add('hidden');
    if (wrapSigma) wrapSigma.classList.add('hidden');
    if (lblTheta) lblTheta.innerText = 'EIθ =';
    if (unitTheta) unitTheta.innerText = Units.uEITheta();
    if (lblDelta) lblDelta.innerText = 'EIδ =';
    if (unitDelta) unitDelta.innerText = Units.uEIDelta();

    renderSingleDiagram('canvasSlope', 'slope', '#14b8a6', 'rgba(20, 184, 166, 0.22)', Units.uEITheta(), solution.maxPosSlope, solution.minNegSlope, 'captionSlope', Units.eiTheta);
    renderSingleDiagram('canvasDefl', 'defl', '#f43f5e', 'rgba(244, 63, 94, 0.22)', Units.uEIDelta(), solution.maxPosDelta, solution.minNegDelta, 'captionDefl', Units.eiDelta);
  } else {
    if (suiteTitle) {
      suiteTitle.innerText = isTH
        ? 'ชุดแผนภาพ 5 ระดับ (SFD, BMD, ความชัน θ, การแอ่นตัว δ, ความเค้นดัด σ)'
        : '5-Diagram Suite (SFD, BMD, Slope θ, Deflection δ, Bending Stress σ)';
    }
    if (titleSlope) titleSlope.innerText = `3. Slope Diagram θ [Deg]`;
    if (titleDefl) titleDefl.innerText = `4. Deflection Diagram δ [${Units.uDefl()}]`;
    if (stressBlock) stressBlock.classList.remove('hidden');
    if (sepSigma) sepSigma.classList.remove('hidden');
    if (wrapSigma) wrapSigma.classList.remove('hidden');
    if (lblTheta) lblTheta.innerText = 'θ =';
    if (unitTheta) unitTheta.innerText = 'Deg';
    if (lblDelta) lblDelta.innerText = 'δ =';
    if (unitDelta) unitDelta.innerText = Units.uDefl();

    renderSingleDiagram('canvasSlope', 'slope', '#14b8a6', 'rgba(20, 184, 166, 0.22)', 'Deg', solution.maxPosSlope, solution.minNegSlope, 'captionSlope', v => v);
    renderSingleDiagram('canvasDefl', 'defl', '#f43f5e', 'rgba(244, 63, 94, 0.22)', Units.uDefl(), solution.maxPosDelta, solution.minNegDelta, 'captionDefl', Units.defl);
    renderSingleDiagram('canvasStress', 'sigma', '#f59e0b', 'rgba(245, 158, 11, 0.22)', Units.uStress(), solution.maxSigma, { val: 0, x: 0 }, 'captionStress', Units.stress);
  }
}

function onSliderScrub(val) {
  hoveredBeamX = parseFloat(val);
  updateProbeHUD(hoveredBeamX);
  renderBeamSchematic();
  renderAllDiagrams();
}

function updateProbeHUD(xVal) {
  document.getElementById('sliderXReadout').innerText = `${Units.len(xVal).toFixed(2)} ${Units.uLen()}`;
  document.getElementById('probeX').innerText = Units.len(xVal).toFixed(2);
  if (!solution.samples.length) return;
  let best = solution.samples[0];
  let minD = Infinity;
  solution.samples.forEach(s => {
    const d = Math.abs(s.x - xVal);
    if (d < minD) { minD = d; best = s; }
  });
  document.getElementById('probeV').innerText = Units.force(best.V).toFixed(2);
  document.getElementById('probeM').innerText = Units.mom(best.M).toFixed(2);
  if (model.ignoreSection) {
    document.getElementById('probeTheta').innerText = Units.eiTheta(best.slope).toFixed(3);
    document.getElementById('probeDelta').innerText = Units.eiDelta(best.defl).toFixed(3);
    document.getElementById('probeSigma').innerText = '0.0';
  } else {
    document.getElementById('probeTheta').innerText = best.slope.toFixed(3);
    document.getElementById('probeDelta').innerText = Units.defl(best.defl).toFixed(3);
    document.getElementById('probeSigma').innerText = Units.stress(best.sigma).toFixed(1);
  }
}

// Attach Interactive Hover & Touch Scrubber to 1D Canvases
window.addEventListener('DOMContentLoaded', () => {
  ['beamCanvas', 'canvasSFD', 'canvasBMD', 'canvasSlope', 'canvasDefl', 'canvasStress'].forEach(id => {
    const c = document.getElementById(id);
    if (!c) return;
    const scrubAtClientX = (clientX) => {
      const rect = c.getBoundingClientRect();
      const padL = rect.width < 480 ? 32 : 55;
      const padR = rect.width < 480 ? 32 : 55;
      const plotW = Math.max(10, rect.width - padL - padR);
      const relX = Math.max(0, Math.min(1, (clientX - rect.left - padL) / plotW));
      hoveredBeamX = +(relX * model.length).toFixed(3);
      const sliderEl = document.getElementById('stationSlider');
      if (sliderEl) sliderEl.value = hoveredBeamX;
      onSliderScrub(hoveredBeamX);
    };

    c.addEventListener('mousemove', e => {
      if (isProbeLocked) return;
      scrubAtClientX(e.clientX);
    });

    c.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        isProbeLocked = false;
        scrubAtClientX(e.touches[0].clientX);
      }
    }, { passive: true });

    c.addEventListener('touchmove', e => {
      if (e.touches.length === 1) {
        scrubAtClientX(e.touches[0].clientX);
      }
    }, { passive: true });

    c.addEventListener('click', e => {
      if (id === 'beamCanvas') {
        const rect = c.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const beamY = rect.height * 0.52;
        const padL = rect.width < 480 ? 32 : 55;
        const padR = rect.width < 480 ? 32 : 55;
        const plotW = rect.width - padL - padR;
        const L = model.length;

        const clickedLoad = model.loads.find(l => {
          if (l.type === 'point' || l.type === 'moment') {
            const px = padL + (l.x / L) * plotW;
            return Math.abs(clickX - px) < 22;
          } else if (l.type === 'udl') {
            const px1 = padL + (l.x1 / L) * plotW;
            const px2 = padL + (l.x2 / L) * plotW;
            return clickX >= px1 - 10 && clickX <= px2 + 10 && Math.abs(clickY - beamY) < 60;
          }
          return false;
        });

        if (clickedLoad) {
          startEditLoad(clickedLoad.id);
          return;
        }
      }
      isProbeLocked = !isProbeLocked;
    });
  });

  window.addEventListener('resize', () => {
    if (currentWorkspace === '1d') {
      renderBeamSchematic();
      renderAllDiagrams();
    } else if (currentWorkspace === '2d' && typeof resize2DCanvas === 'function') {
      resize2DCanvas();
      render2DWorkspace();
    } else if (currentWorkspace === '3d' && typeof resize3DCanvas === 'function') {
      resize3DCanvas();
      render3DScene();
    } else if (currentWorkspace === 'report' && typeof refreshCalculationReport === 'function') {
      refreshCalculationReport();
    }
  });

  window.addEventListener('beforeprint', () => {
    if (typeof refreshCalculationReport === 'function') {
      refreshCalculationReport();
    }
  });

  // Horizontal Wheel and Drag Scroll for 1D Preset Bar
  const presetContainer = document.getElementById('beamPresetScrollContainer');
  if (presetContainer) {
    presetContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        presetContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    presetContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - presetContainer.offsetLeft;
      scrollStart = presetContainer.scrollLeft;
      presetContainer.classList.add('cursor-grabbing');
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      if (presetContainer) presetContainer.classList.remove('cursor-grabbing');
    });
    presetContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - presetContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      presetContainer.scrollLeft = scrollStart - walk;
    });
  }

  // Initial solve on startup
  loadPreset('report_example_4718');
  if (typeof updateSectionPresetDropdown === 'function') updateSectionPresetDropdown();
});

/*************************************************************************
 * PART 6: ENGINEERING UNIT CONVERTERS & CIVIL THEORY ENGINE
 * 10 Structural & Civil Engineering Converters with Two-Way Realtime Calc
 *************************************************************************/
const UnitConverters = {
  moment: {
    factors: { 'kNm': 1.0, 'Nm': 1000.0, 'kipft': 0.7375621493, 'lbft': 737.5621493, 'kipin': 8.8507457916, 'lbin': 8850.7457916, 'kgfm': 101.9716213, 'tonfm': 0.1019716213 }
  },
  lineLoad: {
    factors: { 'kNm': 1.0, 'Nm': 1000.0, 'kgfm': 101.9716213, 'tonfm': 0.1019716213, 'kipft': 0.06852176586, 'lbft': 68.52176586, 'kipin': 0.005710147155, 'lbin': 5.710147155 }
  },
  force: {
    factors: { 'kN': 1.0, 'N': 1000.0, 'MN': 0.001, 'kip': 0.2248089431, 'lbf': 224.8089431, 'kgf': 101.9716213, 'tonf': 0.1019716213 }
  },
  stress: {
    factors: { 'MPa': 1.0, 'Nmm2': 1.0, 'GPa': 0.001, 'kPa': 1000.0, 'psi': 145.0377377, 'ksi': 0.1450377377, 'psf': 20885.43423, 'ksf': 20.88543423, 'kgfcm2': 10.19716213 }
  },
  density: {
    factors: { 'kgm3': 1.0, 'gcm3': 0.001, 'lbft3': 0.0624279606, 'lbin3': 0.000036127292, 'kNm3': 0.00980665 },
    materials: {
      steel: { name: 'เหล็กโครงสร้างรูปพรรณ (Structural Steel)', kgm3: 7850, note: 'ASTM A36 / SS400 (7,850 kg/m³ = 490 pcf = 77.0 kN/m³)' },
      concrete: { name: 'คอนกรีตเสริมเหล็ก (Reinforced Concrete)', kgm3: 2400, note: 'มาตรฐาน วสท. / ACI 318 (2,400 kg/m³ = 150 pcf = 23.5 kN/m³)' },
      timber: { name: 'ไม้โครงสร้างทั่วไป (Structural Timber)', kgm3: 650, note: 'ไม้เนื้อแข็งปานกลาง-เนื้อแข็ง (650 kg/m³ = 40.6 pcf = 6.38 kN/m³)' },
      aluminum: { name: 'อะลูมิเนียมโครงสร้าง (Structural Aluminum)', kgm3: 2700, note: 'Alloy 6061-T6 (2,700 kg/m³ = 168 pcf = 26.5 kN/m³)' },
      water: { name: 'น้ำสะอาด (Fresh Water @ 4°C)', kgm3: 1000, note: 'ความหนาแน่นอ้างอิง 1,000 kg/m³ (62.4 pcf = 9.81 kN/m³)' }
    }
  },
  inertia: {
    factors: { 'cm4': 1.0, 'mm4': 10000.0, 'm4': 1e-8, 'in4': 0.0240250961, 'ft4': 0.000001158866 }
  },
  length: {
    factors: { 'm': 1.0, 'cm': 100.0, 'mm': 1000.0, 'ft': 3.280839895, 'in': 39.37007874, 'yd': 1.093613298 }
  },
  area: {
    factors: { 'm2': 1.0, 'cm2': 10000.0, 'mm2': 1000000.0, 'ft2': 10.76391042, 'in2': 1550.0031 }
  },
  volume: {
    factors: { 'm3': 1.0, 'cm3': 1000000.0, 'L': 1000.0, 'ft3': 35.31466672, 'in3': 61023.7441, 'gal': 264.172052 }
  },
  mass: {
    factors: { 'kg': 1.0, 'ton': 0.001, 'g': 1000.0, 'lb': 2.2046226218, 'kip': 0.0022046226218, 'oz': 35.27396195 }
  }
};

function onConverterInputChange(category, changedKey) {
  const cat = UnitConverters[category];
  if (!cat) return;
  const inputEl = document.getElementById(`uc_${category}_${changedKey}`);
  if (!inputEl) return;
  const val = parseFloat(inputEl.value);
  if (isNaN(val)) return;

  const baseVal = val / cat.factors[changedKey];
  for (const [key, factor] of Object.entries(cat.factors)) {
    if (key === changedKey) continue;
    const targetEl = document.getElementById(`uc_${category}_${key}`);
    if (targetEl) {
      const converted = baseVal * factor;
      targetEl.value = Math.abs(converted) >= 1e4 || (Math.abs(converted) < 0.001 && Math.abs(converted) > 0)
        ? converted.toExponential(4)
        : +converted.toFixed(4);
    }
  }
}

function applyMaterialPreset(matKey) {
  const mat = UnitConverters.density.materials[matKey];
  if (!mat) return;
  const inputKg = document.getElementById('uc_density_kgm3');
  if (inputKg) {
    inputKg.value = mat.kgm3;
    onConverterInputChange('density', 'kgm3');
  }
  const noteEl = document.getElementById('uc_density_mat_note');
  if (noteEl) {
    noteEl.innerHTML = `<strong>${mat.name}:</strong> ${mat.note}`;
  }
  showNotification('เลือกวัสดุสำเร็จ', `กำหนดความหนาแน่น ${mat.name} (${mat.kgm3} kg/m³) เรียบร้อย`);
}

function applyConvertedTo1D(type, valueKey) {
  const el = document.getElementById(valueKey);
  if (!el) return;
  const val = parseFloat(el.value);
  if (isNaN(val)) return;

  switchWorkspace('1d');
  if (type === 'lineLoad') {
    setLoadTab('udl');
    const w1 = document.getElementById('newUDLw1');
    const w2 = document.getElementById('newUDLw2');
    if (w1 && w2) {
      w1.value = val;
      w2.value = val;
    }
    showNotification('ส่งค่าไปยัง 1D คาน', `นำค่าแรงกระจาย ${val} ไปยังหน้าต่างเพิ่มแรง UDL เรียบร้อย`);
  } else if (type === 'moment') {
    setLoadTab('moment');
    const m = document.getElementById('newMomentM');
    if (m) m.value = val;
    showNotification('ส่งค่าไปยัง 1D คาน', `นำค่าโมเมนต์ ${val} ไปยังหน้าต่างเพิ่มโมเมนต์เรียบร้อย`);
  } else if (type === 'force') {
    setLoadTab('point');
    const p = document.getElementById('newPointP');
    if (p) p.value = val;
    showNotification('ส่งค่าไปยัง 1D คาน', `นำค่าแรงจุด ${val} ไปยังหน้าต่างเพิ่มแรงจุดเรียบร้อย`);
  } else if (type === 'length') {
    const l = document.getElementById('paramLength');
    if (l) {
      l.value = val;
      onParamChange();
    }
    showNotification('ส่งค่าไปยัง 1D คาน', `กำหนดความยาวคานเป็น L = ${val} เรียบร้อย`);
  }
}

function initConverters() {
  // Trigger initial calculation on default inputs
  ['moment', 'lineLoad', 'force', 'stress', 'density', 'inertia', 'length', 'area', 'volume', 'mass'].forEach(cat => {
    const keys = Object.keys(UnitConverters[cat].factors);
    if (keys.length > 0) {
      onConverterInputChange(cat, keys[0]);
    }
  });
}

function openPresetsGallery(tab = '1d') {
  const modal = document.getElementById('presetsGalleryModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  switchPresetsGalleryTab(tab);
}

function closePresetsGallery() {
  const modal = document.getElementById('presetsGalleryModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function switchPresetsGalleryTab(tab) {
  const tab1d = document.getElementById('tabGallery1D');
  const tab2d = document.getElementById('tabGallery2D');
  const view1d = document.getElementById('viewGallery1D');
  const view2d = document.getElementById('viewGallery2D');
  if (!tab1d || !tab2d || !view1d || !view2d) return;

  if (tab === '1d') {
    tab1d.className = 'px-4 py-2 font-bold text-sm border-b-2 border-sky-500 text-sky-600 dark:text-sky-400 flex items-center space-x-2';
    tab2d.className = 'px-4 py-2 font-semibold text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-2';
    view1d.classList.remove('hidden');
    view2d.classList.add('hidden');
  } else {
    tab2d.className = 'px-4 py-2 font-bold text-sm border-b-2 border-teal-500 text-teal-600 dark:text-teal-400 flex items-center space-x-2';
    tab1d.className = 'px-4 py-2 font-semibold text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-2';
    view2d.classList.remove('hidden');
    view1d.classList.add('hidden');
  }
}

function load1DExampleFromGallery(presetKey) {
  closePresetsGallery();
  switchWorkspace('1d');
  loadPreset(presetKey);
  showNotification('โหลดตัวอย่างคานสำเร็จ', `โหลดแบบจำลองคาน 1D พร้อมคำนวณและแสดงผลเรียบร้อย`);
}

function load2DExampleFromGallery(presetKey) {
  closePresetsGallery();
  switchWorkspace('2d');
  load2DPreset(presetKey);
  showNotification('โหลดตัวอย่างโครงสร้าง 2D สำเร็จ', `โหลดแบบจำลอง ${frame2D.title} พร้อมวิเคราะห์ FEA เรียบร้อย`);
}

// Sync the Light/Dark toggle icon with the active theme on page load (moon = dark, sun = light)
try { applyThemeIcon(); } catch (e) {}
