/* ============================================================
   نُخبة — Nukhba · محطّة الفرز الفوري
   فرز الصور بالكامل داخل المتصفح: كشف الحدّة (Laplacian)،
   تجميع اللقطات المتسلسلة (بصمة إدراكية)، فرز بالكيبورد، تصدير.
   لا خوادم · لا رفع · يعمل دون إنترنت.
   ============================================================ */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const el = {
  landing: $('#landing'), app: $('#app'),
  filesInput: $('#filesInput'), folderInput: $('#folderInput'),
  addInput: $('#addInput'), demoBtn: $('#demoBtn'),
  stats: $('#stats'), filters: $('#filters'),
  stage: $('#stage'), mainImg: $('#mainImg'), badgeOverlay: $('#badgeOverlay'),
  sharpFill: $('#sharpFill'), sharpVal: $('#sharpVal'),
  filmstrip: $('#filmstrip'), stars: $('#stars'),
  btnPick: $('#btnPick'), btnReject: $('#btnReject'), btnZoom: $('#btnZoom'),
  navPrev: $('#navPrev'), navNext: $('#navNext'),
  exportBtn: $('#exportBtn'), helpBtn: $('#helpBtn'),
  helpModal: $('#helpModal'), closeHelp: $('#closeHelp'),
  toast: $('#toast'),
};

let items = [];          // { id, file, name, url, rating, flag, sharp, hash, group, thumbEl }
let active = 0;          // فهرس الصورة المعروضة
let filter = 'all';
let analyzeQueue = [];   // عناصر بانتظار التحليل
let analyzing = false;

/* ---------------------- أدوات مساعدة ---------------------- */
function toast(msg, ms = 1800) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.toast.classList.remove('show'), ms);
}

/* ---------------------- استقبال الملفات ---------------------- */
function addFiles(fileList) {
  const incoming = [...fileList].filter((f) => f.type.startsWith('image/'));
  if (!incoming.length) { toast('لم يتم العثور على صور صالحة'); return; }
  incoming.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const file of incoming) {
    const item = {
      id: 'i' + Math.random().toString(36).slice(2),
      file, name: file.name, url: URL.createObjectURL(file),
      rating: 0, flag: null, sharp: null, hash: null, group: null, thumbEl: null,
    };
    items.push(item);
    analyzeQueue.push(item);
  }
  if (el.app.classList.contains('hidden')) startApp();
  buildFilmstrip();
  runAnalysisQueue();
  updateStats();
}

function startApp() {
  el.landing.classList.add('hidden');
  el.app.classList.remove('hidden');
  active = 0;
  showActive();
}

/* ---------------------- التحليل المحلي ---------------------- */
// لوحة صغيرة مشتركة للتحليل
const aCanvas = document.createElement('canvas');
const aCtx = aCanvas.getContext('2d', { willReadFrequently: true });

function analyzeItem(item) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // حجم تحليل صغير لسرعة عالية
      const S = 256;
      const ratio = img.naturalHeight / img.naturalWidth;
      const w = S, h = Math.max(1, Math.round(S * ratio));
      aCanvas.width = w; aCanvas.height = h;
      aCtx.drawImage(img, 0, 0, w, h);
      const data = aCtx.getImageData(0, 0, w, h).data;

      item.sharp = computeSharpness(data, w, h);
      item.hash = computeAHash(img); // بصمة إدراكية 8×8
      resolve();
    };
    img.onerror = () => { item.sharp = 0; item.hash = 0n; resolve(); };
    img.src = item.url;
  });
}

// حدّة الصورة عبر تباين Laplacian — كلما زاد التباين زادت الحدّة
function computeSharpness(data, w, h) {
  const g = new Float32Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    g[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  let mean = 0, n = 0;
  const lap = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      const v = -4 * g[p] + g[p - 1] + g[p + 1] + g[p - w] + g[p + w];
      lap.push(v); mean += v; n++;
    }
  }
  mean /= n;
  let varr = 0;
  for (const v of lap) varr += (v - mean) * (v - mean);
  varr /= n;
  // تحويل التباين إلى 0..100 بمقياس لوغاريتمي معقول
  const score = Math.round(Math.min(100, Math.max(0, (Math.log10(varr + 1) / Math.log10(2500)) * 100)));
  return score;
}

