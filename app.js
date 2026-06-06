/* ============================================================
   طيف — TAYF · مختبر الضوء واللون
   تحليل بصري كامل داخل المتصفح عبر Canvas. لا خوادم، لا رفع.
   ============================================================ */

const $ = (s) => document.querySelector(s);

const els = {
  dropzone: $('#dropzone'),
  studio: $('#studio'),
  view: $('#view'),
  hist: $('#hist'),
  fileInput: $('#fileInput'),
  fileInput2: $('#fileInput2'),
  sampleBtn: $('#sampleBtn'),
  scoreVal: $('#scoreVal'),
  scoreLabel: $('#scoreLabel'),
  ringFg: $('#ringFg'),
  tips: $('#tips'),
  moodBadge: $('#moodBadge'),
  barWarm: $('#barWarm'),
  barSat: $('#barSat'),
  barContrast: $('#barContrast'),
  palette: $('#palette'),
  exposureNote: $('#exposureNote'),
  downloadCard: $('#downloadCard'),
  toast: $('#toast'),
};

const ctx = els.view.getContext('2d', { willReadFrequently: true });
const histCtx = els.hist.getContext('2d');

// الحالة الحالية للتحليل
let state = {
  img: null,
  analysis: null,
  overlays: { thirds: true, golden: false, diagonals: false, weight: true },
};

/* ---------------------- أدوات مساعدة ---------------------- */
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

/* ---------------------- تحميل الصورة ---------------------- */
function loadImage(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    state.img = img;
    els.dropzone.classList.add('hidden');
    els.studio.classList.remove('hidden');
    analyze();
    els.studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  img.onerror = () => toast('تعذّر تحميل الصورة');
  img.src = src;
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) { toast('اختر ملف صورة صالحاً'); return; }
  const reader = new FileReader();
  reader.onload = (e) => loadImage(e.target.result);
  reader.readAsDataURL(file);
}

/* ---------------------- محرّك التحليل ---------------------- */
function analyze() {
  const img = state.img;
  // أبعاد العرض على الشاشة
  const maxW = 900;
  const scale = Math.min(1, maxW / img.naturalWidth);
  const W = Math.round(img.naturalWidth * scale);
  const H = Math.round(img.naturalHeight * scale);
  els.view.width = W;
  els.view.height = H;

  // ارسم على لوحة تحليل صغيرة لأداء أسرع
  const aW = 220;
  const aH = Math.max(1, Math.round((aW * H) / W));
  const aCanvas = document.createElement('canvas');
  aCanvas.width = aW; aCanvas.height = aH;
  const aCtx = aCanvas.getContext('2d', { willReadFrequently: true });
  aCtx.drawImage(img, 0, 0, aW, aH);
  const data = aCtx.getImageData(0, 0, aW, aH).data;

  const analysis = {
    W, H,
    palette: extractPalette(data, aW, aH),
    mood: computeMood(data),
    histogram: computeHistogram(data),
    weight: computeVisualWeight(data, aW, aH),
  };
  analysis.composition = scoreComposition(analysis.weight, analysis.mood, analysis.histogram);
  state.analysis = analysis;

  render();
  renderResults(analysis);
}

/* استخراج لوحة الألوان: تكميم لوني (k-means مبسّط) */
function extractPalette(data, w, h) {
  const samples = [];
  const step = 4 * 3; // كل 3 بكسلات
  for (let i = 0; i < data.length; i += step) {
    if (data[i + 3] < 125) continue; // تجاهل الشفاف
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }
  const K = 6;
  // تهيئة المراكز عشوائياً من العينات
  let centers = [];
  for (let k = 0; k < K; k++) centers.push(samples[Math.floor(Math.random() * samples.length)].slice());

  for (let iter = 0; iter < 8; iter++) {
    const sums = Array.from({ length: K }, () => [0, 0, 0, 0]);
    for (const s of samples) {
      let best = 0, bd = Infinity;
      for (let k = 0; k < K; k++) {
        const c = centers[k];
        const d = (s[0]-c[0])**2 + (s[1]-c[1])**2 + (s[2]-c[2])**2;
        if (d < bd) { bd = d; best = k; }
      }
      sums[best][0] += s[0]; sums[best][1] += s[1]; sums[best][2] += s[2]; sums[best][3]++;
    }
    for (let k = 0; k < K; k++) {
      if (sums[k][3] > 0) {
        centers[k] = [sums[k][0]/sums[k][3], sums[k][1]/sums[k][3], sums[k][2]/sums[k][3], sums[k][3]];
      } else {
        centers[k] = samples[Math.floor(Math.random()*samples.length)].concat(0);
      }
    }
  }
  // رتّب حسب الحجم (الأكثر شيوعاً أولاً)
  centers.sort((a, b) => (b[3]||0) - (a[3]||0));
  return centers.map((c) => ({
    hex: rgbToHex(c[0], c[1], c[2]),
    rgb: [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])],
    weight: c[3] || 0,
  }));
}

