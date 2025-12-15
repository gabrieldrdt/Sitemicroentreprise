document.addEventListener("DOMContentLoaded", () => {

  // =========================================================================
  // IDENTIFIANTS EMAILJS (FINAL)
  // =========================================================================
  const EMAILJS_PUBLIC_KEY = "Y3AsrL_V0Gt9d6ea4"; 
  const SERVICE_ID = "service_v5me3zv"; 
  const TEMPLATE_ID = "template_rultwzc"; 

  
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY.length > 0) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
  } else if (typeof emailjs !== 'undefined') {
      console.warn("EmailJS est chargé, mais la clé publique n'est pas configurée dans script.js.");
  } else {
      console.error("EmailJS SDK non chargé. Vérifiez l'inclusion dans index.html.");
  }


  /* -----------------------------------------
     MODALE OFFRE DE LANCEMENT (AU CLIC)
  ------------------------------------------*/
  const launchModal = document.getElementById('launchModal');
  const openLaunchOfferBtn = document.getElementById('openLaunchOffer');
  const closeLaunchModalBtn = document.getElementById('closeLaunchModal');
  const acceptLaunchOfferLink = document.getElementById('acceptLaunchOffer');

  const hideLaunchModal = () => {
    if (launchModal) {
        launchModal.classList.add('hidden');
    }
  };

  // 1. Ouvre la modale au clic
  if (openLaunchOfferBtn && launchModal) {
    openLaunchOfferBtn.addEventListener('click', () => {
        launchModal.classList.remove('hidden');
    });
  }

  // 2. Fermeture via les boutons (Correction: devrait maintenant fonctionner)
  closeLaunchModalBtn?.addEventListener('click', hideLaunchModal);
  acceptLaunchOfferLink?.addEventListener('click', hideLaunchModal);


  /* -----------------------------------------
     ANNÉE FOOTER
  ------------------------------------------*/
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  /* -----------------------------------------
     THÈME LIGHT / DARK
  ------------------------------------------*/
  const themeSwitch = document.getElementById("themeSwitch");
  const root = document.documentElement;

  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light");
    if (themeSwitch) themeSwitch.checked = true;
  }

  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const isLight = themeSwitch.checked;
      root.classList.toggle("light", isLight);
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }


  /* -----------------------------------------
     MENU MOBILE
  ------------------------------------------*/
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    // Fermeture du menu lorsque l'on clique sur un lien (pour UX mobile)
    navLinks.querySelectorAll('a[href^="#"]').forEach((l) => {
      l.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }


  /* -----------------------------------------
     SCROLL SMOOTH
  ------------------------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    });
  });


  /* -----------------------------------------
     FORMULAIRE CONTACT (EMAILJS)
  ------------------------------------------*/
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && typeof emailjs !== 'undefined') {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Vérification des identifiants (double sécurité)
      if (EMAILJS_PUBLIC_KEY === "VOTRE_PUBLIC_KEY" || SERVICE_ID === "VOTRE_SERVICE_ID" || TEMPLATE_ID === "VOTRE_TEMPLATE_ID") {
          formStatus.textContent = "Erreur: Identifiants EmailJS manquants ou incorrects ❌";
          formStatus.style.color = "salmon";
          return;
      }

      formStatus.textContent = "Envoi en cours...";
      formStatus.style.color = "var(--accent)";

      // Récupération des données du formulaire (DOIVENT matcher les variables du Template EmailJS)
      const templateParams = {
          from_name: document.getElementById("name").value,
          from_email: document.getElementById("email").value,
          project_type: document.getElementById("projectType").value,
          budget: document.getElementById("budget").value,
          message: document.getElementById("message").value
      };

      try {
        const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

        if (res.status === 200) {
          formStatus.textContent = "Message envoyé avec succès ! ✔️";
          formStatus.style.color = "lightgreen";
          contactForm.reset();
        } else {
          throw new Error("Erreur de statut EmailJS: " + res.text);
        }

      } catch (err) {
        console.error("Erreur d'envoi EmailJS:", err);
        formStatus.textContent = "Échec de l'envoi ❌. (Vérifiez les IDs et votre clé publique)";
        formStatus.style.color = "salmon";
      }

      setTimeout(() => formStatus.textContent = "", 6000);
    });
  } else if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
          e.preventDefault();
          formStatus.textContent = "Erreur: EmailJS n'est pas chargé (vérifiez index.html)";
          formStatus.style.color = "salmon";
      });
  }

  /* -----------------------------------------
     LOGIQUE DU DASHBOARD ADMIN (conservée)
  ------------------------------------------*/
  const API = "https://gabriel-durand-touya.onrender.com/api";

  /* -----------------------------------------
     BLOG IA (RSS -> API)
  ------------------------------------------*/
  const blogGrid = document.getElementById("blogGrid");
  const blogStatus = document.getElementById("blogStatus");

  async function loadBlog() {
    if (!blogGrid) return;
    try {
      if (blogStatus) blogStatus.textContent = "Chargement des articles…";
      const res = await fetch(`${API}/blog.php?limit=6`);
      const data = await res.json();

      if (!data.success) {
        if (blogStatus) blogStatus.textContent = data.message || "Impossible de charger le blog.";
        return;
      }

      blogGrid.innerHTML = (data.items || []).map((it) => {
        const date = it.date ? new Date(it.date).toLocaleDateString("fr-FR") : "";
        const safeTitle = (it.title || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeSummary = (it.summary || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeUrl = it.url || "#";
        const safeSource = (it.source || "Source").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        return `
          <article class="project-card blog-card">
            <span class="project-tag">${safeSource}${date ? " • " + date : ""}</span>
            <h3>${safeTitle}</h3>
            <p>${safeSummary}</p>
            <a class="btn btn-ghost btn-small" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Lire l’article</a>
          </article>
        `;
      }).join("");

      if (blogStatus) blogStatus.textContent = "";
    } catch (err) {
      console.error("Erreur blog:", err);
      if (blogStatus) blogStatus.textContent = "Erreur lors du chargement des articles.";
    }
  }

  loadBlog();


  const statVisitors = document.getElementById("statVisitors");
  const statViews = document.getElementById("statViews");
  
  async function loadStats() {
    try {
      const res = await fetch(`${API}/stats.php`);
      const data = await res.json();

      if (data.success && data.stats) {
        if (statVisitors) statVisitors.textContent = data.stats.visitors;
        if (statViews) statViews.textContent = data.stats.views;
        const statFormsElement = document.getElementById("statForms");
        if (statFormsElement) statFormsElement.textContent = data.stats.forms;
      }
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  }

  if (localStorage.getItem("adminLogged") === "true") {
       loadStats();
  }


<<<<<<< HEAD
=======
  /* -----------------------------------------
     ANALYTICS GA4 (optionnel)
  ------------------------------------------*/
  const gaUsersEl = document.getElementById("statGaUsers");
  const gaSessionsEl = document.getElementById("statGaSessions");
  const gaViewsEl = document.getElementById("statGaViews");

  async function loadAnalytics() {
    if (!gaUsersEl && !gaSessionsEl && !gaViewsEl) return;

    try {
      const res = await fetch(`${API}/analytics.php?days=30`);
      const data = await res.json();

      if (!data.success) return;

      if (gaUsersEl) gaUsersEl.textContent = data.metrics.activeUsers ?? 0;
      if (gaSessionsEl) gaSessionsEl.textContent = data.metrics.sessions ?? 0;
      if (gaViewsEl) gaViewsEl.textContent = data.metrics.screenPageViews ?? 0;

    } catch (err) {
      console.error("Erreur analytics:", err);
    }
  }

  loadAnalytics();



  /* -----------------------------------------
     LOGIN ADMIN
  ------------------------------------------*/
>>>>>>> 54704fb (Ajout blog et analitycs)
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginStatus = document.getElementById("loginStatus");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const dashboardSection = document.getElementById("dashboard");

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      loginModal.classList.add("hidden");
      loginStatus.textContent = "";
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const res = await fetch(`${API}/login.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
          loginStatus.textContent = "Connexion réussie ✔️";

          localStorage.setItem("adminLogged", "true");

          dashboardBtn?.classList.remove("hidden");
          dashboardSection?.classList.remove("hidden");

          setTimeout(() => loginModal.classList.add("hidden"), 800);

        } else {
          loginStatus.textContent = data.message;
        }

      } catch (err) {
        loginStatus.textContent = "Erreur serveur ❌";
      }
      loginStatus.style.color = "salmon"; // Mettre en rouge l'erreur
    });
  }

  if (localStorage.getItem("adminLogged") === "true") {
    dashboardBtn?.classList.remove("hidden");
    dashboardSection?.classList.add("hidden");
  }


  /* -----------------------------------------
<<<<<<< HEAD
=======
     FORMULAIRE CONTACT
  ------------------------------------------*/
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      formStatus.textContent = "Envoi...";
      formStatus.style.color = "var(--accent)";

      try {
        // Utilisation de increment.php en GET
        const res = await fetch(`${API}/increment.php?type=forms`);
        const data = await res.json();

        if (data.success) {
          formStatus.textContent = "Message envoyé ✔️";
          formStatus.style.color = "lightgreen";

          loadStats();


  /* -----------------------------------------
     ANALYTICS GA4 (optionnel)
  ------------------------------------------*/
  const gaUsersEl = document.getElementById("statGaUsers");
  const gaSessionsEl = document.getElementById("statGaSessions");
  const gaViewsEl = document.getElementById("statGaViews");

  async function loadAnalytics() {
    if (!gaUsersEl && !gaSessionsEl && !gaViewsEl) return;

    try {
      const res = await fetch(`${API}/analytics.php?days=30`);
      const data = await res.json();

      if (!data.success) return;

      if (gaUsersEl) gaUsersEl.textContent = data.metrics.activeUsers ?? 0;
      if (gaSessionsEl) gaSessionsEl.textContent = data.metrics.sessions ?? 0;
      if (gaViewsEl) gaViewsEl.textContent = data.metrics.screenPageViews ?? 0;

    } catch (err) {
      console.error("Erreur analytics:", err);
    }
  }

  loadAnalytics();

          contactForm.reset();

          setTimeout(() => formStatus.textContent = "", 3000);
        }

      } catch (err) {
        formStatus.textContent = "Erreur d'envoi ❌";
        formStatus.style.color = "salmon";
      }
    });
  }


  /* -----------------------------------------
>>>>>>> 54704fb (Ajout blog et analitycs)
     LOGOUT
  ------------------------------------------*/
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogged");
      dashboardBtn?.classList.add("hidden");
      dashboardSection?.classList.add("hidden");
      alert("Déconnexion effectuée.");
    });
  }
});