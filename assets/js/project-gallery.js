// assets/js/project-gallery.js
// Interactive Project Gallery: filter + modal (tanpa library), aman dipanggil berkali-kali
(function () {
  if (window.__PPD_PROJECT_GALLERY__) return;
  window.__PPD_PROJECT_GALLERY__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  // Data project (sesuaikan dengan kartu yang sudah ada)
  const PROJECTS = [
    {
      title: "Website Portfolio",
      category: "Web",
      detail: "project-detail/project-portfolio.html",
      repo: "https://github.com/PlatformPortofolioDigital/Platform-Portofolio-Digital",
      demo: "https://platformportofoliodigital.github.io/Platform-Portofolio-Digital/"
    },
    {
      title: "Sistem Informasi Sederhana",
      category: "App",
      detail: "project-detail/project-si.html",
      repo: "https://github.com/mardatilla0203-dev/Platform-UMKM-Kue-Basah.git",
      demo: "https://mardatilla0203-dev.github.io/Platform-UMKM-Kue-Basah/"
    },
    {
      title: "UI Design Prototype",
      category: "Design",
      detail: "project-detail/project-ui.html",
      repo: "https://github.com/mardatilla0203-dev/prototipe-login.git",
      demo: "https://drive.google.com/drive/folders/1NLAZROixoG7DkpYmg7qWKbufBpgA5gux?usp=drive_link"
    }
  ];

  function getMetaByTitle(title) {
    const t = normalize(title);
    return PROJECTS.find(p => normalize(p.title) === t) || null;
  }

  function buildFilters(container, categories, onPick) {
    let wrap = $("#ppd-project-filters");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "ppd-project-filters";
      wrap.className = "ppd-filters";
      container.insertBefore(wrap, container.firstChild);
    }

    wrap.innerHTML = "";
    const all = ["All", ...categories];
    all.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ppd-filter-btn" + (idx === 0 ? " active" : "");
      btn.dataset.filter = c;
      btn.textContent = c;
      btn.addEventListener("click", () => {
        $$(".ppd-filter-btn", wrap).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        onPick(c);
      });
      wrap.appendChild(btn);
    });
  }

  function ensureModal() {
    let modal = $("#ppd-project-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "ppd-project-modal";
    modal.className = "ppd-modal";
    modal.innerHTML = `
      <div class="ppd-modal-backdrop" data-close="1"></div>
      <div class="ppd-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="ppdModalTitle">
        <button class="ppd-modal-close" type="button" aria-label="Close" data-close="1">×</button>
        <div class="ppd-modal-body">
          <h3 id="ppdModalTitle"></h3>
          <p id="ppdModalDesc"></p>
          <div class="ppd-modal-meta">
            <div><strong>Tech</strong>: <span id="ppdModalTech"></span></div>
            <div><strong>Role</strong>: <span id="ppdModalRole"></span></div>
            <div><strong>Category</strong>: <span id="ppdModalCat"></span></div>
          </div>
          <div class="ppd-modal-actions">
            <a id="ppdModalDetail" class="btn" target="_blank" rel="noopener">Detail</a>
            <a id="ppdModalRepo" class="btn-outline" target="_blank" rel="noopener">GitHub</a>
            <a id="ppdModalDemo" class="btn-outline" target="_blank" rel="noopener">Demo</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.classList.remove("open");
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });

    return modal;
  }

  function openModal(card) {
    const title = $("h4", card)?.textContent?.trim() || "Project";
    const desc = $(".project-desc", card)?.textContent?.trim() || "";
    const tech = $(".project-tech", card)?.textContent?.trim() || "-";
    const role = $(".project-role", card)?.textContent?.replace(/^Role:\s*/i, "")?.trim() || "-";

    const meta = getMetaByTitle(title);
    const cat = meta?.category || (card.dataset.category || "Other");

    const modal = ensureModal();
    $("#ppdModalTitle").textContent = title;
    $("#ppdModalDesc").textContent = desc;
    $("#ppdModalTech").textContent = tech;
    $("#ppdModalRole").textContent = role;
    $("#ppdModalCat").textContent = cat;

    const detail = $("#ppdModalDetail");
    const repo = $("#ppdModalRepo");
    const demo = $("#ppdModalDemo");

    detail.href = meta?.detail || "#";
    repo.href = meta?.repo || "#";
    demo.href = meta?.demo || "#";

    // kalau salah satu kosong, hide
    detail.style.display = detail.href.endsWith("#") ? "none" : "";
    repo.style.display = repo.href.endsWith("#") ? "none" : "";
    demo.style.display = demo.href.endsWith("#") ? "none" : "";

    modal.classList.add("open");
  }

  function init() {
    const preview = $(".project-preview");
    if (!preview) return;

    const cards = $$(".project-card", preview);
    if (!cards.length) return;

    // set data-category berdasarkan judul (biar HTML awal gak dirombak)
    cards.forEach((card) => {
      const title = $("h4", card)?.textContent?.trim() || "";
      const meta = getMetaByTitle(title);
      card.dataset.category = meta?.category || "Other";
      card.tabIndex = 0; // aksesibilitas
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open detail for ${title}`);
      card.addEventListener("click", () => openModal(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    const categories = [...new Set(cards.map(c => c.dataset.category))];
    buildFilters(preview.parentElement || preview, categories, (picked) => {
      const filter = picked === "All" ? "" : picked;
      cards.forEach((card) => {
        const show = !filter || card.dataset.category === filter;
        card.style.display = show ? "" : "none";
      });
      // update iframe height (kalau ada)
      try {
        const h = document.documentElement.scrollHeight;
        parent.postMessage({ type: "IFRAME_HEIGHT", height: h }, "*");
      } catch (_) {}
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
