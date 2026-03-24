// =========================================================================
// CORE TEAM — Coordinators first, then 1st-year members (by dept order)
// =========================================================================
//
// COORDINATOR PHOTOS — local files in: public/coordinators images/
// Use _coordImg('exact file name.jpg') — name must match the file on disk (see end of filename).
//
// FIRST-YEAR MEMBERS — use the same local folder + _coordImg(...) when a file exists; _PH if missing.

/** Pulls the file id from common Drive share / open URLs. */
function extractGoogleDriveFileId(url) {
    const s = String(url || '').trim();
    if (!s) return null;
    let m = s.match(/\/file\/d\/([^/]+)/i);
    if (m) return m[1];
    m = s.match(/[?&]id=([^&]+)/);
    return m ? m[1] : null;
}

/** Builds an <img>-friendly Drive URL; local /public paths are left unchanged. */
function driveToImgUrl(url) {
    const s = String(url || '');
    if (!s || s.includes('placehold.co')) return s;
    // Do not treat site asset paths as Drive links
    if (/^(?:\.\/)?public\//i.test(s) || s.startsWith('/public/')) return s;
    const id = extractGoogleDriveFileId(s);
    if (!id) return s;
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
}

const _PH = 'https://placehold.co/400x500/12051f/fcd34d/png?text=Photo+soon';

/** Document-relative URL (works with Live Server and file://); folder name has a space → %20. */
function _coordImg(fileName) {
    return 'public/coordinators%20images/' + encodeURIComponent(fileName);
}

// Row shape: [ name, uniqueKey, branchLine, imageUrl ]
const _coordinatorRows = [
    // --- Column 1 (3rd year) — filenames match `public/coordinators images/` ---
    ['Priyadarshan  L G', 'coord-001', '3rd year · CSE', _coordImg('Priyadarshan L G.png')],
    ['Hruthik K S', 'coord-002', '3rd year · CSE', _coordImg('hruthik  - Hruthik K S.jpg')],
    ['Chaithra C S', 'coord-004', '3rd year · CSE', _coordImg('IMG_20260321_220357 - Chaithra.jpg')],
    ['Srusti M', 'coord-003', '3rd year · CSE', _coordImg('srusti m.jpeg')],
    ['Varshitha D C', 'coord-005', '3rd year · AI&ML', _coordImg('Screenshot_20260322_081007_Gallery - Varshitha D.C.jpg')],
    ['Bharath Kumar C S', 'coord-006', '3rd year · AI&ML', _coordImg('IMG_6949 - Bharath Kumar CS.jpeg')],
    ['Manvitha M T', 'coord-007', '3rd year · AIML', _coordImg('20260320_093743_0000 - Manvitha MT.png')],
    ['Poorvith Gowda', 'coord-008', '3rd year · ECE', _coordImg('Snapchat-1675468579 - Poorvith Gowda.jpeg')],
    [' G B Shashanku Athreya', 'coord-009', '3rd year · ECE', _coordImg('IMG_4925 - Shashanku Athreya.jpeg')],
    ['Preethi Gowda', 'coord-010', '3rd year · ECE', _coordImg('Screenshot_20260321_214834_Photos - Preethi Gowda.jpg')],
    ['Amrutha K Raj', 'coord-011', '3rd year · AI&DS', _coordImg('IMG-20250704-WA0293 - Amrutha K Raj.jpg')],
    ['Meghana H', 'coord-012', '3rd year · AI&DS', _coordImg('IMG-20260322-WA0000 - Meghana H.jpeg')],
    ['Poorna', 'coord-013', '3rd year · Civil', _coordImg('Poorna.jpeg')],
    ['Krupa', 'coord-013a', '3rd year · Civil', _PH],

    // --- Column 2 (2nd year) ---
    ['Akash M', 'coord-014', '2nd year · CSE', _coordImg('IMG-20260315-WA0131 - Akash .m.jpg')],
    ['Harshitha B K', 'coord-015', '2nd year · CSE', _coordImg('9f257d37-6e63-4d84-9df2-86f9c4e0963d - Harshita.b.k.jpeg')],
    ['Mohammad Rayyan Ashfaq', 'coord-016', '2nd year · CSE', _coordImg('IMG-20250813-WA0136 - rayaan 07.jpg')],
    ['Kavana D S', 'coord-017', '2nd year · CSE', _coordImg('IMG_20260321_220343 - Kavana Gowda.jpeg')],
    ['Nikhil H N', 'coord-018', '2nd year · CSE', _PH],
    ['Greeshma', 'coord-019', '2nd year · CSE', _PH],
    ['Tejaswini K V', 'coord-020', '2nd year · CSE', _coordImg('1758003021998 - Tejaswini K V.jpg')],
    ['Sachin P Gowda', 'coord-021', '2nd year · CSE', _coordImg('InShot_20260203_142639391 - Sachin Prakash.jpg')],
    ['Jeevan Hallikar', 'coord-022', '2nd year · AI&ML', _coordImg('e43049c3-dea1-4ac9-b956-062fd98d09ff - Jeevan Hallikar.jpeg')],
    ['Preethi K Raj', 'coord-023', '2nd year · AI&ML', _coordImg('IMG-20251201-WA0041 - Preethi K Raj.jpg')],
    ['Keerthana  H M', 'coord-024', '2nd year · ECE', _coordImg('Screenshot_2026-03-21-21-39-42-91_99c04817c0de5652397fc8b56c3b3817 - Keerthana Manjunath.jpg')],
    ['Deekshith D S', 'coord-025', '2nd year · ECE', _coordImg('file_00000000e3e0720bb8ad2765141b8285 - Deekshith shaiva 07.png')],
    ['Rohith Gowda', 'coord-026', '2nd year · ECE', _PH],

    // --- Column 3 (2nd year) ---
    ['Yuvashree', 'coord-027', '2nd year · ECE', _PH],
    ['Harshini', 'coord-028', '2nd year · AI&DS', _PH],
    ['Vedanth Gowda K N', 'coord-029', '2nd year · AI&DS', _coordImg('IMG_0995 - Vedanth k.n Gowda.jpeg')],
    ['R Bhargav Nadig', 'coord-030', '2nd year · Civil', _coordImg('Screenshot_2026-03-21-22-07-27-46_99c04817c0de5652397fc8b56c3b3817 - Bhargav Nadig.jpg')],
    ['Shi Lakshmi  H V', 'coord-031', '2nd year · Civil', _coordImg('file_00000000e07872088ebad11331f57bb1~2 - Lakshmi Lakshmi.png')],
];

// 1st-year list: order CSE → AIML → ECE → AI&DS → Civil (ECE & Civil) — branch has no section
const _firstYearRows = [
    // --- CSE ---
    ['Charan B M', 'fy-001', '1st Year · CSE', _coordImg('IMG_20260321_214318 - Charan BM.jpg')],
    ['Apoorva L', 'fy-002', '1st Year · CSE', _PH],
    ['Nisarga D Saliyan', 'fy-003', '1st Year · CSE', _coordImg('1774150050703319476499648740791 - Nisarga dsaliyan.jpg')],
    ['Manu C R', 'fy-004', '1st Year · CSE', _coordImg('IMG-20251022-WA0081 - Manu Nayak.jpg')],
    ['Sanjay H S', 'fy-005', '1st Year · CSE', _PH],
    ['S Pooja Chandana', 'fy-006', '1st Year · CSE', _coordImg('IMG_20260322_110219 - Pooja Chandana.jpg')],
    ['Sampreeth', 'fy-007', '1st Year · CSE', _coordImg('Screenshot_2026_0322_101409 - Sampreeth H M.png')],
    ['Nithya HS', 'fy-008', '1st Year · CSE', _PH],
    ['Pavan Gowda K S', 'fy-009', '1st Year · CSE', _coordImg('IMG-20250513-WA0012 - Pavan Gowda KS.jpg')],

    // --- AIML (incl. CSE-AIML) ---
    ['Monika C M', 'fy-010', '1st Year · AIML', _coordImg('IMG-20250821-WA0001 - Monika CM.jpg')],
    ['Vinyas N', 'fy-011', '1st Year · AIML', _coordImg('IMG_20250916_230729 - Vinyas N shetty Vinyas.jpg')],
    ['Geethesh Shetty M', 'fy-012', '1st Year · CSE (AIML)', _coordImg('lv_0_20260322085810 - Geethesh.jpg')],
    ['Reshma D S', 'fy-013', '1st Year · CSE (AIML)', _coordImg('IMG_20260321_214330 - RESHMA. D.S..jpg')],

    // --- ECE ---
    ['Kishan S S', 'fy-014', '1st Year · ECE', _coordImg('IMG_20260321_215314 - KISHAN SS.jpg')],
    ['Chandana Gowda', 'fy-015', '1st Year · ECE', _coordImg('IMG_20260322_095200 - Chandana Gowda.jpg')],

    // --- AI&DS ---
    ['Monisha', 'fy-016', '1st Year · AI&DS', _coordImg('IMG_20260321_215217 - Monisha.jpg')],
    ['Abhishek B D', 'fy-017', '1st Year · AI&DS', _coordImg('Screenshot_20251028_074244 - Abhishek BD.jpg')],

    // --- Civil (sheet: ECE & Civil) ---
    ['Pooja', 'fy-018', '1st Year · ECE & Civil', _coordImg('IMG_20240510_082422 - Pooja.jpg')],
    ['Sanjay H S', 'fy-019', '1st Year · ECE & Civil', _coordImg('Sanjay H S.JPG')],
];

const _seen = new Set();
const massiveTeamList = [];

/** Maps branch subtitle to a year tier for UI styling (3 / 2 / 1). */
function yearBandFromBranch(branchLine) {
    const b = String(branchLine);
    if (/3rd\s*year/i.test(b)) return '3';
    if (/2nd\s*year/i.test(b)) return '2';
    if (/1st\s*year/i.test(b)) return '1';
    return '1';
}

function ingestRows(rows, role) {
    rows.forEach((row) => {
        const [name, key, branchLine, imgSrc] = row;
        if (_seen.has(key)) return;
        _seen.add(key);

        massiveTeamList.push({
            id: `team-${String(massiveTeamList.length + 1).padStart(3, '0')}`,
            name,
            role,
            branch: branchLine,
            photo: driveToImgUrl(imgSrc),
            yearBand: yearBandFromBranch(branchLine),
        });
    });
}

ingestRows(_coordinatorRows, 'Student coordinator');
ingestRows(_firstYearRows, 'Member');