/* حساب المزاج: الدفء، التشبّع، التباين */
function computeMood(data) {
  let r = 0, g = 0, b = 0, n = 0;
  let satSum = 0, lumSum = 0, lumSq = 0;
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 125) continue;
    const R = data[i], G = data[i + 1], B = data[i + 2];
    r += R; g += G; b += B; n++;
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
    satSum += mx === 0 ? 0 : (mx - mn) / mx;
    const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    lumSum += lum; lumSq += lum * lum;
  }
  r /= n; g /= n; b /= n;
  const sat = satSum / n;
  const meanLum = lumSum / n;
  const variance = lumSq / n - meanLum * meanLum;
  const contrast = Math.sqrt(Math.max(0, variance)) / 128; // 0..~1
  // الدفء: ميل نحو الأحمر مقابل الأزرق
  const warmth = clamp(0.5 + (r - b) / 255, 0, 1);

  let label;
  if (warmth > 0.58 && sat > 0.35) label = '☀️ دافئ ونابض';
  else if (warmth > 0.55) label = '🔥 دافئ وهادئ';
  else if (warmth < 0.43 && contrast > 0.45) label = '🌊 بارد درامي';
  else if (warmth < 0.45) label = '❄️ بارد وحالم';
  else if (contrast > 0.5) label = '🎬 سينمائي متباين';
  else if (sat < 0.2) label = '🕊️ هادئ مونوكروم';
  else label = '🎨 متوازن';

  return { warmth, sat: clamp(sat, 0, 1), contrast: clamp(contrast, 0, 1), label, meanLum };
}

/* الهيستوجرام (السطوع) */
function computeHistogram(data) {
  const bins = new Array(64).fill(0);
  for (let i = 0; i < data.length; i += 8) {
    if (data[i + 3] < 125) continue;
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    bins[Math.min(63, Math.floor(lum / 4))]++;
  }
  const max = Math.max(...bins, 1);
  // نسبة الظلال والإضاءات العالية
  const total = bins.reduce((a, b) => a + b, 0) || 1;
  const shadows = bins.slice(0, 10).reduce((a, b) => a + b, 0) / total;
  const highlights = bins.slice(54).reduce((a, b) => a + b, 0) / total;
  return { bins, max, shadows, highlights };
}

/* خريطة الثقل البصري: سطوع × كثافة الحواف، ثم مركز الكتلة */
function computeVisualWeight(data, w, h) {
  const lum = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      lum[y * w + x] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }
  }
  let sumX = 0, sumY = 0, sumW = 0;
  // حقل الأهمية = حافة (Sobel مبسّط) + انحراف السطوع عن المتوسط
  let meanL = 0;
  for (let i = 0; i < lum.length; i++) meanL += lum[i];
  meanL /= lum.length;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = lum[y*w + x+1] - lum[y*w + x-1];
      const gy = lum[(y+1)*w + x] - lum[(y-1)*w + x];
      const edge = Math.sqrt(gx*gx + gy*gy);
      const dev = Math.abs(lum[y*w+x] - meanL);
      const wgt = edge * 1.4 + dev * 0.6;
      sumX += x * wgt; sumY += y * wgt; sumW += wgt;
    }
  }
  const cx = sumW ? sumX / sumW / w : 0.5;
  const cy = sumW ? sumY / sumW / h : 0.5;
  return { cx, cy };
}