// بصمة المتوسط (aHash): 8×8 رمادي → 64 بت
function computeAHash(img) {
  aCanvas.width = 8; aCanvas.height = 8;
  aCtx.drawImage(img, 0, 0, 8, 8);
  const d = aCtx.getImageData(0, 0, 8, 8).data;
  const gray = [];
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) {
    const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    gray.push(v); sum += v;
  }
  const avg = sum / 64;
  let bits = 0n;
  for (let i = 0; i < 64; i++) bits = (bits << 1n) | (gray[i] >= avg ? 1n : 0n);
  return bits;
}

function hamming(a, b) {
  let x = a ^ b, c = 0;
  while (x) { c += Number(x & 1n); x >>= 1n; }
  return c;
}

// معالجة الطابور بالتتابع حتى لا نُجهد المتصفح
async function runAnalysisQueue() {
  if (analyzing) return;
  analyzing = true;
  while (analyzeQueue.length) {
    const item = analyzeQueue.shift();
    item.thumbEl?.classList.add('busy');
    await analyzeItem(item);
    item.thumbEl?.classList.remove('busy');
    refreshThumb(item);
    if (items[active] === item) showActive();
  }
  analyzing = false;
  groupBursts();
  buildFilmstrip();
  updateStats();
  toast('اكتمل التحليل: تم كشف الحدّة وتجميع اللقطات ✓');
}

// تجميع اللقطات المتسلسلة المتشابهة عبر تقارب البصمة
function groupBursts() {
  const THRESH = 8; // مسافة هامِنغ القصوى لاعتبار صورتين متشابهتين
  let gid = 0;
  for (const it of items) it.group = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].group !== null || items[i].hash == null) continue;
    const members = [items[i]];
    for (let j = i + 1; j < items.length; j++) {
      if (items[j].group !== null || items[j].hash == null) continue;
      if (hamming(items[i].hash, items[j].hash) <= THRESH) members.push(items[j]);
    }
    if (members.length > 1) {
      gid++;
      members.forEach((m) => (m.group = gid));
    }
  }
}

/* ---------------------- العرض ---------------------- */
function showActive() {
  const it = items[active];
  if (!it) return;
  el.mainImg.src = it.url;
  el.mainImg.classList.remove('zoomed');

  // مؤشّر الحدّة
  if (it.sharp == null) {
    el.sharpFill.style.width = '0%'; el.sharpVal.textContent = '…';
  } else {
    el.sharpFill.style.width = it.sharp + '%';
    el.sharpVal.textContent = it.sharp;
  }

  // شارات الحالة
  el.badgeOverlay.innerHTML = '';
  const add = (cls, txt) => {
    const s = document.createElement('span'); s.className = 'ov-badge ' + cls; s.textContent = txt;
    el.badgeOverlay.appendChild(s);
  };
  if (it.flag === 'pick') add('ov-pick', '✓ مقبولة');
  if (it.flag === 'reject') add('ov-reject', '✕ مرفوضة');
  if (it.rating) add('ov-star', '★'.repeat(it.rating));
  if (it.sharp != null && it.sharp < 35) add('ov-soft', '⚠︎ قد تكون غير واضحة');
  if (it.group) {
    const g = items.filter((x) => x.group === it.group);
    const best = g.reduce((a, b) => (b.sharp > a.sharp ? b : a), g[0]);
    add('ov-group', `🔗 لقطة ${g.indexOf(it) + 1}/${g.length}` + (best === it ? ' · الأوضح' : ''));
  }

  // النجوم
  $$('#stars button').forEach((b) => b.classList.toggle('lit', +b.dataset.star <= it.rating));
  el.btnPick.classList.toggle('on', it.flag === 'pick');
  el.btnReject.classList.toggle('on', it.flag === 'reject');

  // إبراز المصغّرة النشطة
  $$('.thumb').forEach((t) => t.classList.toggle('active', t.dataset.id === it.id));
  it.thumbEl?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
}

function buildFilmstrip() {
  el.filmstrip.innerHTML = '';
  const list = visibleItems();
  let lastGroup = null;
  for (const it of list) {
    const t = document.createElement('div');
    t.className = 'thumb';
    t.dataset.id = it.id;
    if (it.group && it.group !== lastGroup) t.classList.add('group-start');
    lastGroup = it.group;
    t.innerHTML = `<img src="${it.url}" loading="lazy" alt="">`;
    it.thumbEl = t;
    t.addEventListener('click', () => { active = items.indexOf(it); showActive(); });
    el.filmstrip.appendChild(t);
    refreshThumb(it);
  }
  // حافظ على إبراز النشط
  showActive();
}

