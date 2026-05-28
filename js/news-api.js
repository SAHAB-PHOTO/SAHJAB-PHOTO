/* =========================================================
   نَبأ — NABA News  |  جلب الأخبار الحقيقية (مباشر)
   يعتمد على خدمة rss2json لتحويل مصادر RSS إلى JSON
   مع دعم CORS (تعمل مباشرة من متصفّح الزائر).
   عند تعذّر الاتصال يعود الموقع تلقائياً للبيانات الثابتة.
   ========================================================= */

const RSS_PROXY = "https://api.rss2json.com/v1/api.json?count=14&rss_url=";

/* مصادر RSS عربية موثوقة (BBC عربي) لكل قسم */
const NABA_FEEDS = {
  home:     "https://feeds.bbci.co.uk/arabic/rss.xml",
  world:    "https://feeds.bbci.co.uk/arabic/worldnews/rss.xml",
  politics: "https://feeds.bbci.co.uk/arabic/middleeast/rss.xml",
  economy:  "https://feeds.bbci.co.uk/arabic/business/rss.xml",
  sports:   "https://feeds.bbci.co.uk/arabic/sports/rss.xml",
  tech:     "https://feeds.bbci.co.uk/arabic/scienceandtech/rss.xml",
  culture:  "https://feeds.bbci.co.uk/arabic/artandculture/rss.xml",
  health:   "https://feeds.bbci.co.uk/arabic/scienceandtech/rss.xml",
  science:  "https://feeds.bbci.co.uk/arabic/scienceandtech/rss.xml",
};

/* ---------- أدوات مساعدة ---------- */
function stripHTML(html) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
}

function extractImage(item) {
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  const html = item.content || item.description || "";
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : "";
}

function relativeTime(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 172800) return "أمس";
  return `قبل ${Math.floor(diff / 86400)} يوم`;
}

function slugId(link) {
  let h = 0;
  for (let i = 0; i < link.length; i++) h = (h * 31 + link.charCodeAt(i)) | 0;
  return "live" + Math.abs(h).toString(36);
}

/* تحويل عنصر RSS إلى نموذج المقال الموحّد */
function mapItem(item, cat, idx) {
  const lead = stripHTML(item.description || item.content).slice(0, 180);
  const id = slugId(item.link || item.guid || String(idx));
  const content = item.content && item.content.length > (item.description || "").length
    ? item.content : item.description;
  return {
    id, category: cat,
    title: stripHTML(item.title),
    lead: lead + (lead.length >= 180 ? "…" : ""),
    author: stripHTML(item.author) || "بي بي سي عربي",
    date: relativeTime(item.pubDate) || "حديثاً",
    read: Math.max(2, Math.round(stripHTML(content).length / 900)),
    img: (idx % 12) + 1,
    thumbnail: extractImage(item),
    link: item.link,
    content: content || "",
    live: true,
  };
}

/* ---------- التخزين المؤقت (لصفحة المقال) ---------- */
const CACHE_KEY = "naba-live-cache";
function cacheArticles(list) {
  try {
    const store = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
    list.forEach((a) => { store[a.id] = a; });
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch (e) { /* تجاهل امتلاء التخزين */ }
}
function getCachedArticle(id) {
  try {
    const store = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
    return store[id] || null;
  } catch (e) { return null; }
}
function getAllCached() {
  try {
    const store = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
    return Object.values(store);
  } catch (e) { return []; }
}

/* ---------- الجلب ---------- */
async function fetchCategory(cat) {
  const url = NABA_FEEDS[cat] || NABA_FEEDS.home;
  const res = await fetch(RSS_PROXY + encodeURIComponent(url), { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("bad feed");
  const mapped = data.items
    .filter((it) => it.title)
    .map((it, i) => mapItem(it, cat, i));
  cacheArticles(mapped);
  return mapped;
}
