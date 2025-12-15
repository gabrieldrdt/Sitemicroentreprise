document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CONFIG
  =============================== */
  const API = "/api";

  /* ===============================
     FOOTER YEAR
  =============================== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ===============================
     THEME LIGHT / DARK
  =============================== */
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

  /* ===============================
     VEILLE IA (BLOG)
  =============================== */
  const blogGrid = document.getElementById("blogGrid");
  const blogStatus = document.getElementById("blogStatus");

  async function loadBlog() {
    if (!blogGrid) return;

    try {
      blogStatus.textContent = "Chargement…";

      const res = await fetch(`${API}/blog.php`);
      const items = await res.json();

      blogGrid.innerHTML = "";

      if (!Array.isArray(items) || items.length === 0) {
        blogStatus.textContent = "Aucun article disponible.";
        return;
      }

      items.forEach(it => {
        blogGrid.innerHTML += `
          <article class="project-card blog-card">
            <span class="project-tag">Hugging Face</span>
            <h3>${it.title}</h3>
            <a class="btn btn-ghost btn-small" href="${it.link}" target="_blank" rel="noopener">
              Lire l’article
            </a>
          </article>
        `;
      });

      blogStatus.textContent = "";

    } catch (err) {
      console.error("Erreur blog :", err);
      blogStatus.textContent = "Erreur de chargement.";
    }
  }

  loadBlog();

  /* ===============================
     LOGIN ADMIN
  =============================== */
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginStatus = document.getElementById("loginStatus");
  const dashboard = document.getElementById("dashboard");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  adminLoginBtn?.addEventListener("click", () => loginModal.classList.remove("hidden"));
  closeModal?.addEventListener("click", () => loginModal.classList.add("hidden"));

  adminLoginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    loginStatus.textContent = "Connexion…";

    try {
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminLogged", "true");
        dashboard.classList.remove("hidden");
        dashboardBtn.classList.remove("hidden");
        loginModal.classList.add("hidden");
        loginStatus.textContent = "";
      } else {
        loginStatus.textContent = data.message || "Accès refusé";
      }
    } catch {
      loginStatus.textContent = "Erreur serveur";
    }
  });

  if (localStorage.getItem("adminLogged") === "true") {
    dashboard.classList.remove("hidden");
    dashboardBtn.classList.remove("hidden");
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("adminLogged");
    dashboard.classList.add("hidden");
    dashboardBtn.classList.add("hidden");
    alert("Déconnecté");
  });

});
