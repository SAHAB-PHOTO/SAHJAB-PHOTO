/* =========================================================
   نَبأ — NABA News  |  منطق العرض والتفاعل
   ========================================================= */

/* ---------- خلفيات متدرّجة بديلة عن الصور (تعمل دون إنترنت) ---------- */
const GRADIENTS = {
  1: "linear-gradient(135deg,#1e3c72,#2a5298)",
  2: "linear-gradient(135deg,#0f2027,#2c5364)",
  3: "linear-gradient(135deg,#134e5e,#71b280)",
  4: "linear-gradient(135deg,#42275a,#734b6d)",
  5: "linear-gradient(135deg,#0b486b,#f56217)",
  6: "linear-gradient(135deg,#cb2d3e,#ef473a)",
  7: "linear-gradient(135deg,#283048,#859398)",
  8: "linear-gradient(135deg,#5f2c82,#49a09d)",
  9: "linear-gradient(135deg,#1a2980,#26d0ce)",
  10: "linear-gradient(135deg,#11998e,#38ef7d)",
  11: "linear-gradient(135deg,#373b44,#4286f4)",
  12: "linear-gradient(135deg,#8e0e00,#1f1c18)",
};
function phStyle(n) {
  const g = GRADIENTS[n] || GRADIENTS[1];
  return `background:${g};`;
}
/* خلفية البطاقة: صورة حقيقية إن وُجدت، وإلا تدرّج لوني */
function bgStyle(a) {
  if (a && a.thumbnail)
    return `background:#1a2230 url('${a.thumbnail}') center/cover no-repeat;`;
  return phStyle(a ? a.img : 1);
}
function catName(id) {
  const c = NABA_CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}
function articleHref(a) { return `article.html?id=${a.id}`; }

/* ---------- مكوّنات العرض (HTML) ---------- */
function heroMainHTML(a) {
  return `
  <a class="hero-main" href="${articleHref(a)}">
    <div class="ph" style="${bgStyle(a)}"></div>
    <div class="overlay">
      <span class="badge">${catName(a.category)}</span>
      <h1>${a.title}</h1>
      <p>${a.lead}</p>
      <div style="margin-top:10px;color:#cfd6df;font-size:13px">${a.author} · ${a.date} · ${a.read} د قراءة</div>
    </div>
  </a>`;
}
function heroSideHTML(a) {
  return `
  <a class="card-img" href="${articleHref(a)}">
    <div class="ph" style="${bgStyle(a)}"></div>
    <div class="overlay">
      <span class="badge ghost">${catName(a.category)}</span>
      <h3>${a.title}</h3>
    </div>
  </a>`;
}
function cardHTML(a) {
  return `
  <a class="card" href="${articleHref(a)}">
    <div class="thumb">
      <div class="ph" style="${bgStyle(a)}"></div>
      <span class="badge">${catName(a.category)}</span>
    </div>
    <div class="body">
      <h3>${a.title}</h3>
      <p>${a.lead}</p>
      <div class="meta"><span class="cat">${catName(a.category)}</span><span>${a.date}</span><span>${a.read} د</span></div>
    </div>
  </a>`;
}
function listItemHTML(a) {
  return `
  <a class="list-item" href="${articleHref(a)}">
    <div class="thumb"><div class="ph" style="${bgStyle(a)}"></div></div>
    <div>
      <h4>${a.title}</h4>
      <div class="meta">${catName(a.category)} · ${a.date}</div>
    </div>
  </a>`;
}
function trendItemHTML(a, i) {
  return `
  <a class="trend-item" href="${articleHref(a)}">
    <span class="num">${i + 1}</span>
    <div><p>${a.title}</p><div class="meta">${catName(a.category)} · ${a.read} د قراءة</div></div>
  </a>`;
}

