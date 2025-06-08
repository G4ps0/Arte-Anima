document.addEventListener("DOMContentLoaded", async () => {
  console.log("📊 Inizializzazione dashboard...")

  // Check if user is logged in
  const userJson = localStorage.getItem("arteAnima_currentUser")
  if (!userJson) {
    console.log("❌ Utente non loggato, reindirizzamento...")
    window.location.href = "login.html"
    return
  }

  const currentUser = JSON.parse(userJson)
  console.log("👤 Utente corrente:", currentUser)

  // Aspetta che l'API sia pronta
  while (!window.api) {
    console.log("⏳ Aspettando inizializzazione API...")
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Menu toggle for mobile
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Update user info
  function updateUserInfo() {
    document.getElementById("user-name").textContent = currentUser.name
    document.getElementById("user-email").textContent = currentUser.email

    if (currentUser.isAdmin) {
      document.getElementById("admin-badge").style.display = "flex"
    }
  }

  // Logout functionality
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("arteAnima_currentUser")
    window.location.href = "index.html"
  })

  // Load user videos
  async function loadUserVideos() {
    try {
      const loadingEl = document.getElementById("loading")
      const videosContainer = document.getElementById("videos-container")

      loadingEl.style.display = "block"
      videosContainer.style.display = "none"

      console.log("📹 Caricamento video per utente:", currentUser.id)
      const videos = await window.api.getUserVideos(currentUser.id)
      console.log("✅ Video caricati:", videos.length)

      displayUserVideos(videos)

      // Update stats
      document.getElementById("total-videos").textContent = videos.length
    } catch (error) {
      console.error("❌ Errore caricamento video:", error)
      alert("Errore nel caricamento dei video: " + error.message)
    } finally {
      document.getElementById("loading").style.display = "none"
      document.getElementById("videos-container").style.display = "grid"
    }
  }

  // Display user videos
  function displayUserVideos(videos) {
    const videosContainer = document.getElementById("videos-container")
    videosContainer.innerHTML = ""

    if (videos.length === 0) {
      videosContainer.innerHTML = `
        <div class="empty-section" style="grid-column: 1 / -1;">
          <i class="fas fa-video-slash"></i>
          <h3>Nessun video</h3>
          <p>Aggiungi il tuo primo video!</p>
        </div>
      `
      return
    }

    videos.forEach((video) => {
      const videoId = window.api.extractYouTubeId(video.url)
      if (!videoId) return

      const videoCard = document.createElement("div")
      videoCard.className = "video-card"

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
            <span>${new Date(video.createdAt).toLocaleDateString("it-IT")}</span>
          </div>
          <div class="video-actions">
            <button onclick="deleteVideo('${video.id}')">
              <i class="fas fa-trash"></i> Elimina
            </button>
          </div>
        </div>
      `

      videosContainer.appendChild(videoCard)
    })
  }

  // Modal functionality
  const addVideoBtn = document.getElementById("add-video-btn")
  const addVideoModal = document.getElementById("add-video-modal")
  const closeModal = document.querySelector(".close-modal")

  addVideoBtn.addEventListener("click", () => {
    addVideoModal.style.display = "block"
  })

  closeModal.addEventListener("click", () => {
    addVideoModal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === addVideoModal) {
      addVideoModal.style.display = "none"
    }
  })

  // Add video form
  document.getElementById("add-video-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const title = document.getElementById("video-title").value.trim()
    const url = document.getElementById("video-url").value.trim()
    const description = document.getElementById("video-description").value.trim()

    if (!title || !url) {
      alert("Titolo e URL sono obbligatori")
      return
    }

    try {
      console.log("➕ Aggiunta video:", { title, url })
      await window.api.addVideo(currentUser.id, { title, url, description })
      console.log("✅ Video aggiunto con successo")

      document.getElementById("add-video-form").reset()
      addVideoModal.style.display = "none"

      await loadUserVideos()
    } catch (error) {
      console.error("❌ Errore aggiunta video:", error)
      alert("Errore: " + error.message)
    }
  })

  // Delete video function (global)
  window.deleteVideo = async (videoId) => {
    if (!confirm("Sei sicuro di voler eliminare questo video?")) return

    try {
      console.log("🗑️ Eliminazione video:", videoId)
      await window.api.deleteVideo(videoId, currentUser.id)
      console.log("✅ Video eliminato")
      await loadUserVideos()
    } catch (error) {
      console.error("❌ Errore eliminazione video:", error)
      alert("Errore: " + error.message)
    }
  }

  // Initialize
  updateUserInfo()
  await loadUserVideos()
})
