document.addEventListener("DOMContentLoaded", async () => {
  let allProfiles = []
  let filteredProfiles = []
  let currentFilter = "all"
  let currentSort = "name"

  // Elements
  const loadingSpinner = document.getElementById("loading")
  const profilesGrid = document.getElementById("profiles-grid")
  const noResults = document.getElementById("no-results")
  const searchInput = document.getElementById("search-input")
  const searchBtn = document.getElementById("search-btn")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const sortSelect = document.getElementById("sort-select")
  const authBtn = document.getElementById("auth-btn")

  // Check if user is logged in
  const currentUser = localStorage.getItem("arteAnima_currentUser")
  if (currentUser && authBtn) {
    const user = JSON.parse(currentUser)
    authBtn.textContent = "Dashboard"
    authBtn.href = "dashboard.html"
  }

  // Menu toggle for mobile
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Load user profiles
  async function loadProfiles() {
    try {
      loadingSpinner.style.display = "block"
      profilesGrid.style.display = "none"
      noResults.style.display = "none"

      const artists = await api.getPublicArtists()

      allProfiles = artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        email: artist.email || "Email non disponibile",
        isAdmin: artist.isAdmin || false,
        totalVideos: artist.totalVideos,
        totalSections: 0,
        sections: [],
        createdAt: artist.createdAt || new Date().toISOString(),
        description: generateUserDescription(artist),
      }))

      filteredProfiles = [...allProfiles]
      displayProfiles()
    } catch (error) {
      console.error("Errore nel caricamento dei profili:", error)
      loadingSpinner.style.display = "none"
      showEmptyState()
    }
  }

  // Generate user description
  function generateUserDescription(artist) {
    if (artist.isAdmin) {
      return "Amministratore della piattaforma. Creatore di contenuti artistici e culturali."
    }

    if (artist.totalVideos === 0) {
      return "Nuovo membro della community Arte Anima."
    }

    return `Artista con ${artist.totalVideos} video condivisi nella community.`
  }

  // Display profiles
  function displayProfiles() {
    loadingSpinner.style.display = "none"

    if (filteredProfiles.length === 0) {
      profilesGrid.style.display = "none"
      noResults.style.display = "block"
      return
    }

    noResults.style.display = "none"
    profilesGrid.style.display = "grid"
    profilesGrid.innerHTML = ""

    filteredProfiles.forEach((profile) => {
      const profileCard = document.createElement("div")
      profileCard.className = "profile-card"
      profileCard.onclick = () => goToProfile(profile.id)

      profileCard.innerHTML = `
        <div class="profile-card-header">
          <div class="profile-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="profile-name">${profile.name}</div>
          <div class="profile-email">${profile.email}</div>
          <div class="profile-badges">
            ${profile.isAdmin ? '<div class="admin-badge"><i class="fas fa-crown"></i> Admin</div>' : ""}
          </div>
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-number">${profile.totalVideos || 0}</span>
              <span class="stat-label">Video</span>
            </div>
            <div class="stat">
              <span class="stat-number">${Math.floor(Math.random() * 500) + 100}</span>
              <span class="stat-label">Views</span>
            </div>
          </div>
        </div>
        <div class="profile-card-body">
          <div class="profile-description">
            ${profile.description}
          </div>
        </div>
        <div class="profile-card-footer">
          <div class="member-since">
            Membro dal ${new Date(profile.createdAt).toLocaleDateString("it-IT")}
          </div>
          <button class="view-profile-btn">
            Vedi Profilo <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `

      profilesGrid.appendChild(profileCard)
    })
  }

  // Show empty state
  function showEmptyState() {
    profilesGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-users"></i>
        <h3>Nessun profilo disponibile</h3>
        <p>Sii il primo a creare contenuti sulla piattaforma!</p>
        <a href="login.html" class="btn">Registrati Ora</a>
      </div>
    `
    profilesGrid.style.display = "grid"
  }

  // Apply filters and sorting
  function applyFiltersAndSort() {
    let filtered = [...allProfiles]

    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase().trim()
    if (searchTerm) {
      filtered = filtered.filter((profile) => {
        return (
          profile.name.toLowerCase().includes(searchTerm) ||
          profile.email.toLowerCase().includes(searchTerm) ||
          profile.description.toLowerCase().includes(searchTerm)
        )
      })
    }

    // Apply category filter
    switch (currentFilter) {
      case "admin":
        filtered = filtered.filter((profile) => profile.isAdmin)
        break
      case "artists":
        filtered = filtered.filter((profile) => !profile.isAdmin && profile.totalVideos > 0)
        break
      case "recent":
        filtered = filtered.filter((profile) => {
          const profileDate = new Date(profile.createdAt)
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          return profileDate > thirtyDaysAgo
        })
        break
      default:
        break
    }

    // Apply sorting
    switch (currentSort) {
      case "videos":
        filtered.sort((a, b) => (b.totalVideos || 0) - (a.totalVideos || 0))
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    // Put admins first if not specifically filtering
    if (currentFilter === "all") {
      filtered.sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1
        if (!a.isAdmin && b.isAdmin) return 1
        return 0
      })
    }

    filteredProfiles = filtered
    displayProfiles()
  }

  // Event listeners
  searchInput.addEventListener("input", applyFiltersAndSort)
  searchBtn.addEventListener("click", applyFiltersAndSort)

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentFilter = btn.getAttribute("data-filter")
      applyFiltersAndSort()
    })
  })

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value
      applyFiltersAndSort()
    })
  }

  // Initialize
  await loadProfiles()
})

// Go to user profile (placeholder)
function goToProfile(userId) {
  alert(`Profilo utente ${userId} - Funzionalità in sviluppo`)
}