/* تقييم التكوين: قرب مركز الثقل من نقاط القوة + توازن التعريض */
function scoreComposition(weight, mood, hist) {
  const thirds = [
    [1/3, 1/3], [2/3, 1/3], [1/3, 2/3], [2/3, 2/3],
  ];
  let minD = Infinity;
  for (const [tx, ty] of thirds) {
    const d = Math.hypot(weight.cx - tx, weight.cy - ty);
    if (d < minD) minD = d;
  }
  // المسافة القصوى المعقولة ~0.4؛ كلما اقترب زادت الدرجة
  const thirdsScore = clamp(1 - minD / 0.42, 0, 1);

  // عقوبة التموسط المفرط (إلا إن كان متوازناً تماماً وهو أسلوب أيضاً)
  const centerD = Math.hypot(weight.cx - 0.5, weight.cy - 0.5);
  const centerBonus = centerD < 0.06 ? 0.15 : 0; // تكوين متماثل مقصود

  // توازن التعريض: نعاقب القص الشديد في الظلال/الإضاءات
  const clip = hist.shadows > 0.35 ? (hist.shadows - 0.35) : 0;
  const clipH = hist.highlights > 0.3 ? (hist.highlights - 0.3) : 0;
  const exposureScore = clamp(1 - (clip + clipH) * 1.6, 0.2, 1);

  // مكافأة التباين الجيد (ليس مسطحاً ولا مفرطاً)
  const contrastScore = 1 - Math.abs(mood.contrast - 0.5) * 1.2;

  const raw = thirdsScore * 0.5 + exposureScore * 0.28 + clamp(contrastScore,0,1) * 0.22 + centerBonus;
  const score = Math.round(clamp(raw, 0, 1) * 100);

  // النصائح
  const tips = [];
  if (thirdsScore < 0.55 && centerD > 0.1) {
    tips.push('حرّك الموضوع نحو إحدى نقاط القوة (تقاطعات الأثلاث) لتكوين أكثر جذباً.');
  } else {
    tips.push('مركز الثقل قريب من نقطة قوة — تكوين متوازن وجذّاب.');
  }
  if (hist.shadows > 0.4) tips.push('الظلال مقصوصة قليلاً — ارفع التعريض أو افتح الظلال لاستعادة التفاصيل.');
  if (hist.highlights > 0.32) tips.push('إضاءات عالية محروقة — قلّل التعريض أو استرجع الإبرازات.');
  if (mood.contrast < 0.28) tips.push('الصورة مسطّحة قليلاً — زيادة التباين تمنحها عمقاً.');
  if (mood.contrast > 0.72) tips.push('التباين عالٍ جداً — قد تفقد تفاصيل في الأطراف.');
  if (mood.sat < 0.15) tips.push('ألوان باهتة — لمسة تشبّع قد تحييها (أو أبقها مونوكروم بقصد فني).');
  if (tips.length < 2) tips.push('تعريض وتباين متوازنان — أساس قوي للمعالجة.');

  let label;
  if (score >= 85) label = 'تكوين استثنائي 🏆';
  else if (score >= 70) label = 'تكوين قوي 👌';
  else if (score >= 55) label = 'تكوين جيد — قابل للتحسين';
  else label = 'فرصة للتطوير 💪';

  return { score, label, tips: tips.slice(0, 4), thirdsScore };
}

/* ---------------------- الرسم ---------------------- */
function render() {
  const { W, H } = state.analysis;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(state.img, 0, 0, W, H);
  drawOverlays(ctx, W, H);
}

