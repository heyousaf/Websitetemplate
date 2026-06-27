/* ============================================================
   MASTER DATA + STORAGE LAYER
   Every text/image/color below is an EXAMPLE placeholder.
   Open /admin.html (password: 12345678910) to edit everything.
   ============================================================ */

const DEFAULT_DATA = {
  meta: {
    siteName: "Example Company",
    tagline: "Example tagline — edit me in the admin panel",
    logoText: "EX.",
    logoImage: "",
    favicon: "",
    adminPassword: "12345678910",
    primaryColor: "#6d28d9",
    accentColor: "#f59e0b",
    bgColor: "#0b0b12",
    textColor: "#f5f5f7",
    mutedColor: "#9ca3af",
    cardColor: "#15151f",
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', sans-serif",
    radius: "16px",
  },
  contact: {
    email: "example@example.com",
    phone: "+1 555 000 0000",
    whatsapp: "15550000000",
    address: "Example Address, Example City (edit in admin)",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1700000000000",
    hours: "Example Hours · Mon – Fri · 9:00 – 18:00",
    socials: [
      { label: "Instagram", url: "https://instagram.com/example" },
      { label: "Twitter", url: "https://twitter.com/example" },
      { label: "LinkedIn", url: "https://linkedin.com/company/example" },
    ],
  },
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html" },
    { label: "Portfolio", href: "portfolio.html" },
    { label: "About", href: "about.html" },
    { label: "Reviews", href: "reviews.html" },
    { label: "Contact", href: "contact.html" },
  ],
  home: {
    heroEyebrow: "Example eyebrow · Established 20XX",
    heroTitle: "Example headline — edit this from the admin panel.",
    heroSubtitle:
      "Example subtitle text. Replace this with your own pitch from the admin dashboard. Every word, color, and image on this site is editable.",
    heroCtaPrimary: "Example primary button",
    heroCtaPrimaryHref: "portfolio.html",
    heroCtaSecondary: "Example secondary button",
    heroCtaSecondaryHref: "contact.html",
    heroImage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&q=80",
    stats: [
      { value: "100+", label: "Example stat one" },
      { value: "50", label: "Example stat two" },
      { value: "12", label: "Example stat three" },
      { value: "5 yrs", label: "Example stat four" },
    ],
    features: [
      { icon: "✦", title: "Example feature one", text: "Example description — edit in admin panel." },
      { icon: "◆", title: "Example feature two", text: "Example description — edit in admin panel." },
      { icon: "▲", title: "Example feature three", text: "Example description — edit in admin panel." },
      { icon: "●", title: "Example feature four", text: "Example description — edit in admin panel." },
    ],
    ctaTitle: "Example call to action title",
    ctaText: "Example CTA description text. Edit this from the admin panel.",
    ctaButton: "Example button",
    ctaHref: "contact.html",
  },
  about: {
    title: "About Example Company",
    intro:
      "Example intro paragraph. Replace this with your own story from the admin panel. Every section here is fully editable.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80",
    story:
      "Example story text. Tell your visitors who you are, what you do, and why it matters. Edit this from the admin panel under About / Team.",
    values: [
      { title: "Example value one", text: "Example value description — edit in admin." },
      { title: "Example value two", text: "Example value description — edit in admin." },
      { title: "Example value three", text: "Example value description — edit in admin." },
    ],
    team: [
      { name: "Example Person One", role: "Example Role", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
      { name: "Example Person Two", role: "Example Role", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
      { name: "Example Person Three", role: "Example Role", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
      { name: "Example Person Four", role: "Example Role", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    ],
  },
  services: {
    title: "Example services",
    intro: "Example intro — edit this from the admin panel.",
    items: [
      { icon: "✦", title: "Example service 1", text: "Example service description.", price: "From $XXX" },
      { icon: "◆", title: "Example service 2", text: "Example service description.", price: "From $XXX" },
      { icon: "▲", title: "Example service 3", text: "Example service description.", price: "From $XXX" },
      { icon: "●", title: "Example service 4", text: "Example service description.", price: "From $XXX" },
      { icon: "✕", title: "Example service 5", text: "Example service description.", price: "From $XXX" },
      { icon: "❖", title: "Example service 6", text: "Example service description.", price: "From $XXX" },
    ],
  },
  portfolio: {
    title: "Example portfolio",
    intro: "Example intro — replace with your work from the admin panel.",
    items: [
      { title: "Example Project 1", category: "Example Category", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80", link: "#" },
      { title: "Example Project 2", category: "Example Category", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80", link: "#" },
      { title: "Example Project 3", category: "Example Category", image: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=900&q=80", link: "#" },
      { title: "Example Project 4", category: "Example Category", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80", link: "#" },
      { title: "Example Project 5", category: "Example Category", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80", link: "#" },
      { title: "Example Project 6", category: "Example Category", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80", link: "#" },
    ],
  },
  reviews: {
    title: "Example reviews",
    intro: "Example reviews intro — edit from admin.",
    allowSubmissions: true,
    items: [
      { name: "Example Reviewer 1", company: "Example Company", rating: 5, text: "Example review text — replace this from the admin panel." },
      { name: "Example Reviewer 2", company: "Example Company", rating: 5, text: "Example review text — replace this from the admin panel." },
      { name: "Example Reviewer 3", company: "Example Company", rating: 4, text: "Example review text — replace this from the admin panel." },
    ],
  },
  contact: {
    title: "Example — Contact us",
    intro: "Example contact intro. Edit this from the admin panel. Form sends via mailto or WhatsApp (configurable in admin).",
    formFields: [
      { type: "text", label: "Your name", name: "name", required: true },
      { type: "email", label: "Email", name: "email", required: true },
      { type: "text", label: "Company (optional)", name: "company", required: false },
      { type: "select", label: "Budget", name: "budget", required: true, options: ["Example option 1", "Example option 2", "Example option 3", "Example option 4"] },
      { type: "textarea", label: "Your message", name: "message", required: true },
    ],
    submitMethod: "mailto",
    submitLabel: "Send message",
  },
  customPages: [],
  footer: {
    text: "© 20XX Example Company. All rights reserved. (Edit in admin panel.)",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
};

const STORAGE_KEY = "site_data_v1";
const SUBMISSIONS_KEY = "site_submissions_v1";
const PENDING_REVIEWS_KEY = "site_pending_reviews_v1";
const DRAFT_KEY = "site_data_draft_v1";

function deepMerge(target, source) {
  if (Array.isArray(source)) return source.slice();
  if (source && typeof source === "object") {
    const out = { ...target };
    for (const k of Object.keys(source)) {
      out[k] = k in target ? deepMerge(target[k], source[k]) : source[k];
    }
    return out;
  }
  return source === undefined ? target : source;
}

function loadData() {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft && window.__USE_DRAFT__) return JSON.parse(draft);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    return deepMerge(DEFAULT_DATA, JSON.parse(raw));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
function saveDraft(d) { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); }
function clearDraft() { localStorage.removeItem(DRAFT_KEY); }
function resetData() { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DRAFT_KEY); }

function getSubmissions() { try { return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]"); } catch { return []; } }
function addSubmission(s) { const arr = getSubmissions(); arr.unshift({ ...s, at: new Date().toISOString() }); localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(arr)); }
function clearSubmissions() { localStorage.removeItem(SUBMISSIONS_KEY); }

function getPendingReviews() { try { return JSON.parse(localStorage.getItem(PENDING_REVIEWS_KEY) || "[]"); } catch { return []; } }
function addPendingReview(r) { const arr = getPendingReviews(); arr.unshift({ ...r, at: new Date().toISOString() }); localStorage.setItem(PENDING_REVIEWS_KEY, JSON.stringify(arr)); }
function setPendingReviews(arr) { localStorage.setItem(PENDING_REVIEWS_KEY, JSON.stringify(arr)); }

window.SiteData = {
  DEFAULT_DATA, loadData, saveData, saveDraft, clearDraft, resetData,
  getSubmissions, addSubmission, clearSubmissions,
  getPendingReviews, addPendingReview, setPendingReviews,
  STORAGE_KEY, DRAFT_KEY,
};
