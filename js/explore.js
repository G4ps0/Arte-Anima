// Explore page JavaScript
document.addEventListener("DOMContentLoaded", async () => {
  let allArtists = []
  let currentFilter = "all"
  let currentSort = "name"

  const loadingEl = document.getElementById("loading")
  const artistsGrid = document.getElementById("artists-grid")
  const searchInput = document.getElementById("search-input")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const sortSelect = document.getElementById("sort-select")
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

  // Carica artisti
  async function loadArtists() {
    try {
      loadingEl.style.display = "block"
      artistsGrid.style.display = "none"

      allArtists = await window.db.getAllUsers()
      displayArtists()
    } catch (error) {
      console.error("Errore caricamento artisti:", error)
      showEmptyState("Errore nel caricamento degli artisti")
    } finally {
      loadingEl.style.display = "none"
      artistsGrid.style.display = "grid"
    }
  }

  // Mostra artisti
  function displayArtists() {
    const searchTerm = searchInput.value.toLowerCase()

    let filteredArtists = allArtists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm) ||
        (artist.description && artist.description.toLowerCase().includes(searchTerm)),
    )

    // Applica filtri
    switch (currentFilter) {
      case "admin":
        filteredArtists = filteredArtists.filter((artist) => artist.is_admin)
        break
      case "artists":
        filteredArtists = filteredArtists.filter((artist) => artist.totalVideos > 0)
        break
      case "recent":
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        filteredArtists = filteredArtists.filter((artist) => new Date(artist.created_at) > oneWeekAgo)
        break
    }

    // Ordina
    filteredArtists.sort((a, b) => {
      switch (currentSort) {
        case "name":
          return a.name.localeCompare(b.name)
        case "videos":
          return b.totalVideos - a.totalVideos
        case "recent":
          return new Date(b.created_at) - new Date(a.created_at)
        default:
          return 0
      }
    })

    artistsGrid.innerHTML = ""

    if (filteredArtists.length === 0) {
      showEmptyState("Nessun artista trovato")
      return
    }

    filteredArtists.forEach((artist) => {
      const artistCard = document.createElement("div")
      artistCard.className = "artist-card"

      const initial = artist.name ? artist.name.charAt(0).toUpperCase() : "U"
      const description = artist.description || "Nessuna descrizione disponibile"
      const youtubeButton = artist.youtube_channel
        ? `<a href="${artist.youtube_channel}" target="_blank" class="youtube-button">
            <i class="fab fa-youtube"></i> Canale YouTube
          </a>`
        : ""

      artistCard.innerHTML = `
        <div class="artist-header">
          <div class="artist-avatar">${initial}</div>
          <h3 class="artist-name">${artist.name}</h3>
          ${artist.is_admin ? '<div class="admin-badge"><i class="fas fa-crown"></i> Admin</div>' : ""}
          <div class="artist-stats">${artist.totalVideos} Video</div>
        </div>
        <div class="artist-body">
          <div class="artist-description">${description}</div>
          ${youtubeButton}
        </div>
      `

      artistsGrid.appendChild(artistCard)
    })
  }

  // Stato vuoto
  function showEmptyState(message) {
    artistsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users"></i>
        <h3>${message}</h3>
        <p>Prova a modificare i filtri di ricerca</p>
      </div>
    `
  }

  // Event listeners
  searchInput.addEventListener("input", displayArtists)

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentFilter = btn.getAttribute("data-filter")
      displayArtists()
    })
  })

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value
    displayArtists()
  })

  // Inizializza
  await loadArtists()
})
