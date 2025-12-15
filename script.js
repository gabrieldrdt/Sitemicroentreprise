document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CONFIG
  =============================== */
  // CORRECTION : Utiliser le bon domaine
  const API = "https://gabriel-dev-web.com/api";
  
  // OU si vous hébergez l'API ailleurs, utilisez :
  // const API = "https://votre-backend.onrender.com/api";

  /* ===============================
     FOOTER YEAR
  =============================== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ===============================
     THEME LIGHT / DARK (FIX FINAL)
  =============================== */
  const themeSwitch = document.getElementById("themeSwitch");
  const root = document.documentElement;

  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light");
    if (themeSwitch) themeSwitch.checked = true;
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
      blogStatus.textContent = "Chargement des articles…";

      const res = await fetch(`${API}/blog.php?limit=6`);
      const data = await res.json();

      if (!data.success || !Array.isArray(data.items)) {
        blogStatus.textContent = "Impossible de charger les articles.";
        return;
      }

      blogGrid.innerHTML = "";

      data.items.forEach(it => {
        const date = it.date
          ? new Date(it.date).toLocaleDateString("fr-FR")
          : "";

        blogGrid.innerHTML += `
          <article class="project-card blog-card">
            <span class="project-tag">
              ${it.source}${date ? " • " + date : ""}
            </span>
            <h3>${it.title}</h3>
            <p>${it.summary}</p>
            <a class="btn btn-ghost btn-small"
               href="${it.url}"
               target="_blank"
               rel="noopener noreferrer">
              Lire l'article
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
     LOGIN ADMIN (POPUP FIX)
  =============================== */
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginStatus = document.getElementById("loginStatus");
  const dashboard = document.getElementById("dashboard");
  const dashboardBtn = document.getElementById("dashboardBtn");
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

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    loginStatus.textContent = "Connexion…";
    loginStatus.className = "";

    try {
      console.log("Tentative de connexion à:", `${API}/login.php`);
      
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      console.log("Status de la réponse:", res.status);
      
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log("Réponse:", data);

      if (data.success) {
        localStorage.setItem("adminLogged", "true");
        dashboard?.classList.remove("hidden");
        dashboardBtn?.classList.remove("hidden");
        loginModal?.classList.add("hidden");
        loginStatus.textContent = "";
        adminLoginForm.reset();
        
        // Charger les stats après connexion
        loadStats();
      } else {
        loginStatus.textContent = data.message || "Accès refusé";
        loginStatus.className = "error";
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      loginStatus.textContent = "Erreur serveur - Vérifiez la console (F12)";
      loginStatus.className = "error";
    }
  });

  if (localStorage.getItem("adminLogged") === "true") {
    dashboard?.classList.remove("hidden");
    dashboardBtn?.classList.remove("hidden");
    loadStats();
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("adminLogged");
    dashboard?.classList.add("hidden");
    dashboardBtn?.classList.add("hidden");
    alert("Déconnecté");
  });

  /* ===============================
     LOAD STATS (Dashboard)
  =============================== */
  async function loadStats() {
    try {
      // Stats SQLite
      const statsRes = await fetch(`${API}/stats.php`);
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        document.getElementById("statVisitors").textContent = statsData.stats.visitors || 0;
        document.getElementById("statViews").textContent = statsData.stats.views || 0;
        document.getElementById("statForms").textContent = statsData.stats.forms || 0;
      }

      // Stats GA4 (optionnel)
      const gaRes = await fetch(`${API}/analitycs.php?days=30`);
      const gaData = await gaRes.json();
      
      if (gaData.success) {
        document.getElementById("statGaUsers").textContent = gaData.metrics.activeUsers || 0;
        document.getElementById("statGaSessions").textContent = gaData.metrics.sessions || 0;
        document.getElementById("statGaViews").textContent = gaData.metrics.screenPageViews || 0;
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  }

});