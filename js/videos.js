// Videos page JavaScript
document.addEventListener("DOMContentLoaded", async () => {
  let allVideos = []
  let currentSort = "date"

  const loadingEl = document.getElementById("loading")
  const videosGrid = document.getElementById("videos-grid")
  const searchInput = document.getElementById("search-input")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const authBtn = document.getElementById("auth-btn")
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  // Controlla se loggato
  const currentUser = localStorage.getItem("arteAnima_currentUser")
  if (currentUser && authBtn) {
    authBtn.textContent = "Dashboard"
    authBtn.href = "dashboard.html"
  }

  // Menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Carica video
  async function loadVideos() {
    try {
      loadingEl.style.display = "block"
      videosGrid.style.display = "none"

      allVideos = await window.db.getAllVideos()
      displayVideos()
    } catch (error) {
      console.error("Errore caricamento video:", error)
      showEmptyState("Errore nel caricamento dei video")
    } finally {
      loadingEl.style.display = "none"
      videosGrid.style.display = "grid"
    }
  }

  // Mostra video
  function displayVideos() {
    const searchTerm = searchInput.value.toLowerCase()

    const filteredVideos = allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.user.name.toLowerCase().includes(searchTerm) ||
        (video.description && video.description.toLowerCase().includes(searchTerm)),
    )

    // Ordina video
    switch (currentSort) {
      case "title":
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "user":
        filteredVideos.sort((a, b) => a.user.name.localeCompare(b.user.name))
        break
      case "date":
      default:
        filteredVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    videosGrid.innerHTML = ""

    if (filteredVideos.length === 0) {
      showEmptyState(searchTerm ? "Nessun video trovato" : "Nessun video disponibile")
      return
    }

    filteredVideos.forEach((video) => {
      const videoId = window.db.extractYouTubeId(video.url)
      if (!videoId) return

      const videoCard = document.createElement("div")
      videoCard.className = "video-card"

      const currentUserData = currentUser ? JSON.parse(currentUser) : null
      const canDelete = currentUserData && (currentUserData.is_admin || currentUserData.id === video.user_id)

      videoCard.innerHTML = `
        <div class="video-thumbnail">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            title="${video.title}"
            frameborder="0" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-info">
          <h3>${video.title}</h3>
          <p>${video.description || "Nessuna descrizione"}</p>
          <div class="video-meta">
            <span>
              <i class="fas fa-user"></i> ${video.user.name}
              ${video.user.is_admin ? '<i class="fas fa-crown" style="color: #ffd700; margin-left: 5px;"></i>' : ""}
            </span>
            <span>${new Date(video.created_at).toLocaleDateString("it-IT")}</span>
          </div>
          ${
            canDelete
              ? `
            <div class="video-actions">
              <button onclick="deleteVideo('${video.id}')">
                <i class="fas fa-trash"></i> Elimina
              </button>
            </div>
          `
              : ""
          }
        </div>
      `

      videosGrid.appendChild(videoCard)
    })
  }

  // Stato vuoto
  function showEmptyState(message) {
    videosGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-video"></i>
        <h3>${message}</h3>
        <p>Inizia caricando il tuo primo video!</p>
        <a href="login.html" class="btn">Accedi per caricare</a>
      </div>
    `
  }

  // Elimina video (funzione globale)
  window.deleteVideo = async (videoId) => {
    if (!confirm("Sei sicuro di voler eliminare questo video?")) return

    const currentUserData = JSON.parse(currentUser)
    try {
      await window.db.deleteVideo(videoId, currentUserData.id)
      await loadVideos()
    } catch (error) {
      alert("Errore: " + error.message)
    }
  }

  // Event listeners
  searchInput.addEventListener("input", displayVideos)

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentSort = btn.getAttribute("data-sort")
      displayVideos()
    })
  })

  // Inizializza
  await loadVideos()
})
