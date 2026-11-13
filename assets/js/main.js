/* =========================================================
   مستر عاطي — main.js
   ⚠️ عدّل بيانات الاتصال من الكائن CONFIG بالأسفل فقط
   ========================================================= */

const CONFIG = {
  /* رقم الواتساب بالصيغة الدولية بدون + وبدون مسافات */
  phone: "201000000000",          // ← مثال: 201012345678
  phoneDisplay: "0100 000 0000",  // ← الرقم كما يظهر للزائر
  facebook: "https://web.facebook.com/Abdelrhman.ATY.101",
  youtube: "",
  instagram: "",
  tiktok: "",
  center: "العنوان بالتفصيل — يُرسل على واتساب",
  hours: "السبت – الخميس | 2 م – 9 م",
  waMessage: "السلام عليكم مستر عاطي 👋 عايز أستفسر عن الحصص والمواعيد."
};

(() => {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const waLink = (text) =>
    `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(text || CONFIG.waMessage)}`;

  /* ---------- 1. بيانات الاتصال ---------- */
  function applyConfig() {
    $$("[data-phone]").forEach((el) => {
      el.textContent = CONFIG.phoneDisplay;
      el.setAttribute("href", "tel:+" + CONFIG.phone.replace(/\D/g, ""));
    });

    $$("[data-whatsapp]").forEach((el) => {
      el.setAttribute("href", waLink());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    const socials = [
      ["facebook", "data-facebook"],
      ["youtube", "data-youtube"],
      ["instagram", "data-instagram"],
      ["tiktok", "data-tiktok"]
    ];

    socials.forEach(([key, attr]) => {
      $$(`[${attr}]`).forEach((el) => {
        const url = CONFIG[key];
        if (url) {
          el.setAttribute("href", url);
          el.hidden = false;
        } else if (attr !== "data-facebook") {
          el.hidden = true;
        } else {
          el.setAttribute("href", "#");
        }
      });
    });

    const center = $("[data-center]");
    if (center) center.textContent = CONFIG.center;

    const hours = $("[data-hours]");
    if (hours) hours.textContent = CONFIG.hours;

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- 2. الهيدر + زر الرجوع لأعلى ---------- */
  function initScrollUI() {
    const header = $("#site-header");
    const toTop = $("#to-top");
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.hidden = y < 640;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();

    if (toTop) {
      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  /* ---------- 3. قائمة الموبايل ---------- */
  function initMobileNav() {
    const toggle = $("#nav-toggle");
    const panel = $("#mobile-nav");
    if (!toggle || !panel) return;

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "فتح القائمة");
      panel.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) return close();
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "إغلاق القائمة");
      panel.classList.add("is-open");
    });

    $$("a", panel).forEach((a) => a.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) close();
    });
  }

  /* ---------- 4. ظهور العناصر ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    let alive = false;

    const io = new IntersectionObserver((entries) => {
      alive = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach((el) => io.observe(el));

    /* شبكة أمان: لو الـ observer مش شغال لأي سبب، نفعّل الظهور بالتمرير */
    const fallback = () => {
      if (alive) return;

      const check = () => {
        items.forEach((el) => {
          if (el.classList.contains("is-in")) return;
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
            el.classList.add("is-in");
          }
        });
      };

      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
    };

    window.setTimeout(fallback, 1300);
  }

  /* ---------- 5. الأرقام ---------- */
  function initCounters() {
    const counters = $$(".count");
    if (!counters.length) return;

    const run = (el) => {
      const target = Number(el.dataset.target) || 0;
      if (reduceMotion) {
        el.textContent = target.toLocaleString("en-US");
        return;
      }
      const dur = 1500;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    let alive = false;

    const io = new IntersectionObserver((entries) => {
      alive = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => io.observe(el));

    window.setTimeout(() => {
      if (!alive) counters.forEach(run);
    }, 1400);
  }

  /* ---------- 6. الأسئلة الشائعة ---------- */
  function initFaq() {
    const items = $$(".faq__item");
    if (!items.length) return;

    items.forEach((item) => {
      const btn = $(".faq__q", item);
      if (!btn) return;

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const b = $(".faq__q", other);
          if (b) b.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- 7. تفعيل رابط القسم الحالي ---------- */
  function initActiveNav() {
    const links = $$(".nav__links a");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href");
      const section = id && id.startsWith("#") ? $(id) : null;
      if (section) map.set(section, link);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    map.forEach((_, section) => io.observe(section));
  }

  /* ---------- 8. نموذج الحجز ---------- */
  function initForm() {
    const form = $("#book-form");
    if (!form) return;

    const okBox = $("#form-ok");
    const phoneInput = $("#f-phone");
    const nameInput = $("#f-name");

    const setError = (name, msg) => {
      const err = $(`[data-err="${name}"]`, form);
      const input = form.elements[name];
      if (err) err.textContent = msg || "";
      if (input) input.closest(".field")?.classList.toggle("has-error", !!msg);
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    const normalizePhone = (raw) => {
      let d = String(raw).replace(/[\s\-()]/g, "").replace(/^\+/, "");
      if (d.startsWith("0020")) d = d.slice(2);
      if (d.startsWith("20")) d = "0" + d.slice(2);
      return d;
    };

    const isValidPhone = (d) => /^01[0125]\d{8}$/.test(d);

    const validate = () => {
      let valid = true;

      const name = nameInput.value.trim();
      if (name.length < 3) {
        setError("name", "اكتب اسمك بالكامل (3 حروف على الأقل)");
        valid = false;
      } else setError("name", "");

      const phone = normalizePhone(phoneInput.value);
      if (!phone) {
        setError("phone", "رقم الموبايل مطلوب");
        valid = false;
      } else if (!isValidPhone(phone)) {
        setError("phone", "اكتب رقم موبايل مصري صحيح — مثال: 01012345678");
        valid = false;
      } else setError("phone", "");

      const grade = form.elements.grade.value;
      if (!grade) {
        setError("grade", "اختار صفك الدراسي");
        valid = false;
      } else setError("grade", "");

      const type = form.elements.type.value;
      if (!type) {
        setError("type", "اختار نوع الحصة");
        valid = false;
      } else setError("type", "");

      return valid;
    };

    [nameInput, phoneInput].forEach((input) => {
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("has-error")) {
          setError(input.name, "");
        }
      });
    });

    ["grade", "type"].forEach((n) => {
      form.elements[n].addEventListener("change", () => setError(n, ""));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        const firstError = $(".has-error input, .has-error select", form);
        firstError?.focus({ preventScroll: false });
        return;
      }

      const name = nameInput.value.trim();
      const phone = normalizePhone(phoneInput.value);
      const grade = form.elements.grade.value;
      const type = form.elements.type.value;
      const message = form.elements.message.value.trim();

      const lines = [
        "السلام عليكم مستر عاطي 👋",
        "عايز أحجز حصة.",
        "",
        `• الاسم: ${name}`,
        `• الموبايل: ${phone}`,
        `• الصف: ${grade}`,
        `• نوع الحصة: ${type}`
      ];
      if (message) lines.push(`• ملاحظات: ${message}`);

      const url = waLink(lines.join("\n"));
      window.open(url, "_blank", "noopener,noreferrer");

      if (okBox) {
        okBox.hidden = false;
        $$("a[data-whatsapp]", okBox).forEach((a) => a.setAttribute("href", url));
      }

      form.reset();
    });
  }

  /* ---------- تشغيل ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initScrollUI();
    initMobileNav();
    initReveal();
    initCounters();
    initFaq();
    initActiveNav();
    initForm();
  });
})();
