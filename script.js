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
      
      // Réinitialiser le formulaire
      adminLoginForm.reset();
    } else {
      loginStatus.textContent = data.message || "Accès refusé";
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    loginStatus.textContent = "Erreur serveur - Vérifiez votre connexion";
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