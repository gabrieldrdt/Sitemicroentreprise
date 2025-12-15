document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     CONFIG
  =============================== */
  const API = "https://gabriel-durand-touya.onrender.com/api";

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
     LOGIN ADMIN (POPUP FIX)
  =============================== */
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
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

    try {
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminLogged", "true");
        dashboard?.classList.remove("hidden");
        dashboardBtn?.classList.remove("hidden");
        loginModal?.classList.add("hidden");
        loginStatus.textContent = "";
      } else {
        loginStatus.textContent = data.message || "Accès refusé";
      }
    } catch {
      loginStatus.textContent = "Erreur serveur";
    }
  });

  if (localStorage.getItem("adminLogged") === "true") {
    dashboard?.classList.remove("hidden");
    dashboardBtn?.classList.remove("hidden");
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("adminLogged");
    dashboard?.classList.add("hidden");
    dashboardBtn?.classList.add("hidden");
    alert("Déconnecté");
  });

});