function drawOverlays(c, W, H) {
  const o = state.overlays;
  c.save();
  c.lineWidth = Math.max(1, W / 600);

  if (o.thirds) {
    c.strokeStyle = 'rgba(255,255,255,.45)';
    for (let i = 1; i < 3; i++) {
      c.beginPath(); c.moveTo((W*i)/3, 0); c.lineTo((W*i)/3, H); c.stroke();
      c.beginPath(); c.moveTo(0, (H*i)/3); c.lineTo(W, (H*i)/3); c.stroke();
    }
    // نقاط القوة
    c.fillStyle = 'rgba(254,180,123,.9)';
    for (const px of [1/3, 2/3]) for (const py of [1/3, 2/3]) {
      c.beginPath(); c.arc(W*px, H*py, Math.max(3, W/180), 0, 7); c.fill();
    }
  }

  if (o.diagonals) {
    c.strokeStyle = 'rgba(126,232,250,.45)';
    c.beginPath(); c.moveTo(0,0); c.lineTo(W,H); c.stroke();
    c.beginPath(); c.moveTo(W,0); c.lineTo(0,H); c.stroke();
  }

  if (o.golden) {
    drawGoldenSpiral(c, W, H);
  }

  if (o.weight && state.analysis.weight) {
    const { cx, cy } = state.analysis.weight;
    const x = cx * W, y = cy * H;
    const r = Math.max(10, W / 28);
    c.strokeStyle = '#ff7e5f';
    c.fillStyle = 'rgba(255,126,95,.18)';
    c.lineWidth = Math.max(2, W/350);
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x-r*1.4, y); c.lineTo(x+r*1.4, y); c.moveTo(x, y-r*1.4); c.lineTo(x, y+r*1.4); c.stroke();
  }
  c.restore();
}

function drawGoldenSpiral(c, W, H) {
  c.strokeStyle = 'rgba(255,209,102,.55)';
  c.lineWidth = Math.max(1.2, W/500);
  // حلزون فيبوناتشي تقريبي عبر أرباع دائرة متناقصة
  let x = 0, y = 0, w = W, h = H;
  // اتجاه افتراضي
  const steps = 8;
  c.beginPath();
  let cx, cy, r, start;
  for (let i = 0; i < steps; i++) {
    const phi = 0.618;
    if (i % 4 === 0) { r = w * phi; cx = x + w - r; cy = y; start = Math.PI; c.arc(cx, cy + r, r, Math.PI, Math.PI*1.5); x = x + w - r; w = r; }
    else if (i % 4 === 1) { r = h * phi; cx = x; cy = y + h - r; c.arc(cx, cy + r, r, Math.PI*1.5, Math.PI*2); y = y + h - r; h = r; }
    else if (i % 4 === 2) { r = w * phi; c.arc(x + r, y, r, 0, Math.PI*0.5); w = r; }
    else { r = h * phi; c.arc(x, y + r, r, Math.PI*0.5, Math.PI); h = r; }
  }
  c.stroke();
}

/* ---------------------- عرض النتائج ---------------------- */
function renderResults(a) {
  // الدرجة + الحلقة
  const C = 2 * Math.PI * 52;
  els.ringFg.style.strokeDasharray = C;
  els.scoreVal.textContent = a.composition.score;
  els.scoreLabel.textContent = a.composition.label;
  requestAnimationFrame(() => {
    els.ringFg.style.strokeDashoffset = C * (1 - a.composition.score / 100);
    const hue = 10 + (a.composition.score / 100) * 120; // أحمر→أخضر
    els.ringFg.style.stroke = `hsl(${hue} 80% 62%)`;
  });

  els.tips.innerHTML = '';
  a.composition.tips.forEach((t) => {
    const li = document.createElement('li'); li.textContent = t; els.tips.appendChild(li);
  });

  // المزاج
  els.moodBadge.textContent = a.mood.label;
  els.barWarm.style.width = (a.mood.warmth * 100) + '%';
  els.barSat.style.width = (a.mood.sat * 100) + '%';
  els.barContrast.style.width = (a.mood.contrast * 100) + '%';

  // الألوان
  els.palette.innerHTML = '';
  a.palette.forEach((col) => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = col.hex;
    sw.innerHTML = `<span>${col.hex}</span>`;
    sw.title = 'انقر لنسخ ' + col.hex;
    sw.addEventListener('click', () => {
      navigator.clipboard?.writeText(col.hex).then(() => toast('نُسخ ' + col.hex)).catch(() => toast(col.hex));
    });
    els.palette.appendChild(sw);
  });

  // الهيستوجرام
  drawHistogram(a.histogram);
  let note = 'توزيع إضاءة متوازن.';
  if (a.histogram.shadows > 0.4) note = 'تركّز في الظلال — صورة منخفضة المفتاح (low-key).';
  else if (a.histogram.highlights > 0.32) note = 'تركّز في الإضاءات — صورة عالية المفتاح (high-key).';
  else if (a.mood.contrast < 0.28) note = 'مدى ضيّق — قد تستفيد من توسيع التباين.';
  els.exposureNote.textContent = note;
}

