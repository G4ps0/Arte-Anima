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

  // Check if logged in
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

  // Load videos
  async function loadVideos() {
    try {
      loadingEl.style.display = "block"
      videosGrid.style.display = "none"

      allVideos = await api.getAllVideos()
      displayVideos()
    } catch (error) {
      console.error("Errore caricamento video:", error)
      showEmptyState("Errore nel caricamento dei video")
    } finally {
      loadingEl.style.display = "none"
      videosGrid.style.display = "grid"
    }
  }

  // Display videos
  function displayVideos() {
    const searchTerm = searchInput.value.toLowerCase()

    const filteredVideos = allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.userName.toLowerCase().includes(searchTerm) ||
        (video.description && video.description.toLowerCase().includes(searchTerm)),
    )

    // Sort videos
    switch (currentSort) {
      case "title":
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "user":
        filteredVideos.sort((a, b) => a.userName.localeCompare(b.userName))
        break
      case "date":
      default:
        filteredVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    videosGrid.innerHTML = ""

    if (filteredVideos.length === 0) {
      showEmptyState(searchTerm ? "Nessun video trovato per la ricerca" : "Nessun video disponibile")
      return
    }

    filteredVideos.forEach((video) => {
      const videoId = api.extractYouTubeId(video.url)
      if (!videoId) return

      const videoCard = document.createElement("div")
      videoCard.className = "video-card"

      const currentUserData = currentUser ? JSON.parse(currentUser) : null
      const canDelete = currentUserData && (currentUserData.isAdmin || currentUserData.id === video.userId)

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
              <i class="fas fa-user"></i> ${video.userName}
              ${video.userIsAdmin ? '<i class="fas fa-crown" style="color: #ffd700; margin-left: 5px;"></i>' : ""}
            </span>
            <span>${new Date(video.createdAt).toLocaleDateString("it-IT")}</span>
          </div>
          ${
            canDelete
              ? `
            <div class="video-actions">
              <button onclick="deleteVideo('${video.id}')" class="admin-actions">
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

  // Show empty state
  function showEmptyState(message) {
    videosGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-video"></i>
        <h3>${message}</h3>
        <p>Inizia caricando il tuo primo video!</p>
        <a href="login.html" class="btn">Accedi per caricare</a>
      </div>
    `
  }

  // Delete video function (global)
  window.deleteVideo = async (videoId) => {
    if (!confirm("Sei sicuro di voler eliminare questo video?")) return

    const currentUserData = JSON.parse(currentUser)
    try {
      await api.deleteVideo(videoId, currentUserData.id)
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

  // Initialize
  await loadVideos()
})
