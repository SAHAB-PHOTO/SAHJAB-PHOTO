/* =========================================================
   أكاديمية سهاب — طبقة التطبيق المشتركة
   إدارة الحسابات، التسجيل في الدورات، التقدّم، والشهادات
   (تخزين محلي تجريبي — يُستبدل بواجهة API خلفية في الإنتاج)
   ========================================================= */

const Store = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

/* ---------- الحسابات ---------- */
const Auth = {
  users() { return Store.read("sahab_users", []); },

  current() {
    const email = Store.read("sahab_session", null);
    if (!email) return null;
    return this.users().find(u => u.email === email) || null;
  },

  register({ name, email, password }) {
    const users = this.users();
    if (users.some(u => u.email === email)) {
      throw new Error("هذا البريد الإلكتروني مسجّل مسبقًا. جرّب تسجيل الدخول.");
    }
    // ملاحظة: تجزئة مبسطة للعرض التجريبي فقط — الإنتاج يتطلب خادمًا وbcrypt
    const user = {
      name, email, hash: this._hash(password),
      joined: new Date().toISOString(),
      enrollments: [], progress: {}, quizScores: {}, certificates: [],
      subscription: null, payments: [],
    };
    users.push(user);
    Store.write("sahab_users", users);
    Store.write("sahab_session", email);
    return user;
  },

  login(email, password) {
    const user = this.users().find(u => u.email === email);
    if (!user || user.hash !== this._hash(password)) {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
    Store.write("sahab_session", email);
    return user;
  },

  logout() {
    localStorage.removeItem("sahab_session");
    location.href = "index.html";
  },

  save(user) {
    const users = this.users().map(u => (u.email === user.email ? user : u));
    Store.write("sahab_users", users);
  },

  _hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return "h" + (h >>> 0).toString(36);
  },
};

/* ---------- التسجيل في الدورات والتقدّم ---------- */
const Enroll = {
  isEnrolled(user, courseId) {
    if (!user) return false;
    if (user.subscription && user.subscription.active) return true;
    return user.enrollments.includes(courseId);
  },

  enroll(user, courseId) {
    if (!user.enrollments.includes(courseId)) {
      user.enrollments.push(courseId);
      Auth.save(user);
    }
  },

  lessonKey(courseId, mi, li) { return `${courseId}:${mi}:${li}`; },

  isLessonDone(user, courseId, mi, li) {
    return !!(user && user.progress[this.lessonKey(courseId, mi, li)]);
  },

  markLesson(user, courseId, mi, li, done = true) {
    const key = this.lessonKey(courseId, mi, li);
    if (done) user.progress[key] = new Date().toISOString();
    else delete user.progress[key];
    Auth.save(user);
  },

  courseProgress(user, course) {
    if (!user) return 0;
    const total = courseLessonsTotal(course);
    let done = 0;
    course.modules.forEach((m, mi) =>
      m.lessons.forEach((_, li) => { if (this.isLessonDone(user, course.id, mi, li)) done++; })
    );
    return total ? Math.round((done / total) * 100) : 0;
  },

  saveQuizScore(user, courseId, mi, score, total) {
    user.quizScores[`${courseId}:${mi}`] = { score, total, at: new Date().toISOString() };
    Auth.save(user);
  },

  quizScore(user, courseId, mi) {
    return user ? user.quizScores[`${courseId}:${mi}`] : null;
  },

  maybeIssueCertificate(user, course) {
    if (user.certificates.some(c => c.courseId === course.id)) return null;
    if (this.courseProgress(user, course) < 100) return null;
    const quizzesOk = course.modules.every((m, mi) => {
      if (!m.quiz) return true;
      const s = this.quizScore(user, course.id, mi);
      return s && s.score / s.total >= 0.6;
    });
    if (!quizzesOk) return null;
    const cert = {
      courseId: course.id,
      courseTitle: course.title,
      code: "SAHAB-" + course.id.toUpperCase().slice(0, 4) + "-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      issuedAt: new Date().toISOString(),
    };
    user.certificates.push(cert);
    Auth.save(user);
    return cert;
  },
};

/* ---------- الدفع (محاكاة بوابة دفع) ---------- */
const Payments = {
  purchaseCourse(user, course, method) {
    user.payments.push({
      type: "course", item: course.id, title: course.title,
      amount: course.price, method, at: new Date().toISOString(),
      ref: "INV-" + Date.now().toString(36).toUpperCase(),
    });
    Enroll.enroll(user, course.id);
  },

  subscribe(user, planId, method) {
    const plan = PLANS.find(p => p.id === planId);
    const now = new Date();
    const ends = new Date(now);
    if (planId === "yearly") ends.setFullYear(ends.getFullYear() + 1);
    else ends.setMonth(ends.getMonth() + 1);
    user.subscription = { plan: planId, active: true, started: now.toISOString(), ends: ends.toISOString() };
    user.payments.push({
      type: "subscription", item: planId, title: plan.name,
      amount: plan.price, method, at: now.toISOString(),
      ref: "INV-" + Date.now().toString(36).toUpperCase(),
    });
    Auth.save(user);
  },

  cancelSubscription(user) {
    if (user.subscription) { user.subscription.active = false; Auth.save(user); }
  },
};