function drawHistogram(hist) {
  const w = els.hist.width = els.hist.clientWidth * devicePixelRatio;
  const h = els.hist.height = 90 * devicePixelRatio;
  histCtx.clearRect(0, 0, w, h);
  const bw = w / hist.bins.length;
  const grad = histCtx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#1c2030');
  grad.addColorStop(0.5, '#7ee8fa');
  grad.addColorStop(1, '#feb47b');
  histCtx.fillStyle = grad;
  hist.bins.forEach((v, i) => {
    const bh = (v / hist.max) * (h - 4);
    histCtx.fillRect(i * bw, h - bh, bw - 1, bh);
  });
}

/* ---------------------- بطاقة التحليل القابلة للتنزيل ---------------------- */
function downloadCard() {
  if (!state.analysis) return;
  const a = state.analysis;
  const cw = 1080, ch = 1350;
  const cv = document.createElement('canvas');
  cv.width = cw; cv.height = ch;
  const g = cv.getContext('2d');

  // خلفية
  g.fillStyle = '#0a0b10'; g.fillRect(0, 0, cw, ch);
  const bg = g.createLinearGradient(0, 0, cw, ch);
  bg.addColorStop(0, '#161a2b'); bg.addColorStop(1, '#0a0b10');
  g.fillStyle = bg; g.fillRect(0, 0, cw, ch);

  // الصورة
  const pad = 70, imgW = cw - pad * 2;
  const ratio = state.img.naturalHeight / state.img.naturalWidth;
  const imgH = Math.min(imgW * ratio, 620);
  const drawW = imgH / ratio;
  const ix = (cw - drawW) / 2;
  g.save();
  roundRect(g, ix, pad + 90, drawW, imgH, 24); g.clip();
  g.drawImage(state.img, ix, pad + 90, drawW, imgH);
  g.restore();

  // العنوان
  g.textAlign = 'right'; g.direction = 'rtl';
  g.fillStyle = '#feb47b'; g.font = '900 56px Tajawal, sans-serif';
  g.fillText('طيف', cw - pad, pad + 50);
  g.fillStyle = '#9aa0b4'; g.font = '400 26px Tajawal, sans-serif';
  g.fillText('تحليل التكوين والضوء واللون', cw - pad - 130, pad + 50);

  let y = pad + 90 + imgH + 80;

  // الدرجة
  g.textAlign = 'left';
  g.fillStyle = '#fff'; g.font = '900 90px "Space Grotesk", sans-serif';
  g.fillText(a.composition.score, pad, y);
  g.fillStyle = '#9aa0b4'; g.font = '400 30px Tajawal'; g.fillText('/100', pad + 150, y);
  g.textAlign = 'right'; g.fillStyle = '#feb47b'; g.font = '700 36px Tajawal';
  g.fillText(a.composition.label, cw - pad, y - 30);
  g.fillStyle = '#9aa0b4'; g.font = '400 26px Tajawal';
  g.fillText(a.mood.label + ' · درجة التكوين', cw - pad, y + 14);

  y += 70;
  // لوحة الألوان
  const sw = (cw - pad * 2 - 5 * 16) / 6;
  a.palette.forEach((col, i) => {
    g.fillStyle = col.hex;
    roundRect(g, pad + i * (sw + 16), y, sw, 90, 14); g.fill();
  });
  y += 130;

  // الهيستوجرام
  g.fillStyle = 'rgba(255,255,255,.05)';
  roundRect(g, pad, y, cw - pad*2, 120, 16); g.fill();
  const hw = (cw - pad*2) / a.histogram.bins.length;
  const hg = g.createLinearGradient(pad, 0, cw-pad, 0);
  hg.addColorStop(0, '#7ee8fa'); hg.addColorStop(1, '#feb47b');
  g.fillStyle = hg;
  a.histogram.bins.forEach((v, i) => {
    const bh = (v / a.histogram.max) * 110;
    g.fillRect(pad + i*hw, y + 115 - bh, hw - 1, bh);
  });

  // التذييل
  g.textAlign = 'center'; g.fillStyle = '#9aa0b4'; g.font = '400 24px Tajawal';
  g.fillText('TAYF · طيف — حُلِّلت داخل المتصفح بخصوصية كاملة', cw/2, ch - 50);

  const link = document.createElement('a');
  link.download = 'tayf-analysis.png';
  link.href = cv.toDataURL('image/png');
  link.click();
  toast('تم تنزيل بطاقة التحليل 🎉');
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ---------------------- صورة تجريبية (متدرّج فني مولّد) ---------------------- */
function generateSample() {
  const c = document.createElement('canvas');
  c.width = 1200; c.height = 800;
  const g = c.getContext('2d');
  // سماء غروب متدرّجة
  const sky = g.createLinearGradient(0, 0, 0, 800);
  sky.addColorStop(0, '#2b1055'); sky.addColorStop(0.5, '#7e3f8f');
  sky.addColorStop(0.75, '#ff7e5f'); sky.addColorStop(1, '#feb47b');
  g.fillStyle = sky; g.fillRect(0, 0, 1200, 800);
  // الشمس عند نقطة قوة (ثلث)
  const sx = 1200 * (2/3), sy = 800 * (1/3);
  const sun = g.createRadialGradient(sx, sy, 0, sx, sy, 140);
  sun.addColorStop(0, '#fff6e0'); sun.addColorStop(0.4, '#ffd27e'); sun.addColorStop(1, 'rgba(255,180,120,0)');
  g.fillStyle = sun; g.beginPath(); g.arc(sx, sy, 140, 0, 7); g.fill();
  // تلال ظلية
  g.fillStyle = '#1a0f2e';
  g.beginPath(); g.moveTo(0, 620);
  g.bezierCurveTo(300, 540, 600, 660, 1200, 560); g.lineTo(1200, 800); g.lineTo(0, 800); g.fill();
  g.fillStyle = '#0e0820';
  g.beginPath(); g.moveTo(0, 700);
  g.bezierCurveTo(400, 650, 800, 740, 1200, 680); g.lineTo(1200, 800); g.lineTo(0, 800); g.fill();
  // طائر صغير
  g.strokeStyle = '#1a0f2e'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(360, 200); g.quadraticCurveTo(385, 185, 410, 200);
  g.quadraticCurveTo(435, 185, 460, 200); g.stroke();
  loadImage(c.toDataURL('image/png'));
}

/* ---------------------- ربط الأحداث ---------------------- */
['fileInput', 'fileInput2'].forEach((id) => {
  els[id].addEventListener('change', (e) => handleFile(e.target.files[0]));
});
els.sampleBtn.addEventListener('click', generateSample);
els.downloadCard.addEventListener('click', downloadCard);

// السحب والإفلات
['dragenter', 'dragover'].forEach((ev) =>
  els.dropzone.addEventListener(ev, (e) => { e.preventDefault(); els.dropzone.classList.add('drag'); }));
['dragleave', 'drop'].forEach((ev) =>
  els.dropzone.addEventListener(ev, (e) => { e.preventDefault(); els.dropzone.classList.remove('drag'); }));
els.dropzone.addEventListener('drop', (e) => handleFile(e.dataTransfer.files[0]));
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());

// أزرار الطبقات
document.querySelectorAll('.chip[data-overlay]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.overlay;
    state.overlays[key] = !state.overlays[key];
    btn.setAttribute('aria-pressed', String(state.overlays[key]));
    if (state.analysis) render();
  });
});

// إعادة رسم الهيستوجرام عند تغيير الحجم
let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => { if (state.analysis) drawHistogram(state.analysis.histogram); }, 150);
});
