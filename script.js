document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const themeSwitch = document.getElementById("themeSwitch");
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.classList.add("light");
    if (themeSwitch) themeSwitch.checked = false;
  }
  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      document.documentElement.classList.toggle("light");
      localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("light") ? "light" : "dark"
      );
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });
  }

  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
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

  const db = {
    adminEmail: "admin@site.com",
    adminPassword: "admin123",
    visitors: parseInt(localStorage.getItem("visitors") || "0", 10),
    views: parseInt(localStorage.getItem("views") || "0", 10),
    forms: parseInt(localStorage.getItem("forms") || "0", 10),
  };

  db.visitors += 1;
  db.views += 1;
  localStorage.setItem("visitors", db.visitors);
  localStorage.setItem("views", db.views);

  const statVisitors = document.getElementById("statVisitors");
  const statViews = document.getElementById("statViews");
  const statForms = document.getElementById("statForms");

  function updateDashboard() {
    if (statVisitors) statVisitors.textContent = db.visitors;
    if (statViews) statViews.textContent = db.views;
    if (statForms) statForms.textContent = db.forms;
  }

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginStatus = document.getElementById("loginStatus");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const dashboardSection = document.getElementById("dashboard");

  if (adminLoginBtn && loginModal) {
    adminLoginBtn.addEventListener("click", () => {
      loginModal.classList.remove("hidden");
    });
  }

  if (closeModal && loginModal) {
    closeModal.addEventListener("click", () => {
      loginModal.classList.add("hidden");
      if (loginStatus) loginStatus.textContent = "";
    });
  }

  if (adminLoginForm && loginModal && dashboardBtn && dashboardSection) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (email === db.adminEmail && password === db.adminPassword) {
        if (loginStatus) {
          loginStatus.textContent = "Connexion réussie ✔️";
          loginStatus.style.color = "lightgreen";
        }
        localStorage.setItem("adminLogged", "true");
        dashboardBtn.classList.remove("hidden");
        dashboardSection.classList.remove("hidden");
        setTimeout(() => {
          loginModal.classList.add("hidden");
          if (loginStatus) loginStatus.textContent = "";
        }, 800);
      } else {
        if (loginStatus) {
          loginStatus.textContent = "Identifiants incorrects ❌";
          loginStatus.style.color = "salmon";
        }
      }
    });
  }

  if (localStorage.getItem("adminLogged") === "true") {
    if (dashboardBtn) dashboardBtn.classList.remove("hidden");
    if (dashboardSection) dashboardSection.classList.remove("hidden");
  }

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      db.forms += 1;
      localStorage.setItem("forms", db.forms.toString());
      updateDashboard();
      formStatus.textContent = "Message envoyé ! ✔️";
      formStatus.classList.remove("error");
      formStatus.classList.add("success");
      contactForm.reset();
      setTimeout(() => {
        formStatus.textContent = "";
        formStatus.classList.remove("success");
      }, 3000);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn && dashboardBtn && dashboardSection) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogged");
      dashboardBtn.classList.add("hidden");
      dashboardSection.classList.add("hidden");
      alert("Déconnexion effectuée.");
    });
  }

  updateDashboard();
});