/* ---------- بناء الصفحة الرئيسية ---------- */
function renderHome(articles) {
  const main = articles[0];
  const sides = articles.slice(1, 3);
  const rest = articles.slice(3);

  const heroEl = document.getElementById("hero");
  if (heroEl && main) {
    heroEl.innerHTML =
      heroMainHTML(main) +
      `<div class="hero-side">${sides.map(heroSideHTML).join("")}</div>`;
  }

  const latestEl = document.getElementById("latest-grid");
  if (latestEl) latestEl.innerHTML = rest.slice(0, 6).map(cardHTML).join("");

  // الأكثر قراءة
  const trendEl = document.getElementById("trending");
  if (trendEl) {
    const top = [...articles].sort(() => Math.random() - 0.5).slice(0, 5);
    trendEl.innerHTML = top.map((a, i) => trendItemHTML(a, i)).join("");
  }

  // قائمة جانبية مختارة
  const pickEl = document.getElementById("editor-picks");
  if (pickEl) pickEl.innerHTML = rest.slice(6, 10).map(listItemHTML).join("");
}

function buildHome() {
  // 1) عرض فوري للبيانات الثابتة (رسم سريع)
  const ordered = [
    NABA_ARTICLES.find((a) => a.featured === "main"),
    ...NABA_ARTICLES.filter((a) => a.featured === "side"),
    ...NABA_ARTICLES.filter((a) => !a.featured),
  ].filter(Boolean);
  renderHome(ordered);
  renderCategoryStrip("strip-economy", "economy");
  renderCategoryStrip("strip-tech", "tech");
  renderCategoryStrip("strip-sports", "sports");

  // 2) محاولة جلب الأخبار الحقيقية واستبدال المحتوى عند النجاح
  if (typeof fetchCategory !== "function") return;
  fetchCategory("home")
    .then((live) => {
      if (live && live.length) {
        renderHome(live);
        markLive();
      }
    })
    .catch(() => {/* الإبقاء على البيانات الثابتة */});
  ["economy", "tech", "sports"].forEach((cat) => {
    fetchCategory(cat)
      .then((live) => { if (live && live.length) renderCategoryStrip("strip-" + cat, cat, live); })
      .catch(() => {});
  });
}

function renderCategoryStrip(elId, cat, live) {
  const el = document.getElementById(elId);
  if (!el) return;
  let items;
  if (live && live.length) {
    items = live.slice(0, 3);
  } else {
    items = NABA_ARTICLES.filter((a) => a.category === cat).slice(0, 3);
    if (items.length < 3) {
      NABA_ARTICLES.forEach((a) => {
        if (items.length < 3 && !items.includes(a)) items.push(a);
      });
    }
  }
  el.innerHTML = items.map(cardHTML).join("");
}

/* مؤشر بصري بأن المحتوى مباشر */
function markLive() {
  const cta = document.querySelector(".cta-live");
  if (cta && !cta.dataset.marked) {
    cta.dataset.marked = "1";
    cta.title = "الأخبار محدّثة مباشرة من المصدر";
  }
}

/* ---------- بناء صفحة القسم ---------- */
function buildCategory() {
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat") || "world";
  const titleEl = document.getElementById("cat-title");
  const gridEl = document.getElementById("cat-grid");
  if (titleEl) titleEl.textContent = catName(cat);
  document.title = `${catName(cat)} — نَبأ NABA`;
  // البيانات الثابتة أولاً
  let items = NABA_ARTICLES.filter((a) => a.category === cat);
  if (items.length === 0) items = NABA_ARTICLES;
  if (gridEl) gridEl.innerHTML = items.map(cardHTML).join("");
  // تفعيل رابط القسم في القائمة
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.dataset.cat === cat) a.classList.add("active");
  });
  // ثم الأخبار الحقيقية
  if (typeof fetchCategory === "function") {
    fetchCategory(cat)
      .then((live) => { if (gridEl && live && live.length) gridEl.innerHTML = live.map(cardHTML).join(""); })
      .catch(() => {});
  }
}