/* ---------- أدوات واجهة ---------- */
const UI = {
  toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 3200);
  },

  fmtPrice(p) { return p === 0 ? "مجاني" : `$${p}`; },

  fmtDate(iso) {
    return new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
  },

  courseCard(c) {
    const inst = getInstructor(c.instructor);
    const priceHtml = c.free
      ? `<span class="price free">مجاني</span>`
      : `<span class="price">${c.oldPrice ? `<span class="old">$${c.oldPrice}</span>` : ""}$${c.price}</span>`;
    return `
    <article class="course-card">
      <a href="course.html?id=${c.id}" class="course-thumb" style="background:linear-gradient(140deg, ${c.gradient[0]}, ${c.gradient[1]})">
        <span>${c.icon}</span>
        <span class="level-badge">${c.level}</span>
        ${c.free ? `<span class="free-badge">مجاني</span>` : ""}
      </a>
      <div class="course-body">
        <span class="course-cat">${c.category}</span>
        <h3><a href="course.html?id=${c.id}">${c.title}</a></h3>
        <p class="short">${c.short}</p>
        <div class="course-meta">
          <span>🎬 ${c.lessonsCount} درسًا</span>
          <span>⏱️ ${c.hours} ساعة</span>
          <span>👥 ${c.students.toLocaleString("ar")} طالب</span>
        </div>
        <div class="course-foot">
          ${priceHtml}
          <span class="rating">★ ${c.rating} <span>· ${inst.name}</span></span>
        </div>
      </div>
    </article>`;
  },
};

/* ---------- بناء شريط التنقل والتذييل ---------- */
function renderNav(active = "") {
  const user = Auth.current();
  const el = document.getElementById("navbar");
  if (!el) return;
  el.innerHTML = `
  <div class="container">
    <a href="index.html" class="brand">
      <span class="logo">📸</span>
      <span>أكاديمية سهاب<small>للتصوير الفوتوغرافي</small></span>
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" class="${active === "home" ? "active" : ""}">الرئيسية</a></li>
      <li><a href="courses.html" class="${active === "courses" ? "active" : ""}">الدورات</a></li>
      <li><a href="index.html#tracks">المسارات</a></li>
      <li><a href="pricing.html" class="${active === "pricing" ? "active" : ""}">الأسعار</a></li>
      <li><a href="index.html#faq">الأسئلة الشائعة</a></li>
    </ul>
    <div class="nav-actions">
      ${user
        ? `<a href="dashboard.html" class="btn btn-outline btn-sm">لوحتي</a>
           <a href="dashboard.html" class="avatar" title="${user.name}" style="width:38px;height:38px;font-size:0.72rem">${initials(user.name)}</a>`
        : `<a href="login.html" class="btn btn-outline btn-sm">تسجيل الدخول</a>
           <a href="register.html" class="btn btn-gold btn-sm">ابدأ مجانًا</a>`}
      <button class="nav-toggle" id="navToggle" aria-label="القائمة">☰</button>
    </div>
  </div>`;
  document.getElementById("navToggle").addEventListener("click", () =>
    document.getElementById("navLinks").classList.toggle("open")
  );
}

function renderFooter() {
  const el = document.getElementById("footer");
  if (!el) return;
  el.innerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="brand" style="margin-bottom:14px"><span class="logo">📸</span><span>أكاديمية سهاب</span></a>
        <p>أول أكاديمية عربية متكاملة لتعليم التصوير الفوتوغرافي — من الصفر إلى الاحتراف، بمناهج منظمة ومدرّبين محترفين وشهادات موثّقة.</p>
      </div>
      <div>
        <h4>التعلّم</h4>
        <ul>
          <li><a href="courses.html">جميع الدورات</a></li>
          <li><a href="index.html#tracks">المسارات التعليمية</a></li>
          <li><a href="pricing.html">الباقات والأسعار</a></li>
          <li><a href="course.html?id=fundamentals">الدورة المجانية</a></li>
        </ul>
      </div>
      <div>
        <h4>الأكاديمية</h4>
        <ul>
          <li><a href="index.html#instructors">المدرّبون</a></li>
          <li><a href="index.html#testimonials">آراء الطلاب</a></li>
          <li><a href="index.html#faq">الأسئلة الشائعة</a></li>
          <li><a href="docs/admin-guide.html">دليل المسؤولين</a></li>
        </ul>
      </div>
      <div>
        <h4>الحساب</h4>
        <ul>
          <li><a href="register.html">إنشاء حساب</a></li>
          <li><a href="login.html">تسجيل الدخول</a></li>
          <li><a href="dashboard.html">لوحة التحكم</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} أكاديمية سهاب للتصوير الفوتوغرافي — جميع الحقوق محفوظة.</span>
      <span>صُنع بشغف للمصورين العرب 🤍</span>
    </div>
  </div>`;
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts[0][0] + " " + parts[1][0] : parts[0].slice(0, 2);
}

function qs(name) { return new URLSearchParams(location.search).get(name); }

function requireAuth() {
  const user = Auth.current();
  if (!user) { location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); }
  return user;
}
