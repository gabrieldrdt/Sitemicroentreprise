/* ===============================
   VEILLE IA (COMPATIBLE blog.php)
=============================== */
const blogGrid = document.getElementById("blogGrid");
const blogStatus = document.getElementById("blogStatus");

async function loadBlog() {
  if (!blogGrid) return;

  try {
    blogStatus.textContent = "Chargement des articles…";

    const res = await fetch(
      "https://gabriel-durand-touya.onrender.com/api/blog.php?limit=6"
    );
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
