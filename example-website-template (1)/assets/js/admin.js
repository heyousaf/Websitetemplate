/* ============================================================
   ADMIN DASHBOARD LOGIC
   ============================================================ */
(function () {
  const S = window.SiteData;
  let data = S.loadData();
  let activeTab = "general";
  const SESSION_KEY = "admin_session_v1";

  // ---------- LOGIN ----------
  const loginView = document.getElementById("loginView");
  const appView = document.getElementById("appView");
  function showApp() {
    loginView.style.display = "none";
    appView.style.display = "grid";
    render();
  }
  if (sessionStorage.getItem(SESSION_KEY) === "1") showApp();

  document.getElementById("loginForm").onsubmit = e => {
    e.preventDefault();
    const pw = document.getElementById("pwInput").value;
    if (pw === (data.meta.adminPassword || "12345678910")) {
      sessionStorage.setItem(SESSION_KEY, "1");
      showApp();
    } else {
      document.getElementById("pwErr").style.display = "block";
    }
  };
  document.getElementById("logoutBtn").onclick = () => {
    sessionStorage.removeItem(SESSION_KEY); location.reload();
  };

  // ---------- HELPERS ----------
  const $ = sel => document.querySelector(sel);
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"), 2200);
  }
  function field(label, value, onChange, opts={}) {
    const id = "f_"+Math.random().toString(36).slice(2,8);
    const type = opts.type || "text";
    const input = type === "textarea"
      ? `<textarea id="${id}">${escapeHtml(value||"")}</textarea>`
      : type === "select"
      ? `<select id="${id}">${(opts.options||[]).map(o=>`<option ${o===value?"selected":""}>${o}</option>`).join("")}</select>`
      : `<input id="${id}" type="${type}" value="${escapeAttr(value||"")}">`;
    setTimeout(()=>{ const el = document.getElementById(id); if (el) el.addEventListener("input", e => onChange(e.target.value)); }, 0);
    return `<div class="field"><label>${label}</label>${input}</div>`;
  }
  function colorField(label, value, onChange) {
    const id = "c_"+Math.random().toString(36).slice(2,8);
    setTimeout(()=>{
      const ci=document.getElementById(id+"_c"), ti=document.getElementById(id+"_t");
      ci.oninput=e=>{ ti.value=e.target.value; onChange(e.target.value); };
      ti.oninput=e=>{ ci.value=e.target.value; onChange(e.target.value); };
    },0);
    return `<div class="field"><label>${label}</label><div class="color-row">
      <input type="color" id="${id}_c" value="${value}">
      <input type="text" id="${id}_t" value="${value}" style="flex:1">
    </div></div>`;
  }
  function imageField(label, value, onChange) {
    const id = "i_"+Math.random().toString(36).slice(2,8);
    setTimeout(()=>{
      const ti=document.getElementById(id+"_t"), fi=document.getElementById(id+"_f"), pv=document.getElementById(id+"_p");
      ti.oninput=e=>{ pv.src=e.target.value; onChange(e.target.value); };
      fi.onchange=e=>{
        const f=e.target.files[0]; if (!f) return;
        const r=new FileReader(); r.onload=()=>{ ti.value=r.result; pv.src=r.result; onChange(r.result); }; r.readAsDataURL(f);
      };
    },0);
    return `<div class="field"><label>${label}</label>
      <div class="img-pick">
        <img id="${id}_p" src="${value||""}" alt="">
        <div class="grow">
          <input id="${id}_t" type="text" value="${escapeAttr(value||"")}" placeholder="Image URL or upload…">
          <input id="${id}_f" type="file" accept="image/*" style="margin-top:8px;font-size:.85rem">
        </div>
      </div></div>`;
  }
  function escapeHtml(s){return String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
  function escapeAttr(s){return String(s).replace(/"/g,"&quot;");}

  function repeater(items, title, addLabel, makeNew, renderItem) {
    const wrap = document.createElement("div");
    function rerender(){
      wrap.innerHTML = items.map((it,i)=>`
        <div class="item" data-i="${i}">
          <div class="item-head">
            <strong>${title} #${i+1}</strong>
            <div class="item-actions">
              <button class="icon-btn" data-act="up" title="Move up">↑</button>
              <button class="icon-btn" data-act="down" title="Move down">↓</button>
              <button class="icon-btn danger" data-act="del" title="Delete">✕</button>
            </div>
          </div>
          <div data-body="${i}"></div>
        </div>`).join("") + `<button class="add-btn" data-act="add">+ ${addLabel}</button>`;
      items.forEach((it,i)=>{
        const body = wrap.querySelector(`[data-body="${i}"]`);
        body.innerHTML = renderItem(it, i);
        // wire input listeners after innerHTML
      });
      wrap.querySelectorAll(".item").forEach(el => {
        const i = +el.dataset.i;
        el.querySelector('[data-act="up"]').onclick = () => { if(i>0){[items[i-1],items[i]]=[items[i],items[i-1]];rerender();} };
        el.querySelector('[data-act="down"]').onclick = () => { if(i<items.length-1){[items[i+1],items[i]]=[items[i],items[i+1]];rerender();} };
        el.querySelector('[data-act="del"]').onclick = () => { if(confirm("Delete this item?")){items.splice(i,1);rerender();} };
      });
      wrap.querySelector('[data-act="add"]').onclick = () => { items.push(makeNew()); rerender(); };
    }
    rerender();
    return wrap;
  }

  // ---------- TABS ----------
  const TABS = {
    general: { title:"General settings", build: tabGeneral },
    theme: { title:"Theme, colors & fonts", build: tabTheme },
    nav: { title:"Navigation links", build: tabNav },
    home: { title:"Home page", build: tabHome },
    services: { title:"Services", build: tabServices },
    portfolio: { title:"Portfolio", build: tabPortfolio },
    about: { title:"About & Team", build: tabAbout },
    reviews: { title:"Reviews", build: tabReviews },
    contact: { title:"Contact & Form builder", build: tabContact },
    custom: { title:"Custom pages", build: tabCustom },
    footer: { title:"Footer", build: tabFooter },
    inbox: { title:"Form submissions", build: tabInbox },
    moderation: { title:"Review moderation", build: tabModeration },
    security: { title:"Admin password", build: tabSecurity },
    advanced: { title:"Backup, import & reset", build: tabAdvanced },
  };

  function render() {
    document.querySelectorAll(".nav-item[data-tab]").forEach(n => n.classList.toggle("active", n.dataset.tab===activeTab));
    $("#tabTitle").textContent = TABS[activeTab].title;
    const body = $("#tabBody"); body.innerHTML = "";
    body.appendChild(TABS[activeTab].build());
  }
  document.querySelectorAll(".nav-item[data-tab]").forEach(n =>
    n.onclick = () => { activeTab = n.dataset.tab; render(); window.scrollTo({top:0,behavior:"smooth"}); });

  // Live preview: save draft on any change
  function markDraft() { S.saveDraft(data); }
  // Wrap field-builder helpers to also call markDraft
  const origField=field, origColor=colorField, origImage=imageField;

  // ---------- TAB IMPLEMENTATIONS ----------
  function panel(title, desc, inner) {
    const p = document.createElement("div"); p.className="panel";
    p.innerHTML = `<h2>${title}</h2>${desc?`<p class="desc">${desc}</p>`:""}`;
    if (typeof inner === "string") p.insertAdjacentHTML("beforeend", inner);
    else p.appendChild(inner);
    return p;
  }

  function tabGeneral() {
    const m = data.meta;
    const wrap = document.createElement("div");
    const p = document.createElement("div"); p.className="panel";
    p.innerHTML = `<h2>Brand identity</h2><p class="desc">Site name, tagline and logo shown across every page.</p>`;
    p.insertAdjacentHTML("beforeend",
      field("Site name", m.siteName, v=>{m.siteName=v;markDraft();})
      + field("Tagline", m.tagline, v=>{m.tagline=v;markDraft();})
      + field("Logo text (used when no logo image)", m.logoText, v=>{m.logoText=v;markDraft();})
      + imageField("Logo image (optional)", m.logoImage, v=>{m.logoImage=v;markDraft();})
      + imageField("Favicon", m.favicon, v=>{m.favicon=v;markDraft();})
    );
    wrap.appendChild(p);
    wrap.appendChild(panel("Contact basics","Used on the contact page, footer, and CTAs.",
      field("Email", data.contact.email, v=>{data.contact.email=v;markDraft();}, {type:"email"})
      + field("Phone", data.contact.phone, v=>{data.contact.phone=v;markDraft();})
      + field("WhatsApp number (digits only, with country code)", data.contact.whatsapp, v=>{data.contact.whatsapp=v;markDraft();})
      + field("Address", data.contact.address, v=>{data.contact.address=v;markDraft();})
      + field("Business hours", data.contact.hours, v=>{data.contact.hours=v;markDraft();})
    ));
    return wrap;
  }

  function tabTheme() {
    const m = data.meta;
    const wrap = document.createElement("div");
    wrap.appendChild(panel("Colors","Every color updates everywhere instantly.","")).insertAdjacentHTML("beforeend","");
    const p1 = wrap.lastChild;
    p1.insertAdjacentHTML("beforeend",
      `<div class="row">`
      + colorField("Primary",m.primaryColor,v=>{m.primaryColor=v;markDraft();})
      + colorField("Accent",m.accentColor,v=>{m.accentColor=v;markDraft();})
      + colorField("Background",m.bgColor,v=>{m.bgColor=v;markDraft();})
      + colorField("Text",m.textColor,v=>{m.textColor=v;markDraft();})
      + colorField("Muted text",m.mutedColor,v=>{m.mutedColor=v;markDraft();})
      + colorField("Card background",m.cardColor,v=>{m.cardColor=v;markDraft();})
      + `</div>`
    );
    const FONTS = ["'Inter', sans-serif","'Space Grotesk', sans-serif","'Manrope', sans-serif","'Playfair Display', serif","'DM Serif Display', serif","system-ui, sans-serif","Georgia, serif"];
    wrap.appendChild(panel("Typography","Pick from web-safe fonts (already loaded).","")).insertAdjacentHTML("beforeend","");
    const p2 = wrap.lastChild;
    p2.insertAdjacentHTML("beforeend",`<div class="row">`
      + field("Heading font", m.fontHeading, v=>{m.fontHeading=v;markDraft();}, {type:"select", options:FONTS})
      + field("Body font", m.fontBody, v=>{m.fontBody=v;markDraft();}, {type:"select", options:FONTS})
      + `</div>`
      + field("Corner radius (e.g. 8px, 16px, 24px)", m.radius, v=>{m.radius=v;markDraft();})
    );
    return wrap;
  }

  function tabNav() {
    const wrap = document.createElement("div");
    wrap.appendChild(panel("Navigation links","Drag to reorder; delete to hide. Use file names like services.html or page.html?slug=faq.",""));
    const rep = repeater(data.nav, "Link", "Add link", ()=>({label:"New",href:"index.html"}),
      (it,i)=> field("Label", it.label, v=>{it.label=v;markDraft();})
            + field("Href", it.href, v=>{it.href=v;markDraft();})
    );
    wrap.lastChild.appendChild(rep);
    return wrap;
  }

  function tabHome() {
    const h = data.home;
    const wrap = document.createElement("div");
    const p = panel("Hero section","","");
    p.insertAdjacentHTML("beforeend",
      field("Eyebrow / small label", h.heroEyebrow, v=>{h.heroEyebrow=v;markDraft();})
      + field("Title", h.heroTitle, v=>{h.heroTitle=v;markDraft();}, {type:"textarea"})
      + field("Subtitle", h.heroSubtitle, v=>{h.heroSubtitle=v;markDraft();}, {type:"textarea"})
      + `<div class="row">`
      + field("Primary button text", h.heroCtaPrimary, v=>{h.heroCtaPrimary=v;markDraft();})
      + field("Primary button link", h.heroCtaPrimaryHref, v=>{h.heroCtaPrimaryHref=v;markDraft();})
      + field("Secondary button text", h.heroCtaSecondary, v=>{h.heroCtaSecondary=v;markDraft();})
      + field("Secondary button link", h.heroCtaSecondaryHref, v=>{h.heroCtaSecondaryHref=v;markDraft();})
      + `</div>`
      + imageField("Hero image", h.heroImage, v=>{h.heroImage=v;markDraft();})
    );
    wrap.appendChild(p);
    const ps = panel("Stats bar","",""); 
    ps.appendChild(repeater(h.stats,"Stat","Add stat",()=>({value:"0",label:"New"}),
      (it)=>`<div class="row">`+field("Value",it.value,v=>{it.value=v;markDraft();})+field("Label",it.label,v=>{it.label=v;markDraft();})+`</div>`));
    wrap.appendChild(ps);
    const pf = panel("Feature cards","",""); 
    pf.appendChild(repeater(h.features,"Feature","Add feature",()=>({icon:"✦",title:"New",text:""}),
      (it)=>field("Icon (1-2 chars or emoji)",it.icon,v=>{it.icon=v;markDraft();})
          +field("Title",it.title,v=>{it.title=v;markDraft();})
          +field("Text",it.text,v=>{it.text=v;markDraft();},{type:"textarea"})));
    wrap.appendChild(pf);
    const pc = panel("Bottom CTA band","","");
    pc.insertAdjacentHTML("beforeend",
      field("Title",h.ctaTitle,v=>{h.ctaTitle=v;markDraft();})
      + field("Text",h.ctaText,v=>{h.ctaText=v;markDraft();})
      + `<div class="row">`+field("Button",h.ctaButton,v=>{h.ctaButton=v;markDraft();})+field("Link",h.ctaHref,v=>{h.ctaHref=v;markDraft();})+`</div>`);
    wrap.appendChild(pc);
    return wrap;
  }

  function tabServices() {
    const s = data.services;
    const wrap = document.createElement("div");
    const p = panel("Section heading","","");
    p.insertAdjacentHTML("beforeend", field("Title",s.title,v=>{s.title=v;markDraft();})+field("Intro",s.intro,v=>{s.intro=v;markDraft();}));
    wrap.appendChild(p);
    const ps = panel("Service cards","Add as many as you need.","");
    ps.appendChild(repeater(s.items,"Service","Add service",()=>({icon:"✦",title:"New service",text:"",price:""}),
      (it)=>`<div class="row">`+field("Icon",it.icon,v=>{it.icon=v;markDraft();})+field("Title",it.title,v=>{it.title=v;markDraft();})+`</div>`
          +field("Description",it.text,v=>{it.text=v;markDraft();},{type:"textarea"})
          +field("Price (optional)",it.price,v=>{it.price=v;markDraft();})));
    wrap.appendChild(ps);
    return wrap;
  }

  function tabPortfolio() {
    const p = data.portfolio;
    const wrap = document.createElement("div");
    const ph = panel("Section heading","","");
    ph.insertAdjacentHTML("beforeend", field("Title",p.title,v=>{p.title=v;markDraft();})+field("Intro",p.intro,v=>{p.intro=v;markDraft();}));
    wrap.appendChild(ph);
    const pi = panel("Portfolio cards","Cards exist as templates — clients just replace image, title and category.","");
    pi.appendChild(repeater(p.items,"Project","Add project",()=>({title:"New project",category:"Category",image:"",link:"#"}),
      (it)=>`<div class="row">`+field("Title",it.title,v=>{it.title=v;markDraft();})+field("Category",it.category,v=>{it.category=v;markDraft();})+`</div>`
          + imageField("Image",it.image,v=>{it.image=v;markDraft();})
          + field("Link (optional)",it.link,v=>{it.link=v;markDraft();})));
    wrap.appendChild(pi);
    return wrap;
  }

  function tabAbout() {
    const a = data.about;
    const wrap = document.createElement("div");
    const p1 = panel("About content","","");
    p1.insertAdjacentHTML("beforeend",
      field("Title",a.title,v=>{a.title=v;markDraft();})
      + field("Intro paragraph",a.intro,v=>{a.intro=v;markDraft();},{type:"textarea"})
      + field("Story paragraph",a.story,v=>{a.story=v;markDraft();},{type:"textarea"})
      + imageField("About image",a.image,v=>{a.image=v;markDraft();}));
    wrap.appendChild(p1);
    const p2 = panel("Values","","");
    p2.appendChild(repeater(a.values,"Value","Add value",()=>({title:"New",text:""}),
      (it)=>field("Title",it.title,v=>{it.title=v;markDraft();})+field("Text",it.text,v=>{it.text=v;markDraft();})));
    wrap.appendChild(p2);
    const p3 = panel("Team members","","");
    p3.appendChild(repeater(a.team,"Member","Add member",()=>({name:"New",role:"",image:""}),
      (it)=>`<div class="row">`+field("Name",it.name,v=>{it.name=v;markDraft();})+field("Role",it.role,v=>{it.role=v;markDraft();})+`</div>`
          + imageField("Photo",it.image,v=>{it.image=v;markDraft();})));
    wrap.appendChild(p3);
    return wrap;
  }

  function tabReviews() {
    const r = data.reviews;
    const wrap = document.createElement("div");
    const p = panel("Section heading","","");
    p.insertAdjacentHTML("beforeend", field("Title",r.title,v=>{r.title=v;markDraft();})+field("Intro",r.intro,v=>{r.intro=v;markDraft();}));
    const id="al_"+Math.random().toString(36).slice(2,8);
    p.insertAdjacentHTML("beforeend",`<div class="field"><label><input type="checkbox" id="${id}" ${r.allowSubmissions?"checked":""}> Allow visitors to submit reviews (requires moderation)</label></div>`);
    setTimeout(()=>{ document.getElementById(id).onchange=e=>{r.allowSubmissions=e.target.checked;markDraft();}; },0);
    wrap.appendChild(p);
    const pi = panel("Live reviews","","");
    pi.appendChild(repeater(r.items,"Review","Add review",()=>({name:"New",company:"",rating:5,text:""}),
      (it)=>`<div class="row">`+field("Name",it.name,v=>{it.name=v;markDraft();})+field("Company",it.company,v=>{it.company=v;markDraft();})+`</div>`
          +field("Rating (1-5)",String(it.rating),v=>{it.rating=Math.max(1,Math.min(5,parseInt(v)||5));markDraft();},{type:"select",options:["1","2","3","4","5"]})
          +field("Review text",it.text,v=>{it.text=v;markDraft();},{type:"textarea"})));
    wrap.appendChild(pi);
    return wrap;
  }

  function tabContact() {
    const c = data.contact;
    const wrap = document.createElement("div");
    const p = panel("Page heading","","");
    p.insertAdjacentHTML("beforeend", field("Title",c.title,v=>{c.title=v;markDraft();})+field("Intro",c.intro,v=>{c.intro=v;markDraft();}));
    wrap.appendChild(p);
    const pm = panel("Map","Paste any Google Maps embed URL.","");
    pm.insertAdjacentHTML("beforeend", field("Google Maps embed URL", c.mapEmbed, v=>{c.mapEmbed=v;markDraft();}, {type:"textarea"}));
    wrap.appendChild(pm);
    const ps = panel("Socials","","");
    ps.appendChild(repeater(data.contact.socials,"Social","Add social",()=>({label:"New",url:""}),
      (it)=>`<div class="row">`+field("Label",it.label,v=>{it.label=v;markDraft();})+field("URL",it.url,v=>{it.url=v;markDraft();})+`</div>`));
    wrap.appendChild(ps);
    const pf = panel("Form builder","Add/remove/reorder form fields. Choose where submissions are sent.","");
    pf.insertAdjacentHTML("beforeend",
      field("Send via", c.submitMethod, v=>{c.submitMethod=v;markDraft();}, {type:"select",options:["mailto","whatsapp"]})
      + field("Submit button label", c.submitLabel, v=>{c.submitLabel=v;markDraft();}));
    pf.appendChild(repeater(c.formFields,"Field","Add field",()=>({type:"text",label:"New field",name:"field"+(c.formFields.length+1),required:false}),
      (it,i)=>`<div class="row-3">`
          +field("Label",it.label,v=>{it.label=v;markDraft();})
          +field("Name (internal)",it.name,v=>{it.name=v.replace(/[^a-zA-Z0-9_]/g,"");markDraft();})
          +field("Type",it.type,v=>{it.type=v;markDraft();},{type:"select",options:["text","email","tel","textarea","select"]})
          +`</div>`
          + (it.type==="select" ? field("Options (comma separated)", (it.options||[]).join(", "), v=>{it.options=v.split(",").map(s=>s.trim()).filter(Boolean);markDraft();}) : "")
          + (()=>{ const id="rq_"+i+"_"+Math.random().toString(36).slice(2,5);
                  setTimeout(()=>{ const el=document.getElementById(id); if(el) el.onchange=e=>{it.required=e.target.checked;markDraft();}; },0);
                  return `<div class="field"><label><input type="checkbox" id="${id}" ${it.required?"checked":""}> Required</label></div>`; })()
    ));
    wrap.appendChild(pf);
    return wrap;
  }

  function tabCustom() {
    const wrap = document.createElement("div");
    wrap.appendChild(panel("Custom pages",
      `Create extra pages. They live at <code>page.html?slug=YOUR-SLUG</code> — add a nav link to them in <b>Navigation</b>.`,""));
    const rep = repeater(data.customPages, "Page", "Add page",
      ()=>({slug:"new-"+Math.random().toString(36).slice(2,5),title:"New page",eyebrow:"",sections:[{heading:"Heading",text:"Some text"}]}),
      (it)=>{
        const sub = document.createElement("div");
        sub.innerHTML = `<div class="row">`
          + field("Slug (URL)", it.slug, v=>{it.slug=v.replace(/[^a-z0-9-]/gi,"-").toLowerCase();markDraft();})
          + field("Title", it.title, v=>{it.title=v;markDraft();})
          + `</div>`
          + field("Eyebrow", it.eyebrow||"", v=>{it.eyebrow=v;markDraft();});
        const secWrap = document.createElement("div");
        it.sections = it.sections || [];
        secWrap.appendChild(repeater(it.sections,"Section","Add section",()=>({heading:"New",text:""}),
          (s)=>field("Heading",s.heading,v=>{s.heading=v;markDraft();})+field("Text",s.text,v=>{s.text=v;markDraft();},{type:"textarea"})));
        sub.appendChild(secWrap);
        return sub.innerHTML; // repeater expects HTML string
      });
    // Above renderItem returns HTML; but we used innerHTML of sub which loses listeners on sections.
    // For nested repeaters, render directly into DOM instead:
    wrap.lastChild.innerHTML = ""; // wipe; build manually
    const list = document.createElement("div");
    function rerender() {
      list.innerHTML = "";
      data.customPages.forEach((it, i) => {
        const item = document.createElement("div"); item.className="item";
        item.innerHTML = `<div class="item-head"><strong>Page #${i+1} — ${escapeHtml(it.title)}</strong>
          <div class="item-actions">
            <button class="icon-btn danger" data-del>✕</button>
          </div></div>`;
        item.insertAdjacentHTML("beforeend",
          `<div class="row">`
          + field("Slug (URL)", it.slug, v=>{it.slug=v.replace(/[^a-z0-9-]/gi,"-").toLowerCase();markDraft();})
          + field("Title", it.title, v=>{it.title=v;markDraft();})
          + `</div>`
          + field("Eyebrow", it.eyebrow||"", v=>{it.eyebrow=v;markDraft();}));
        const secHeader = document.createElement("div");
        secHeader.innerHTML = `<label style="font-size:.82rem;color:var(--muted);font-weight:500;display:block;margin:8px 0">Sections</label>`;
        item.appendChild(secHeader);
        it.sections = it.sections || [];
        item.appendChild(repeater(it.sections,"Section","Add section",()=>({heading:"New",text:""}),
          (s)=>field("Heading",s.heading,v=>{s.heading=v;markDraft();})+field("Text",s.text,v=>{s.text=v;markDraft();},{type:"textarea"})));
        item.querySelector("[data-del]").onclick = () => { if(confirm("Delete this page?")){ data.customPages.splice(i,1); markDraft(); rerender(); } };
        list.appendChild(item);
      });
      const add = document.createElement("button"); add.className="add-btn"; add.textContent="+ Add page";
      add.onclick = () => { data.customPages.push({slug:"new-"+Math.random().toString(36).slice(2,5),title:"New page",eyebrow:"",sections:[{heading:"Heading",text:""}]}); markDraft(); rerender(); };
      list.appendChild(add);
    }
    rerender();
    wrap.lastChild.appendChild(list);
    return wrap;
  }

  function tabFooter() {
    const f = data.footer;
    const wrap = document.createElement("div");
    const p = panel("Footer content","","");
    p.insertAdjacentHTML("beforeend", field("Footer text", f.text, v=>{f.text=v;markDraft();}));
    wrap.appendChild(p);
    const pl = panel("Footer links","","");
    pl.appendChild(repeater(f.links,"Link","Add link",()=>({label:"New",href:"#"}),
      (it)=>`<div class="row">`+field("Label",it.label,v=>{it.label=v;markDraft();})+field("Href",it.href,v=>{it.href=v;markDraft();})+`</div>`));
    wrap.appendChild(pl);
    return wrap;
  }

  function tabInbox() {
    const wrap = document.createElement("div");
    const subs = S.getSubmissions();
    const p = panel(`Form submissions (${subs.length})`,"Saved locally in this browser whenever someone submits the contact form.","");
    if (!subs.length) p.insertAdjacentHTML("beforeend",`<div class="empty">No submissions yet.</div>`);
    else {
      subs.forEach((s,i)=>{
        const div = document.createElement("div"); div.className="item";
        div.innerHTML = `<div class="item-head">
          <strong>${escapeHtml(s.name||"Anonymous")} <span class="badge">${new Date(s.at).toLocaleString()}</span></strong>
          <div class="item-actions"><button class="icon-btn danger" data-del>✕</button></div>
        </div>
        <pre style="white-space:pre-wrap;font:inherit;color:var(--muted);font-size:.9rem">${escapeHtml(Object.entries(s).filter(([k])=>k!=="at").map(([k,v])=>k+": "+v).join("\n"))}</pre>`;
        div.querySelector("[data-del]").onclick = () => {
          const arr = S.getSubmissions(); arr.splice(i,1); localStorage.setItem("site_submissions_v1", JSON.stringify(arr)); render();
        };
        p.appendChild(div);
      });
      const clr = document.createElement("button"); clr.className="btn btn-danger"; clr.textContent="Clear all"; clr.style.marginTop="12px";
      clr.onclick = () => { if(confirm("Delete all submissions?")){ S.clearSubmissions(); render(); } };
      p.appendChild(clr);
    }
    wrap.appendChild(p);
    return wrap;
  }

  function tabModeration() {
    const wrap = document.createElement("div");
    const pending = S.getPendingReviews();
    const p = panel(`Pending reviews (${pending.length})`,"Approve to publish on the Reviews page.","");
    if (!pending.length) p.insertAdjacentHTML("beforeend",`<div class="empty">No pending reviews.</div>`);
    else pending.forEach((rv,i)=>{
      const div = document.createElement("div"); div.className="item";
      div.innerHTML = `<div class="item-head">
        <strong>${escapeHtml(rv.name)} ${rv.company?`<span class="badge">${escapeHtml(rv.company)}</span>`:""} <span class="badge">${"★".repeat(rv.rating)}</span></strong>
        <div class="item-actions">
          <button class="icon-btn" data-act="approve" title="Approve" style="color:var(--good);border-color:var(--good)">✓</button>
          <button class="icon-btn danger" data-act="reject">✕</button>
        </div>
      </div><p style="color:var(--muted)">${escapeHtml(rv.text)}</p>`;
      div.querySelector('[data-act="approve"]').onclick = () => {
        data.reviews.items.unshift({name:rv.name,company:rv.company,rating:rv.rating,text:rv.text});
        const arr = S.getPendingReviews(); arr.splice(i,1); S.setPendingReviews(arr);
        S.saveData(data); markDraft(); toast("Approved & published."); render();
      };
      div.querySelector('[data-act="reject"]').onclick = () => {
        const arr = S.getPendingReviews(); arr.splice(i,1); S.setPendingReviews(arr); render();
      };
      p.appendChild(div);
    });
    wrap.appendChild(p);
    return wrap;
  }

  function tabSecurity() {
    const wrap = document.createElement("div");
    const p = panel("Change admin password","Used to access this dashboard. Min 6 characters.","");
    p.insertAdjacentHTML("beforeend",
      field("New password", data.meta.adminPassword, v=>{ if(v.length>=6){data.meta.adminPassword=v;markDraft();} })
      + `<p class="desc" style="margin:0">Default password: <b>12345678910</b></p>`);
    wrap.appendChild(p);
    return wrap;
  }

  function tabAdvanced() {
    const wrap = document.createElement("div");
    const p = panel("Backup / Export","Download a JSON file with all settings, content and reviews. Keep this as your master copy.","");
    const exp = document.createElement("button"); exp.className="btn btn-primary"; exp.textContent="Download backup (.json)";
    exp.onclick = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `site-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    };
    p.appendChild(exp);
    wrap.appendChild(p);

    const p2 = panel("Import","Restore a backup. Overwrites everything.","");
    const imp = document.createElement("input"); imp.type="file"; imp.accept="application/json";
    imp.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = () => {
        try { data = JSON.parse(r.result); S.saveData(data); markDraft(); toast("Imported. Reloading…"); setTimeout(()=>location.reload(),800); }
        catch { toast("Invalid backup file."); }
      }; r.readAsText(f);
    };
    p2.appendChild(imp);
    wrap.appendChild(p2);

    const p3 = panel("Reset to template defaults","Erases all content & customizations. Cannot be undone.","");
    const rs = document.createElement("button"); rs.className="btn btn-danger"; rs.textContent="Reset everything";
    rs.onclick = () => {
      if (confirm("Reset ALL site content to defaults?")) {
        S.resetData(); data = S.loadData(); toast("Reset complete."); render();
      }
    };
    p3.appendChild(rs);
    wrap.appendChild(p3);
    return wrap;
  }

  // ---------- SAVE / PREVIEW / DISCARD ----------
  function save() { S.saveData(data); S.clearDraft(); toast("Saved & published ✓"); }
  document.getElementById("saveBtn").onclick = save;
  document.getElementById("saveBtn2").onclick = save;
  document.getElementById("discardBtn").onclick = () => {
    if (confirm("Discard unsaved changes?")) { S.clearDraft(); data = S.loadData(); render(); toast("Discarded."); }
  };
  function openPreview() {
    // Public site reads draft from localStorage when window.__USE_DRAFT__ flag set; simpler: just open and rely on saved data,
    // but we also support draft preview by setting a query flag the public site can detect.
    window.open("index.html", "_blank");
  }
  document.getElementById("previewBtn").onclick = openPreview;
  document.getElementById("previewBtn2").onclick = openPreview;
})();