function refreshThumb(it) {
  const t = it.thumbEl; if (!t) return;
  t.classList.toggle('is-reject', it.flag === 'reject');
  // أزل الشارات القديمة (عدا الصورة)
  [...t.querySelectorAll('.tb,.gsep')].forEach((n) => n.remove());
  const mk = (cls, txt) => { const s = document.createElement('span'); s.className = 'tb ' + cls; s.textContent = txt; t.appendChild(s); };
  if (it.flag === 'pick') mk('pick', '✓');
  if (it.flag === 'reject') mk('reject', '✕');
  if (it.rating) mk('stars', '★' + it.rating);
  if (it.sharp != null && it.sharp < 35) mk('soft', '⚠︎');
  if (it.group) {
    const g = items.filter((x) => x.group === it.group);
    const s = document.createElement('span'); s.className = 'gsep';
    s.textContent = '🔗' + g.length; t.appendChild(s);
  }
}

/* ---------------------- الفلترة ---------------------- */
function visibleItems() {
  switch (filter) {
    case 'unrated': return items.filter((i) => !i.flag && !i.rating);
    case 'pick': return items.filter((i) => i.flag === 'pick');
    case 'reject': return items.filter((i) => i.flag === 'reject');
    case 'stars': return items.filter((i) => i.rating >= 3);
    case 'soft': return items.filter((i) => i.sharp != null && i.sharp < 35);
    default: return items;
  }
}

/* ---------------------- الإجراءات ---------------------- */
function setFlag(flag) {
  const it = items[active]; if (!it) return;
  it.flag = it.flag === flag ? null : flag;
  refreshThumb(it); showActive(); updateStats();
  if (it.flag) nextImage();
}
function setRating(n) {
  const it = items[active]; if (!it) return;
  it.rating = it.rating === n ? 0 : n;
  refreshThumb(it); showActive(); updateStats();
}
function nextImage() {
  const list = visibleItems();
  if (!list.length) return;
  let idx = list.indexOf(items[active]);
  idx = Math.min(idx + 1, list.length - 1);
  active = items.indexOf(list[idx]); showActive();
}
function prevImage() {
  const list = visibleItems();
  if (!list.length) return;
  let idx = list.indexOf(items[active]);
  idx = Math.max(idx - 1, 0);
  active = items.indexOf(list[idx]); showActive();
}
function jumpToBestInGroup() {
  const it = items[active]; if (!it || !it.group) { toast('هذه الصورة ليست ضمن مجموعة لقطات'); return; }
  const g = items.filter((x) => x.group === it.group);
  const best = g.reduce((a, b) => (b.sharp > a.sharp ? b : a), g[0]);
  active = items.indexOf(best); showActive();
  toast('انتقلت إلى الأوضح في المجموعة');
}
function toggleZoom() {
  el.mainImg.classList.toggle('zoomed');
}

function updateStats() {
  const picks = items.filter((i) => i.flag === 'pick').length;
  const rej = items.filter((i) => i.flag === 'reject').length;
  const soft = items.filter((i) => i.sharp != null && i.sharp < 35).length;
  const groups = new Set(items.filter((i) => i.group).map((i) => i.group)).size;
  el.stats.innerHTML =
    `<span>الإجمالي <b>${items.length}</b></span>` +
    `<span class="pick-c">مقبولة <b>${picks}</b></span>` +
    `<span class="rej-c">مرفوضة <b>${rej}</b></span>` +
    `<span>غير واضحة <b>${soft}</b></span>` +
    `<span>مجموعات <b>${groups}</b></span>`;
}

