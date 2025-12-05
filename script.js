document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     ANNÉE DANS LE FOOTER
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
      const href = link.getAttribute("href");
      if (!href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth"
      });
    });
  });


  /* -----------------------------------------
     DASHBOARD (backend)
  ------------------------------------------*/
  const statVisitors = document.getElementById("statVisitors");
  const statViews = document.getElementById("statViews");
  const statForms = document.getElementById("statForms");

  async function loadStats() {
    try {
      const res = await fetch("https://gabriel-durand-touya.onrender.com/api/stats.php");
      const data = await res.json();

      if (statVisitors) statVisitors.textContent = data.visitors;
      if (statViews) statViews.textContent = data.views;
      if (statForms) statForms.textContent = data.forms;

    } catch (err) {
      console.error("Erreur stats:", err);
    }
  }

  loadStats();


  /* -----------------------------------------
     LOGIN ADMIN (backend)
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
        const res = await fetch("https://gabriel-durand-touya.onrender.com/api/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
          loginStatus.textContent = "Connexion réussie ✔️";
          loginStatus.style.color = "lightgreen";

          localStorage.setItem("adminLogged", "true");

          dashboardBtn.classList.remove("hidden");
          dashboardSection.classList.remove("hidden");

          setTimeout(() => loginModal.classList.add("hidden"), 700);

        } else {
          loginStatus.textContent = data.message;
          loginStatus.style.color = "salmon";
        }

      } catch (err) {
        loginStatus.textContent = "Erreur serveur";
        loginStatus.style.color = "salmon";
      }
    });
  }

  if (localStorage.getItem("adminLogged") === "true") {
    dashboardBtn.classList.remove("hidden");
    dashboardSection.classList.remove("hidden");
  }


  /* -----------------------------------------
     FORMULAIRE CONTACT (backend)
  ------------------------------------------*/
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
      };

      formStatus.textContent = "Envoi...";
      formStatus.style.color = "var(--accent)";

      try {
        const res = await fetch("https://gabriel-durand-touya.onrender.com/api/increment.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        formStatus.textContent = "Message envoyé ✔️";
        formStatus.style.color = "lightgreen";

        loadStats();
        contactForm.reset();

        setTimeout(() => formStatus.textContent = "", 3000);

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
      dashboardBtn.classList.add("hidden");
      dashboardSection.classList.add("hidden");
      alert("Déconnexion effectuée.");
    });
  }

});
