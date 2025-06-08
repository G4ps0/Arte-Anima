document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in
  const userJson = localStorage.getItem("arteAnima_currentUser")
  if (!userJson) {
    window.location.href = "login.html"
    return
  }

  const currentUser = JSON.parse(userJson)

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

      const videos = await api.getUserVideos(currentUser.id)
      displayUserVideos(videos)

      // Update stats
      document.getElementById("total-videos").textContent = videos.length
    } catch (error) {
      console.error("Errore caricamento video:", error)
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
      const videoId = api.extractYouTubeId(video.url)
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

    const title = document.getElementById("video-title").value
    const url = document.getElementById("video-url").value
    const description = document.getElementById("video-description").value

    try {
      await api.addVideo(currentUser.id, { title, url, description })

      document.getElementById("add-video-form").reset()
      addVideoModal.style.display = "none"

      await loadUserVideos()
    } catch (error) {
      alert("Errore: " + error.message)
    }
  })

  // Delete video function (global)
  window.deleteVideo = async (videoId) => {
    if (!confirm("Sei sicuro di voler eliminare questo video?")) return

    try {
      await api.deleteVideo(videoId, currentUser.id)
      await loadUserVideos()
    } catch (error) {
      alert("Errore: " + error.message)
    }
  }

  // Initialize
  updateUserInfo()
  // Mock API (replace with your actual API implementation)
  const api = {
    getUserVideos: async (userId) => {
      // Replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockVideos = [
            {
              id: "1",
              userId: userId,
              title: "Video 1",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              description: "Description 1",
              createdAt: new Date(),
            },
            {
              id: "2",
              userId: userId,
              title: "Video 2",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              description: "Description 2",
              createdAt: new Date(),
            },
          ]
          resolve(mockVideos)
        }, 500)
      })
    },
    addVideo: async (userId, video) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Video added", userId, video)
          resolve()
        }, 500)
      })
    },
    deleteVideo: async (videoId, userId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Video deleted", videoId, userId)
          resolve()
        }, 500)
      })
    },
    extractYouTubeId: (url) => {
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return match && match[2].length === 11 ? match[2] : null
    },
  }
  await loadUserVideos()
})