/* ---------- بناء صفحة المقال ---------- */
function buildArticle() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "a1";
  // مقال مباشر من التخزين المؤقت، وإلا مقال ثابت
  let a = null;
  if (typeof getCachedArticle === "function") a = getCachedArticle(id);
  if (!a) a = NABA_ARTICLES.find((x) => x.id === id) || NABA_ARTICLES[0];
  document.title = `${a.title} — نَبأ NABA`;

  const set = (sel, val) => { const e = document.querySelector(sel); if (e) e.textContent = val; };
  set("#bc-cat", catName(a.category));
  set("#art-title", a.title);
  set("#art-lead", a.lead);
  set("#art-author", a.author);
  set("#art-avatar", a.author.charAt(0));
  set("#art-date", a.date);
  set("#art-read", `${a.read} دقائق قراءة`);
  const badge = document.querySelector("#art-badge");
  if (badge) badge.textContent = catName(a.category);

  const fig = document.querySelector("#art-figure .ph");
  if (fig) fig.setAttribute("style", bgStyle(a));

  const bodyEl = document.getElementById("art-body");
  if (bodyEl) {
    if (a.live && a.content) {
      // محتوى حقيقي من المصدر + رابط للأصل
      bodyEl.innerHTML =
        `<p>${a.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}</p>` +
        (a.link
          ? `<p style="margin-top:24px"><a class="cta-live" style="display:inline-flex" href="${a.link}" target="_blank" rel="noopener">اقرأ الخبر كاملاً من المصدر ←</a></p>`
          : "");
    } else {
      let html = "";
      NABA_BODY.forEach((p, i) => {
        html += `<p>${p}</p>`;
        if (i === 1) html += `<blockquote>«إننا أمام لحظة فارقة تتطلب حكمة في القرار وشجاعة في المبادرة» — مصدر مسؤول</blockquote>`;
        if (i === 2) html += `<h2>قراءة في الأبعاد والتداعيات</h2>`;
      });
      bodyEl.innerHTML = html;
    }
  }

  const tagsEl = document.getElementById("art-tags");
  if (tagsEl) {
    const tags = a.tags && a.tags.length ? a.tags : [catName(a.category), "نَبأ", "أخبار"];
    tagsEl.innerHTML = tags.map((t) => `<a href="#">#${t}</a>`).join("");
  }

  // مقالات ذات صلة (من المباشر المخزّن إن وُجد، وإلا الثابت)
  const relEl = document.getElementById("art-related");
  if (relEl) {
    const pool = (typeof getAllCached === "function" && getAllCached().length)
      ? getAllCached() : NABA_ARTICLES;
    const rel = pool.filter((x) => x.id !== a.id && x.category === a.category);
    const fill = pool.filter((x) => x.id !== a.id && x.category !== a.category);
    const list = [...rel, ...fill].slice(0, 3);
    relEl.innerHTML = list.map(cardHTML).join("");
  }
}

/* ---------- العناصر العامة (عاجل، وضع ليلي، إلخ) ---------- */
function buildBreaking() {
  const el = document.getElementById("breaking-list");
  if (!el) return;
  const items = NABA_BREAKING.map((t) => `<li><a href="#">${t}</a></li>`).join("");
  el.innerHTML = items + items; // تكرار لانسيابية الحركة
}

function buildNav() {
  document.querySelectorAll("[data-nav]").forEach((nav) => {
    nav.innerHTML =
      `<a href="index.html" data-cat="home">الرئيسية</a>` +
      NABA_CATEGORIES.map((c) => `<a href="category.html?cat=${c.id}" data-cat="${c.id}">${c.name}</a>`).join("");
  });
}

