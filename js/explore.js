document.addEventListener("DOMContentLoaded", async () => {
  // Stato dell'applicazione
  const state = {
    allProfiles: [],
    filteredProfiles: [],
    currentFilter: 'all',
    currentSort: 'name',
    searchTerm: ''
  };

  // Elementi DOM
  const elements = {
    loadingSpinner: document.getElementById('loading'),
    profilesGrid: document.getElementById('profiles-grid'),
    noResults: document.getElementById('no-results'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sort-select'),
    authBtn: document.getElementById('auth-btn'),
    menuToggle: document.querySelector('.menu-toggle'),
    navMenu: document.querySelector('nav ul')
  }

  // Inizializzazione
  function init() {
    checkAuthStatus()
    setupEventListeners()
    loadProfiles()
  }

  // Controlla lo stato di autenticazione
  function checkAuthStatus() {
    const currentUser = localStorage.getItem('arteAnima_currentUser')
    if (currentUser && elements.authBtn) {
      elements.authBtn.textContent = 'Dashboard'
      elements.authBtn.href = 'dashboard.html'
    }
  }

  // Imposta i gestori degli eventi
  function setupEventListeners() {
    // Menu mobile
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', () => {
        elements.navMenu.classList.toggle('show')
      })
    }

    // Filtri
    if (elements.filterBtns) {
      elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          elements.filterBtns.forEach(b => b.classList.remove('active'))
          btn.classList.add('active')
          state.currentFilter = btn.dataset.filter
          applyFilters()
        })
      })
    }

    // Ricerca
    elements.searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value.toLowerCase()
      applyFilters()
    })

    elements.searchBtn.addEventListener('click', () => {
      state.searchTerm = elements.searchInput.value.toLowerCase()
      applyFilters()
    })

    // Ordinamento
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value
        applyFilters()
      })
    }
  }


  // Carica i profili
  async function loadProfiles() {
    try {
      showLoading(true)
      
      const artists = await api.getPublicArtists()
      console.log('Artisti caricati:', artists)

      state.allProfiles = artists.map(artist => {
        // Assicurati che i social_links siano sempre un oggetto con tutte le proprietà necessarie
        const socialLinks = artist.social_links || {
          youtube: '',
          instagram: '',
          website: '',
          other: ''
        };
        
        return {
          id: artist.id,
          name: artist.name || 'Utente Senza Nome',
          email: artist.email || 'Email non disponibile',
          isAdmin: artist.isAdmin || false,
          totalVideos: artist.totalVideos || 0,
          createdAt: artist.createdAt || new Date().toISOString(),
          description: artist.description || generateUserDescription(artist),
          avatarText: artist.name ? artist.name.charAt(0).toUpperCase() : 'U',
          social_links: {
            youtube: socialLinks.youtube || '',
            instagram: socialLinks.instagram || '',
            website: socialLinks.website || '',
            other: socialLinks.other || ''
          }
        };
      });

      applyFilters()
    } catch (error) {
      console.error('Errore nel caricamento dei profili:', error)
      showError('Impossibile caricare i profili')
    } finally {
      showLoading(false)
    }
  }

  // Genera la descrizione dell'utente
  function generateUserDescription(artist) {
    if (artist.isAdmin) {
      return 'Amministratore della piattaforma. Creatore di contenuti artistici e culturali.'
    }
    if (artist.totalVideos === 0) {
      return 'Nuovo membro della community Arte Anima.'
    }
    return `Artista con ${artist.totalVideos} video condivisi nella community.`
  }

  // Mostra/nascondi il caricamento
  function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none'
  }

  // Mostra un messaggio di errore
  function showError(message) {
    elements.noResults.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <h3>Si è verificato un errore</h3>
      <p>${message}</p>
    `
    elements.noResults.style.display = 'flex'
  }

  // Applica filtri e ordinamento
  function applyFilters() {
    let filtered = [...state.allProfiles]

    // Filtro per ricerca
    if (state.searchTerm) {
      filtered = filtered.filter(profile => 
        profile.name.toLowerCase().includes(state.searchTerm) ||
        profile.email.toLowerCase().includes(state.searchTerm) ||
        profile.description.toLowerCase().includes(state.searchTerm)
      )
    }

    // Filtro per categoria
    switch (state.currentFilter) {
      case 'admin':
        filtered = filtered.filter(profile => profile.isAdmin)
        break
      case 'artists':
        filtered = filtered.filter(profile => !profile.isAdmin && profile.totalVideos > 0)
        break
      case 'recent':
        // Gli ultimi 7 giorni
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        filtered = filtered.filter(profile => new Date(profile.createdAt) > oneWeekAgo)
        break
      // 'all' non richiede filtri aggiuntivi
    }

    // Ordinamento
    filtered.sort((a, b) => {
      switch (state.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'videos':
          return b.totalVideos - a.totalVideos
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

    state.filteredProfiles = filtered
    displayProfiles()
  }

  // Visualizza i profili
  function displayProfiles() {
    if (!elements.profilesGrid) return

    elements.profilesGrid.innerHTML = ''

    if (state.filteredProfiles.length === 0) {
      showNoResults()
      return
    }

    state.filteredProfiles.forEach(profile => {
      const profileCard = document.createElement('div')
      profileCard.className = 'profile-card'
      
      // Prepara i link social se presenti
      const socialLinks = profile.social_links || {
        youtube: '',
        instagram: '',
        website: '',
        other: ''
      };
      
      // Crea gli elementi dei link social solo se presenti
      let socialLinksHTML = '';
      if (socialLinks.youtube || socialLinks.instagram || socialLinks.website || socialLinks.other) {
        socialLinksHTML = `
          <div class="profile-social-links">
            ${socialLinks.youtube ? `<a href="${socialLinks.youtube}" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube"><i class="fab fa-youtube"></i></a>` : ''}
            ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
            ${socialLinks.website ? `<a href="${socialLinks.website}" target="_blank" rel="noopener noreferrer" class="social-link" title="Sito Web"><i class="fas fa-globe"></i></a>` : ''}
            ${socialLinks.other ? `<a href="${socialLinks.other}" target="_blank" rel="noopener noreferrer" class="social-link" title="Altro"><i class="fas fa-link"></i></a>` : ''}
          </div>`;
      }
      
      profileCard.innerHTML = `
        <div class="profile-avatar">${profile.avatarText}</div>
        <div class="profile-info">
          <h3>${profile.name}</h3>
          <p class="profile-email">${profile.email}</p>
          ${profile.description ? `<p class="profile-description">${profile.description}</p>` : ''}
          ${socialLinksHTML}
        </div>
        <div class="profile-actions">
          <button class="btn btn-outline" onclick="event.stopPropagation(); goToProfile('${profile.id}')">
            Vedi Profilo
          </button>
        </div>
      `
      
      profileCard.addEventListener('click', () => goToProfile(profile.id))
      elements.profilesGrid.appendChild(profileCard)
    })
  }

  // Mostra lo stato "nessun risultato"
  function showNoResults() {
    elements.profilesGrid.style.display = 'none'
    elements.noResults.style.display = 'flex'
    elements.noResults.innerHTML = `
      <i class="fas fa-users-slash"></i>
      <h3>Nessun profilo trovato</h3>
      <p>Prova a modificare i filtri di ricerca</p>
    `
  }

  // Vai al profilo utente
  function goToProfile(userId) {
    // Se l'utente sta visualizzando il proprio profilo, reindirizza alla dashboard
    const currentUser = JSON.parse(localStorage.getItem('arteAnima_currentUser') || '{}');
    
    if (currentUser && currentUser.id === userId) {
      window.location.href = 'profile.html';
    } else {
      // Altrimenti, mostra una preview del profilo o reindirizza a una pagina pubblica
      console.log(`Visualizza profilo utente: ${userId}`);
      // Per ora reindirizziamo alla pagina del profilo con l'ID
      window.location.href = `profile.html?id=${userId}`;
    }
  }

  // Avvia l'applicazione
  init();

  // Inizializza l'ordinamento
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener("change", (e) => {
      state.currentSort = e.target.value;
      applyFilters();
    });
  }

  // Carica i profili
  await loadProfiles();
});