/* ---------------------- التصدير ---------------------- */
function exportPicks() {
  const picks = items.filter((i) => i.flag === 'pick' || i.rating >= 3);
  if (!picks.length) { toast('لا توجد صور مختارة بعد (قبول أو ★3+)'); return; }
  const lines = [
    '# قائمة المختارات — نُخبة (Nukhba)',
    `# التاريخ: ${new Date().toLocaleString('ar')}`,
    `# العدد: ${picks.length} من ${items.length}`,
    '# الصق هذه الأسماء في فلتر النص بـ Lightroom / Capture One',
    '',
    ...picks.map((p) => p.name),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'nukhba-selects.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`تم تصدير ${picks.length} صورة مختارة 🎉`);
}

/* ---------------------- صور تجريبية مولّدة ---------------------- */
function makeDemo() {
  const palette = [['#2b1055', '#ff7e5f'], ['#0f2027', '#7ee8fa'], ['#3a1c71', '#feb47b'], ['#134e5e', '#71b280'], ['#42275a', '#734b6d']];
  const files = [];
  let made = 0;
  // ننشئ 5 "مشاهد"، كل مشهد دفعة من 3 لقطات متقاربة (مع اختلاف حدّة)
  for (let scene = 0; scene < 5; scene++) {
    for (let shot = 0; shot < 3; shot++) {
      const c = document.createElement('canvas'); c.width = 800; c.height = 600;
      const g = c.getContext('2d');
      const [a, b] = palette[scene];
      const grad = g.createLinearGradient(0, 0, 800, 600);
      grad.addColorStop(0, a); grad.addColorStop(1, b);
      g.fillStyle = grad; g.fillRect(0, 0, 800, 600);
      // موضوع: دائرة عند نقطة قوة، تتزحزح قليلاً بين اللقطات (يحاكي اللقطة المتسلسلة)
      const x = 800 * (2 / 3) + shot * 6, y = 600 * (1 / 3) + shot * 4;
      g.fillStyle = 'rgba(255,255,255,.92)';
      g.beginPath(); g.arc(x, y, 70, 0, 7); g.fill();
      g.fillStyle = a;
      g.font = 'bold 40px sans-serif'; g.textAlign = 'center';
      g.fillText('Scene ' + (scene + 1), 400, 540);
      // محاكاة عدم الوضوح في اللقطة الوسطى لكل مشهد
      let canvas = c;
      if (shot === 1) {
        const blurC = document.createElement('canvas'); blurC.width = 800; blurC.height = 600;
        const bg = blurC.getContext('2d');
        bg.filter = 'blur(6px)'; bg.drawImage(c, 0, 0); canvas = blurC;
      }
      canvas.toBlob((blob) => {
        const f = new File([blob], `scene${scene + 1}_shot${shot + 1}.jpg`, { type: 'image/jpeg' });
        files.push(f); made++;
        if (made === 15) addFiles(files);
      }, 'image/jpeg', 0.9);
    }
  }
}

/* ---------------------- ربط الأحداث ---------------------- */
el.filesInput.addEventListener('change', (e) => addFiles(e.target.files));
el.folderInput.addEventListener('change', (e) => addFiles(e.target.files));
el.addInput.addEventListener('change', (e) => addFiles(e.target.files));
el.demoBtn.addEventListener('click', makeDemo);

el.btnPick.addEventListener('click', () => setFlag('pick'));
el.btnReject.addEventListener('click', () => setFlag('reject'));
el.btnZoom.addEventListener('click', toggleZoom);
el.mainImg.addEventListener('click', toggleZoom);
el.navNext.addEventListener('click', nextImage);
el.navPrev.addEventListener('click', prevImage);
el.exportBtn.addEventListener('click', exportPicks);

$$('#stars button').forEach((b) => b.addEventListener('click', () => setRating(+b.dataset.star)));

el.filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.fchip'); if (!btn) return;
  filter = btn.dataset.filter;
  $$('.fchip').forEach((c) => c.classList.toggle('active', c === btn));
  buildFilmstrip();
  // اضبط النشط على أول عنصر مرئي إن خرج عن الفلتر
  const list = visibleItems();
  if (list.length && !list.includes(items[active])) { active = items.indexOf(list[0]); showActive(); }
});

el.helpBtn.addEventListener('click', () => el.helpModal.classList.remove('hidden'));
el.closeHelp.addEventListener('click', () => el.helpModal.classList.add('hidden'));
el.helpModal.addEventListener('click', (e) => { if (e.target === el.helpModal) el.helpModal.classList.add('hidden'); });

// لوحة المفاتيح
document.addEventListener('keydown', (e) => {
  if (el.app.classList.contains('hidden')) return;
  if (e.target.tagName === 'INPUT') return;
  switch (e.key) {
    case 'ArrowRight': prevImage(); break;   // RTL: اليمين = السابق بصرياً
    case 'ArrowLeft': nextImage(); break;
    case 'p': case 'P': setFlag('pick'); break;
    case 'x': case 'X': setFlag('reject'); break;
    case 'z': case 'Z': case ' ': e.preventDefault(); toggleZoom(); break;
    case 'g': case 'G': jumpToBestInGroup(); break;
    case '0': setRating(0); break;
    default:
      if (e.key >= '1' && e.key <= '5') setRating(+e.key);
  }
});

// السحب والإفلات على كامل النافذة
['dragover', 'drop'].forEach((ev) => window.addEventListener(ev, (e) => e.preventDefault()));
window.addEventListener('drop', (e) => { if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); });
