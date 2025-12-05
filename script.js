document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     ANNEE DANS LE FOOTER
  ------------------------------------------*/
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  /* -----------------------------------------
     THEME (Dark / Light) + Icônes 🌓☀️
  ------------------------------------------*/
  const themeSwitch = document.getElementById("themeSwitch");
  const root = document.documentElement;

  // appliquer le thème stocké
  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light");
    if (themeSwitch) themeSwitch.checked = true;
  }

  // changement de thème
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
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }


  /* -----------------------------------------
     SCROLL SMOOTH
  ------------------------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });


  /* -----------------------------------------
     BASE DE DONNÉES (version locale pour l’instant)
     PRÊT POUR MIGRATION BACKEND
  ------------------------------------------*/
  const db = {
    adminEmail: "admin@site.com",
    adminPassword: "admin123",
    visitors: parseInt(localStorage.getItem("visitors") || "0"),
    views: parseInt(localStorage.getItem("views") || "0"),
    forms: parseInt(localStorage.getItem("forms") || "0"),
  };

  // compter visiteurs + pages vues
  db.visitors++;
  db.views++;
  localStorage.setItem("visitors", db.visitors);
  localStorage.setItem("views", db.views);


  /* -----------------------------------------
     DASHBOARD
  ------------------------------------------*/
  const statVisitors = document.getElementById("statVisitors");
  const statViews = document.getElementById("statViews");
  const statForms = document.getElementById("statForms");

  function updateDashboard() {
    if (statVisitors) statVisitors.textContent = db.visitors;
    if (statViews) statViews.textContent = db.views;
    if (statForms) statForms.textContent = db.forms;
  }


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

  // ouvrir modal login
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      loginModal.classList.remove("hidden");
    });
  }

  // fermer modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      loginModal.classList.add("hidden");
      loginStatus.textContent = "";
    });
  }

  // soumission du login
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (email === db.adminEmail && password === db.adminPassword) {
        loginStatus.textContent = "Connexion réussie ✔️";
        loginStatus.style.color = "lightgreen";

        localStorage.setItem("adminLogged", "true");

        dashboardBtn.classList.remove("hidden");
        dashboardSection.classList.remove("hidden");

        setTimeout(() => {
          loginModal.classList.add("hidden");
          loginStatus.textContent = "";
        }, 700);

      } else {
        loginStatus.textContent = "Identifiants incorrects ❌";
        loginStatus.style.color = "salmon";
      }
    });
  }

  // si déjà connecté
  if (localStorage.getItem("adminLogged") === "true") {
    dashboardBtn.classList.remove("hidden");
    dashboardSection.classList.remove("hidden");
  }


  /* -----------------------------------------
     FORMULAIRE DE CONTACT
  ------------------------------------------*/
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      db.forms++;
      localStorage.setItem("forms", db.forms);

      updateDashboard();

      formStatus.textContent = "Message envoyé ! ✔️";
      formStatus.classList.add("success");
      formStatus.classList.remove("error");

      contactForm.reset();

      setTimeout(() => formStatus.textContent = "", 3000);
    });
  }


  /* -----------------------------------------
     DECONNEXION ADMIN
  ------------------------------------------*/
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogged");
      dashboardBtn.classList.add("hidden");
      dashboardSection.classList.add("hidden");
      alert("Déconnexion effectuée.");
    });
  }


  /* Mise à jour initiale du dashboard */
  updateDashboard();
});