function setupDate() {
  const el = document.getElementById("today-date");
  if (!el) return;
  const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const d = new Date();
  el.textContent = `${days[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function setupTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("naba-theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  const sync = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (btn) btn.innerHTML = dark ? "☀️ نهاري" : "🌙 ليلي";
  };
  sync();
  if (btn) btn.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) { document.documentElement.removeAttribute("data-theme"); localStorage.setItem("naba-theme", "light"); }
    else { document.documentElement.setAttribute("data-theme", "dark"); localStorage.setItem("naba-theme", "dark"); }
    sync();
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = form.querySelector(".ok");
    if (ok) ok.style.display = "block";
    form.querySelector("input").value = "";
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = input.value.trim();
      if (q) location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
  });
}

/* ---------- بناء صفحة البحث ---------- */
function buildSearch() {
  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || "").trim();
  const titleEl = document.getElementById("search-title");
  const gridEl = document.getElementById("search-grid");
  const box = document.getElementById("search-input");
  if (box) box.value = q;
  if (titleEl) titleEl.textContent = q ? `نتائج البحث عن: «${q}»` : "ابحث في نَبأ";
  document.title = `بحث: ${q} — نَبأ NABA`;

  const render = (pool) => {
    if (!gridEl) return;
    if (!q) { gridEl.innerHTML = `<p style="color:var(--muted)">اكتب كلمة في صندوق البحث بالأعلى ثم اضغط Enter.</p>`; return; }
    const norm = (s) => (s || "").toLowerCase();
    const hits = pool.filter((a) =>
      norm(a.title).includes(norm(q)) || norm(a.lead).includes(norm(q)) ||
      (a.tags && a.tags.some((t) => norm(t).includes(norm(q)))));
    gridEl.innerHTML = hits.length
      ? hits.map(cardHTML).join("")
      : `<p style="color:var(--muted)">لا توجد نتائج مطابقة لـ «${q}». جرّب كلمة أخرى.</p>`;
  };

  // ابحث في الثابت فوراً، ثم اجلب أخباراً حقيقية ووسّع النتائج
  render(NABA_ARTICLES);
  if (typeof fetchCategory === "function" && q) {
    Promise.allSettled(["home", "world", "economy", "tech", "sports"].map((c) => fetchCategory(c)))
      .then((results) => {
        const live = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
        if (live.length) render([...live, ...NABA_ARTICLES]);
      });
  }
}

function setupScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- التشغيل ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildNav();
  buildBreaking();
  setupDate();
  setupTheme();
  setupNewsletter();
  setupSearch();
  setupScrollTop();

  const page = document.body.dataset.page;
  if (page === "home") buildHome();
  if (page === "category") buildCategory();
  if (page === "article") buildArticle();
  if (page === "search") buildSearch();
  if (page === "opinion") buildOpinion();
});

/* ---------- صفحة الرأي (كتّاب نَبأ) ---------- */
const NABA_WRITERS = [
  { name: "أحمد العامري", role: "محلل سياسي", img: 7,
    title: "حين تتحوّل الأزمات إلى فرص: قراءة في موازين القوى الجديدة",
    lead: "العالم يعيد ترتيب أوراقه، والرابح من يقرأ المتغيّرات مبكراً قبل أن تفرض نفسها." },
  { name: "ليلى منصور", role: "كاتبة اقتصادية", img: 4,
    title: "اقتصاد ما بعد التضخم: لماذا تبدو المؤشرات مطمئنة وخادعة معاً؟",
    lead: "الأرقام وحدها لا تكفي لفهم ما يجري في جيوب الناس وأسواقهم." },
  { name: "كريم فاضل", role: "كاتب في العلوم", img: 9,
    title: "الذكاء الاصطناعي ليس عدوّاً ولا مُخلّصاً.. إنه مرآتنا",
    lead: "كل ما نخشاه ونأمله في هذه التقنية هو في حقيقته انعكاس لاختياراتنا نحن." },
  { name: "سارة حداد", role: "ناقدة ثقافية", img: 8,
    title: "السينما العربية وسؤال الهوية في زمن المنصّات العابرة للحدود",
    lead: "بين الانفتاح على العالم والحفاظ على الخصوصية، تبحث صناعتنا عن صوتها." },
];
function buildOpinion() {
  const el = document.getElementById("opinion-grid");
  if (!el) return;
  el.innerHTML = NABA_WRITERS.map((w) => `
    <article class="card">
      <div class="body">
        <div class="author" style="margin-bottom:6px">
          <span class="avatar" style="background:${(GRADIENTS[w.img])}">${w.name.charAt(0)}</span>
          <div><b>${w.name}</b><div style="font-size:12px;color:var(--muted)">${w.role}</div></div>
        </div>
        <h3 style="font-size:19px">${w.title}</h3>
        <p>${w.lead}</p>
        <div class="meta"><span class="cat">رأي</span><span>مقال رأي</span></div>
      </div>
    </article>`).join("");
}
