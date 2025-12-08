document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     MODALE OFFRE DE LANCEMENT (DÉBUT)
  ------------------------------------------*/
  const launchModal = document.getElementById('launchModal');
  const closeLaunchModalBtn = document.getElementById('closeLaunchModal');
  const acceptLaunchOfferLink = document.getElementById('acceptLaunchOffer');

  // Fonction centrale pour masquer la modale et enregistrer l'action
  const hideModal = () => {
    if (launchModal) {
        launchModal.classList.add('hidden');
        localStorage.setItem('launchModalShown', 'true'); // Mémoriser l'action
    }
  };

  if (launchModal) {
    if (localStorage.getItem('launchModalShown') === 'true') {
        launchModal.classList.add('hidden'); // Cacher si déjà vue
    }

    // Assignation des écouteurs d'événements
    closeLaunchModalBtn?.addEventListener('click', hideModal);
    
    // Le lien d'acceptation doit se fermer ET suivre le lien #contact
    acceptLaunchOfferLink?.addEventListener('click', function(event) {
        hideModal(); 
        // Laisse l'action par défaut du lien href="#contact" se dérouler 
        // pour que le scroll smooth fonctionne (géré plus bas)
    });
  }


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
     API CONFIG
  ------------------------------------------*/
  const API = "https://gabriel-durand-touya.onrender.com/api";

  const statVisitors = document.getElementById("statVisitors");
  const statViews = document.getElementById("statViews");
  const statForms = document.getElementById("statForms");


  /* -----------------------------------------
     CHARGER LES STATISTIQUES
  ------------------------------------------*/
  async function loadStats() {
    try {
      const res = await fetch(`${API}/stats.php`);
      const data = await res.json();

      if (data.success && data.stats) {
        if (statVisitors) statVisitors.textContent = data.stats.visitors;
        if (statViews) statViews.textContent = data.stats.views;
        if (statForms) statForms.textContent = data.stats.forms;
      }

    } catch (err) {
      console.error("Erreur stats:", err);
    }
  }

  loadStats();


  /* -----------------------------------------
     LOGIN ADMIN
  ------------------------------------------*/
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
          loginStatus.style.color = "lightgreen";

          localStorage.setItem("adminLogged", "true");

          dashboardBtn?.classList.remove("hidden");
          dashboardSection?.classList.remove("hidden");

          setTimeout(() => loginModal.classList.add("hidden"), 800);

        } else {
          loginStatus.textContent = data.message;
          loginStatus.style.color = "salmon";
        }

      } catch (err) {
        loginStatus.textContent = "Erreur serveur ❌";
        loginStatus.style.color = "red";
      }
    });
  }

  if (localStorage.getItem("adminLogged") === "true") {
    dashboardBtn?.classList.remove("hidden");
    dashboardSection?.classList.remove("hidden");
  }


  /* -----------------------------------------
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