/* ============================================================
   PUBLIC SITE RENDERER
   Reads data from SiteData and hydrates every page.
   ============================================================ */
(function () {
  const D = window.SiteData.loadData();

  // ----- Theme variables -----
  function applyTheme(m) {
    const r = document.documentElement.style;
    r.setProperty("--c-primary", m.primaryColor);
    r.setProperty("--c-accent", m.accentColor);
    r.setProperty("--c-bg", m.bgColor);
    r.setProperty("--c-text", m.textColor);
    r.setProperty("--c-muted", m.mutedColor);
    r.setProperty("--c-card", m.cardColor);
    r.setProperty("--f-heading", m.fontHeading);
    r.setProperty("--f-body", m.fontBody);
    r.setProperty("--r", m.radius);
    document.title = (document.body.dataset.pageTitle ? document.body.dataset.pageTitle + " · " : "") + m.siteName;
    if (m.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
      link.href = m.favicon;
    }
  }
  applyTheme(D.meta);

  // ----- Aura background -----
  const aura = document.createElement("div"); aura.className = "aura"; document.body.prepend(aura);

  // ----- NAV -----
  function renderNav() {
    const here = location.pathname.split("/").pop() || "index.html";
    const links = D.nav.map(n =>
      `<a href="${n.href}" class="${n.href === here ? "active" : ""}">${n.label}</a>`
    ).join("");
    const logoInner = D.meta.logoImage
      ? `<img src="${D.meta.logoImage}" alt="">`
      : (D.meta.logoText || "A");
    const nav = document.createElement("header"); nav.className = "nav";
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="logo">
          <span class="logo-mark">${logoInner}</span>
          <span>${D.meta.siteName}</span>
        </a>
        <nav class="nav-links" id="navLinks">
          ${links}
          <a href="contact.html" class="nav-cta">Get in touch</a>
        </nav>
        <button class="burger" id="burger" aria-label="Menu">☰</button>
      </div>`;
    document.body.prepend(nav);
    document.getElementById("burger").onclick = () => document.getElementById("navLinks").classList.toggle("open");
  }

  // ----- FOOTER -----
  function renderFooter() {
    const f = document.createElement("footer");
    f.innerHTML = `
      <div class="container footer-inner">
        <div>
          <div class="logo" style="margin-bottom:8px">
            <span class="logo-mark">${D.meta.logoImage ? `<img src="${D.meta.logoImage}">` : (D.meta.logoText || "A")}</span>
            <span>${D.meta.siteName}</span>
          </div>
          <p class="muted" style="font-size:.9rem">${D.footer.text}</p>
        </div>
        <div class="footer-links">
          ${D.footer.links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
        </div>
        <div class="socials">
          ${D.contact.socials.map(s => `<a href="${s.url}" target="_blank" title="${s.label}">${s.label[0]}</a>`).join("")}
        </div>
      </div>`;
    document.body.appendChild(f);
  }

  // ----- HOME -----
  function renderHome() {
    const h = D.home;
    const root = document.getElementById("page");
    root.innerHTML = `
      <section class="hero container">
        <div class="hero-grid">
          <div>
            <span class="eyebrow reveal">${h.heroEyebrow}</span>
            <h1 class="reveal reveal-delay-1">${h.heroTitle}</h1>
            <p class="reveal reveal-delay-2">${h.heroSubtitle}</p>
            <div class="hero-actions reveal reveal-delay-3">
              <a href="${h.heroCtaPrimaryHref}" class="btn btn-primary">${h.heroCtaPrimary}</a>
              <a href="${h.heroCtaSecondaryHref}" class="btn btn-ghost">${h.heroCtaSecondary}</a>
            </div>
          </div>
          <div class="hero-visual reveal reveal-delay-2 floaty"><img src="${h.heroImage}" alt=""></div>
        </div>
      </section>

      <section class="container">
        <div class="stats">
          ${h.stats.map((s,i) => `
            <div class="reveal reveal-delay-${(i%4)+1}">
              <div class="stat-val" data-count="${s.value}">${s.value}</div>
              <div class="stat-lbl">${s.label}</div>
            </div>`).join("")}
        </div>
      </section>

      <div class="marquee"><div class="marquee-track">
        ${Array(2).fill(0).map(()=>`<span>Design</span><span>Brand</span><span>Product</span><span>Motion</span><span>Engineering</span><span>Strategy</span>`).join("")}
      </div></div>

      <section class="section container">
        <div class="sec-head reveal">
          <span class="eyebrow">What we do</span>
          <h2>A studio built for ambitious teams.</h2>
          <p>Four capabilities, one tightly-knit team — so the work stays consistent end to end.</p>
        </div>
        <div class="grid grid-4">
          ${h.features.map((f,i) => `
            <div class="card reveal reveal-delay-${(i%4)+1}">
              <div class="card-icon">${f.icon}</div>
              <h3>${f.title}</h3>
              <p>${f.text}</p>
            </div>`).join("")}
        </div>
      </section>

      <section class="section container">
        <div class="cta-band reveal">
          <h2>${h.ctaTitle}</h2>
          <p>${h.ctaText}</p>
          <a href="${h.ctaHref}" class="btn btn-primary">${h.ctaButton}</a>
        </div>
      </section>`;
  }

  // ----- SERVICES -----
  function renderServices() {
    const s = D.services;
    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="sec-head reveal">
          <span class="eyebrow">Services</span>
          <h2>${s.title}</h2>
          <p>${s.intro}</p>
        </div>
        <div class="grid grid-3">
          ${s.items.map((it,i)=>`
            <div class="card reveal reveal-delay-${(i%3)+1}">
              <div class="card-icon">${it.icon}</div>
              <h3>${it.title}</h3>
              <p>${it.text}</p>
              ${it.price ? `<div class="card-price">${it.price}</div>` : ""}
            </div>`).join("")}
        </div>
      </section>`;
  }

  // ----- ABOUT -----
  function renderAbout() {
    const a = D.about;
    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="hero-grid" style="align-items:start">
          <div class="reveal">
            <span class="eyebrow">About</span>
            <h1 style="margin:14px 0 24px">${a.title}</h1>
            <p class="muted" style="font-size:1.15rem;margin-bottom:20px">${a.intro}</p>
            <p>${a.story}</p>
          </div>
          <div class="hero-visual reveal reveal-delay-2"><img src="${a.image}" alt=""></div>
        </div>
      </section>

      <section class="section container">
        <div class="sec-head reveal"><span class="eyebrow">Values</span><h2>What we believe.</h2></div>
        <div class="grid grid-3">
          ${a.values.map((v,i)=>`
            <div class="card reveal reveal-delay-${(i%3)+1}">
              <div class="card-icon">✦</div>
              <h3>${v.title}</h3><p>${v.text}</p>
            </div>`).join("")}
        </div>
      </section>

      <section class="section container">
        <div class="sec-head reveal"><span class="eyebrow">Team</span><h2>The people behind it.</h2></div>
        <div class="grid grid-4">
          ${a.team.map((p,i)=>`
            <div class="team-card reveal reveal-delay-${(i%4)+1}">
              <img src="${p.image}" alt="${p.name}">
              <h4>${p.name}</h4><p>${p.role}</p>
            </div>`).join("")}
        </div>
      </section>`;
  }

  // ----- PORTFOLIO -----
  function renderPortfolio() {
    const p = D.portfolio;
    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="sec-head reveal">
          <span class="eyebrow">Work</span>
          <h2>${p.title}</h2><p>${p.intro}</p>
        </div>
        <div class="grid grid-3">
          ${p.items.map((it,i)=>`
            <a href="${it.link||'#'}" class="work-card reveal reveal-delay-${(i%3)+1}">
              <img src="${it.image}" alt="${it.title}">
              <div class="work-overlay">
                <span class="work-cat">${it.category}</span>
                <span class="work-title">${it.title}</span>
              </div>
            </a>`).join("")}
        </div>
      </section>`;
  }

  // ----- REVIEWS -----
  function renderReviews() {
    const r = D.reviews;
    const items = r.items.map((rv,i)=>`
      <div class="review reveal reveal-delay-${(i%3)+1}">
        <div class="stars">${"★".repeat(rv.rating)}${"☆".repeat(5-rv.rating)}</div>
        <p class="review-text">"${rv.text}"</p>
        <div class="review-author"><strong>${rv.name}</strong><span>${rv.company||""}</span></div>
      </div>`).join("");

    const submit = r.allowSubmissions ? `
      <section class="section container">
        <div class="sec-head reveal"><span class="eyebrow">Share your experience</span><h2>Leave a review</h2><p>Your review will appear after approval.</p></div>
        <form class="form reveal" id="reviewForm">
          <div class="field"><label>Name</label><input name="name" required></div>
          <div class="field"><label>Company (optional)</label><input name="company"></div>
          <div class="field"><label>Rating</label>
            <select name="rating" required>
              <option value="5">★★★★★ (5)</option><option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option><option value="2">★★☆☆☆ (2)</option><option value="1">★☆☆☆☆ (1)</option>
            </select>
          </div>
          <div class="field"><label>Your review</label><textarea name="text" required></textarea></div>
          <button class="btn btn-accent" type="submit">Submit review</button>
        </form>
      </section>` : "";

    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="sec-head reveal"><span class="eyebrow">Reviews</span><h2>${r.title}</h2><p>${r.intro}</p></div>
        <div class="grid grid-3">${items}</div>
      </section>${submit}`;

    const f = document.getElementById("reviewForm");
    if (f) f.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(f);
      window.SiteData.addPendingReview({
        name: fd.get("name"), company: fd.get("company"),
        rating: parseInt(fd.get("rating")), text: fd.get("text"),
      });
      f.reset();
      toast("Thanks! Your review is awaiting approval.");
    };
  }

  // ----- CONTACT -----
  function renderContact() {
    const c = D.contact;
    const fields = c.formFields.map(fd => {
      if (fd.type === "textarea") return `<div class="field"><label>${fd.label}</label><textarea name="${fd.name}" ${fd.required?"required":""}></textarea></div>`;
      if (fd.type === "select") return `<div class="field"><label>${fd.label}</label><select name="${fd.name}" ${fd.required?"required":""}>${(fd.options||[]).map(o=>`<option>${o}</option>`).join("")}</select></div>`;
      return `<div class="field"><label>${fd.label}</label><input type="${fd.type}" name="${fd.name}" ${fd.required?"required":""}></div>`;
    }).join("");

    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="sec-head reveal"><span class="eyebrow">Contact</span><h2>${c.title}</h2><p>${c.intro}</p></div>
        <div class="contact-grid">
          <form class="form reveal" id="contactForm">
            ${fields}
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <button class="btn btn-primary" type="submit">${c.submitLabel}</button>
              <a class="btn btn-ghost" href="https://wa.me/${D.contact.whatsapp}" target="_blank">WhatsApp us</a>
            </div>
          </form>
          <div class="contact-info reveal reveal-delay-1">
            <div class="info-row"><div class="info-icon">✉</div><div><strong>Email</strong><a href="mailto:${D.contact.email}">${D.contact.email}</a></div></div>
            <div class="info-row"><div class="info-icon">☎</div><div><strong>Phone</strong><a href="tel:${D.contact.phone}">${D.contact.phone}</a></div></div>
            <div class="info-row"><div class="info-icon">⌖</div><div><strong>Address</strong>${D.contact.address}</div></div>
            <div class="info-row"><div class="info-icon">◷</div><div><strong>Hours</strong>${D.contact.hours}</div></div>
            <iframe class="map" src="${D.contact.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>`;

    document.getElementById("contactForm").onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {}; fd.forEach((v,k)=>data[k]=v);
      window.SiteData.addSubmission(data);
      const lines = Object.entries(data).map(([k,v])=>`${k}: ${v}`).join("\n");
      if (c.submitMethod === "whatsapp") {
        window.open(`https://wa.me/${D.contact.whatsapp}?text=${encodeURIComponent(lines)}`, "_blank");
      } else {
        window.location.href = `mailto:${D.contact.email}?subject=${encodeURIComponent("New enquiry from "+(data.name||"site"))}&body=${encodeURIComponent(lines)}`;
      }
      e.target.reset();
      toast("Thanks! Opening your mail/WhatsApp…");
    };
  }

  // ----- CUSTOM PAGE -----
  function renderCustomPage() {
    const slug = document.body.dataset.slug;
    const page = D.customPages.find(p=>p.slug===slug);
    if (!page) { document.getElementById("page").innerHTML = `<section class="section container"><h1>Page not found</h1><p class="muted">No custom page with slug "${slug}".</p></section>`; return; }
    document.getElementById("page").innerHTML = `
      <section class="section container">
        <div class="prose reveal">
          <span class="eyebrow">${page.eyebrow||""}</span>
          <h1 style="margin:14px 0 28px">${page.title}</h1>
          ${(page.sections||[]).map(s=>`<h2>${s.heading||""}</h2><p>${s.text||""}</p>`).join("")}
        </div>
      </section>`;
  }

  // ----- TOAST + SCROLL REVEAL -----
  function toast(msg) {
    const t = document.createElement("div"); t.className="toast"; t.textContent = msg;
    document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add("show"));
    setTimeout(()=>{ t.classList.remove("show"); setTimeout(()=>t.remove(),400); }, 3000);
  }
  function initReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }

  // ----- BOOT -----
  const page = document.body.dataset.page;
  renderNav();
  ({
    home: renderHome, services: renderServices, about: renderAbout,
    portfolio: renderPortfolio, reviews: renderReviews, contact: renderContact,
    custom: renderCustomPage,
  }[page] || (()=>{}))();
  renderFooter();
  initReveal();
  // re-observe (content was injected after IO setup)
  setTimeout(initReveal, 50);
})();
