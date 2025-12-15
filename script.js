document.addEventListener("DOMContentLoaded", () => {
  console.log("script chargé");

  /* =========================================================
     CONFIG API
  ========================================================= */
  const API = "/api";

  /* =========================================================
     ANNÉE FOOTER
  ========================================================= */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* =========================================================
     THÈME LIGHT / DARK
  ========================================================= */
  const themeSwitch = document.getElementById("themeSwitch");
  const root = document.documentElement;

  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light");
    themeSwitch && (themeSwitch.checked = true);
  }

  themeSwitch?.addEventListener("change", () => {
    root.classList.toggle("light", themeSwitch.checked);
    localStorage.setItem("theme", themeSwitch.checked ? "light" : "dark");
  });

  /* =========================================================
     VEILLE IA (BLOG)
  ========================================================= */
  const blogGrid = document.getElementById("blogGrid");
  const blogStatus = document.getElementById("blogStatus");

  async function loadBlog() {
    if (!blogGrid) return;

    try {
      blogStatus && (blogStatus.textContent = "Chargement…");

      const res = await fetch(`${API}/blog.php`);
      const items = await res.json();

      blogGrid.innerHTML = "";

      if (!Array.isArray(items) || items.length === 0) {
        blogStatus && (blogStatus.textContent = "Aucun article disponible.");
        return;
      }

      items.forEach(it => {
        const card = document.createElement("article");
        card.className = "project-card blog-card";
        card.innerHTML = `
          <span class="project-tag">Hugging Face</span>
          <h3>${it.title}</h3>
          <a class="btn btn-ghost btn-small" href="${it.link}" target="_blank">
            Lire l’article
          </a>
        `;
        blogGrid.appendChild(card);
      });

      blogStatus && (blogStatus.textContent = "");

    } catch (err) {
      console.error("Erreur blog :", err);
      blogStatus && (blogStatus.textContent = "Erreur de chargement.");
    }
  }

  loadBlog();

  /* =========================================================
     LOGIN ADMIN
  ========================================================= */
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginStatus = document.getElementById("loginStatus");
  const dashboardSection = document.getElementById("dashboard");
  const logoutBtn = document.getElementById("logoutBtn");

  adminLoginBtn?.addEventListener("click", () => {
    loginModal?.classList.remove("hidden");
  });

  closeModal?.addEventListener("click", () => {
    loginModal?.classList.add("hidden");
    loginStatus.textContent = "";
  });

  adminLoginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminLogged", "true");
        dashboardSection?.classList.remove("hidden");
        loginModal?.classList.add("hidden");
      } else {
        loginStatus.textContent = "Identifiants incorrects";
      }
    } catch {
      loginStatus.textContent = "Erreur serveur";
    }
  });

  if (localStorage.getItem("adminLogged") === "true") {
    dashboardSection?.classList.remove("hidden");
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("adminLogged");
    dashboardSection?.classList.add("hidden");
    alert("Déconnecté");
  });
});
