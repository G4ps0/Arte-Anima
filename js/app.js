// Constants
const ADMIN_USERNAME = 'mirko';
const ADMIN_PASSWORD = 'arteanima1999';
const STORAGE_KEYS = {
    VIDEOS: 'arteanima_videos',
    REQUESTS: 'arteanima_requests',
    ADMIN_LOGGED_IN: 'arteanima_admin_logged_in'
};

// DOM Elements
const elements = {
    // User Interface
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userGreeting: document.getElementById('user-greeting'),
    pendingRequestsBadge: document.getElementById('pending-requests-badge'),
    tabRequestsBadge: document.getElementById('tab-requests-badge'),
    userView: document.getElementById('user-view'),
    adminView: document.getElementById('admin-view'),
    adminControls: document.getElementById('admin-controls'),
    loginSection: document.getElementById('login-section'),
    
    // Video Gallery
    videoGallery: document.getElementById('video-gallery'),
    adminVideoGallery: document.getElementById('admin-video-gallery'),
    
    // Search and Filter
    searchInput: document.getElementById('search-input'),
    sortAlphaBtn: document.getElementById('sort-alpha-btn'),
    sortDateBtn: document.getElementById('sort-date-btn'),
    dateFrom: document.getElementById('date-from'),
    dateTo: document.getElementById('date-to'),
    applyDateFilterBtn: document.getElementById('apply-date-filter'),
    clearDateFilterBtn: document.getElementById('clear-date-filter'),
    
    // Request Button and Modal
    requestVideoBtn: document.getElementById('request-video-btn'),
    requestModal: document.getElementById('request-modal'),
    requestForm: document.getElementById('request-form'),
    videoUrl: document.getElementById('video-url'),
    videoTitle: document.getElementById('video-title'),
    requestReason: document.getElementById('request-reason'),
    
    
    // Admin Add Video Form
    addVideoForm: document.getElementById('add-video-form'),
    adminVideoUrl: document.getElementById('admin-video-url'),
    adminVideoTitle: document.getElementById('admin-video-title'),
    
    // Admin Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    adminGallery: document.getElementById('admin-gallery'),
    adminRequests: document.getElementById('admin-requests'),
    pendingRequestsList: document.getElementById('pending-requests-list'),
    
    // Modals
    videoModal: document.getElementById('video-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalVideoContainer: document.getElementById('modal-video-container'),
    closeModalBtns: document.querySelectorAll('.close-modal'),
    loginModal: document.getElementById('login-modal'),
    loginForm: document.getElementById('login-form'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    loginError: document.getElementById('login-error')
};

// State
let state = {
    videos: [],
    requests: [],
    isAdminLoggedIn: false,
    filteredVideos: [],
    dateFilter: {
        active: false,
        from: null,
        to: null
    }
};

// Utility Functions
function getYouTubeVideoId(url) {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeThumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Data Management
function loadData() {
    // Load videos
    const savedVideos = getFromLocalStorage(STORAGE_KEYS.VIDEOS);
    if (savedVideos) {
        state.videos = savedVideos;
    } else {
        // Sample videos if none exist
        state.videos = [
            {
                id: '1',
                videoId: 'kFyAQkaBV48',
                title: 'Terapia Espressiva - Arte & Anima',
                dateAdded: new Date('2025-05-15').toISOString()
            },
            {
                id: '2',
                videoId: 'mPb7H0RYTu4',
                title: 'Arte & Anima - Laboratorio Creativo',
                dateAdded: new Date('2025-05-20').toISOString()
            }
        ];
        saveToLocalStorage(STORAGE_KEYS.VIDEOS, state.videos);
    }
    
    // Load requests
    const savedRequests = getFromLocalStorage(STORAGE_KEYS.REQUESTS);
    if (savedRequests) {
        state.requests = savedRequests;
    } else {
        state.requests = [];
        saveToLocalStorage(STORAGE_KEYS.REQUESTS, state.requests);
    }
    
    // Check admin login status
    state.isAdminLoggedIn = getFromLocalStorage(STORAGE_KEYS.ADMIN_LOGGED_IN) === true;
    
    // Initialize filtered videos
    state.filteredVideos = [...state.videos];
}

// UI Rendering
function renderVideos(container, videos) {
    container.innerHTML = '';
    
    if (videos.length === 0) {
        container.innerHTML = '<p class="no-videos">Nessun video disponibile</p>';
        return;
    }
    
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.dataset.id = video.id;
        videoCard.dataset.videoId = video.videoId;
        
        const thumbnailUrl = getYouTubeThumbnailUrl(video.videoId);
        
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnailUrl}" alt="${video.title}">
                <i class="fas fa-play-circle play-icon"></i>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-date">Aggiunto il ${formatDate(video.dateAdded)}</p>
            </div>
            ${container.id === 'admin-video-gallery' ? `
                <div class="video-actions">
                    <button class="delete-video-btn" data-id="${video.id}">
                        <i class="fas fa-trash"></i> Rimuovi
                    </button>
                </div>
            ` : ''}
        `;
        
        // Add click event to play video
        videoCard.querySelector('.video-thumbnail').addEventListener('click', () => {
            openVideoModal(video);
        });
        
        // Add delete button event if in admin view
        if (container.id === 'admin-video-gallery') {
            videoCard.querySelector('.delete-video-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteVideo(video.id);
            });
        }
        
        container.appendChild(videoCard);
    });
}

function renderRequests() {
    elements.pendingRequestsList.innerHTML = '';
    
    if (state.requests.length === 0) {
        elements.pendingRequestsList.innerHTML = '<p>Nessuna richiesta in attesa</p>';
        return;
    }
    
    state.requests.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.className = 'request-item';
        requestItem.dataset.id = request.id;
        
        const videoId = getYouTubeVideoId(request.url);
        const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : '';
        
        requestItem.innerHTML = `
            <div class="request-header">
                <h3 class="request-title">${request.title || 'Titolo non specificato'}</h3>
                <span class="request-date">${formatDate(request.dateRequested)}</span>
            </div>
            <p class="request-url"><strong>URL:</strong> ${request.url}</p>
            ${request.reason ? `<p class="request-reason"><strong>Motivazione:</strong> ${request.reason}</p>` : ''}
            ${thumbnailUrl ? `
                <div class="request-thumbnail">
                    <img src="${thumbnailUrl}" alt="Thumbnail" style="max-width: 200px; margin-bottom: 10px;">
                </div>
            ` : ''}
            <div class="request-actions">
                <button class="approve-btn" data-id="${request.id}">Approva</button>
                <button class="reject-btn" data-id="${request.id}">Rifiuta</button>
            </div>
        `;
        
        // Add event listeners for approve/reject buttons
        requestItem.querySelector('.approve-btn').addEventListener('click', () => {
            approveRequest(request.id);
        });
        
        requestItem.querySelector('.reject-btn').addEventListener('click', () => {
            rejectRequest(request.id);
        });
        
        elements.pendingRequestsList.appendChild(requestItem);
    });
}

function updateRequestBadges() {
    const count = state.requests.length;
    
    if (count > 0) {
        elements.pendingRequestsBadge.textContent = count;
        elements.pendingRequestsBadge.classList.remove('hidden');
        
        elements.tabRequestsBadge.textContent = count;
        elements.tabRequestsBadge.classList.remove('hidden');
    } else {
        elements.pendingRequestsBadge.classList.add('hidden');
        elements.tabRequestsBadge.classList.add('hidden');
    }
}

function updateUIForAuthState() {
    if (state.isAdminLoggedIn) {
        elements.loginSection.classList.add('hidden');
        elements.adminControls.classList.remove('hidden');
        elements.userView.classList.add('hidden');
        elements.adminView.classList.remove('hidden');
        elements.userGreeting.textContent = 'Ciao, Mirko';
        
        // Render admin content
        renderVideos(elements.adminVideoGallery, state.videos);
        renderRequests();
        updateRequestBadges();
    } else {
        elements.loginSection.classList.remove('hidden');
        elements.adminControls.classList.add('hidden');
        elements.userView.classList.remove('hidden');
        elements.adminView.classList.add('hidden');
        
        // Render user content
        renderVideos(elements.videoGallery, state.filteredVideos);
    }
}

// Video Management
function addVideo(url, title) {
    const videoId = getYouTubeVideoId(url);
    
    if (!videoId) {
        alert('URL YouTube non valido');
        return false;
    }
    
    // Generate a unique ID
    const id = Date.now().toString();
    
    // Create new video object
    const newVideo = {
        id,
        videoId,
        title: title || `Video YouTube ${id.substring(id.length - 4)}`,
        dateAdded: new Date().toISOString()
    };
    
    // Add to state and save
    state.videos.unshift(newVideo);
    saveToLocalStorage(STORAGE_KEYS.VIDEOS, state.videos);
    
    // Update UI
    if (state.isAdminLoggedIn) {
        renderVideos(elements.adminVideoGallery, state.videos);
    } else {
        state.filteredVideos = [...state.videos];
        renderVideos(elements.videoGallery, state.filteredVideos);
    }
    
    return true;
}

function deleteVideo(id) {
    if (confirm('Sei sicuro di voler rimuovere questo video?')) {
        state.videos = state.videos.filter(video => video.id !== id);
        saveToLocalStorage(STORAGE_KEYS.VIDEOS, state.videos);
        
        // Update UI
        renderVideos(elements.adminVideoGallery, state.videos);
        
        // Also update filtered videos for user view
        state.filteredVideos = state.filteredVideos.filter(video => video.id !== id);
    }
}

// Request Management
function submitRequest(url, title, reason) {
    const videoId = getYouTubeVideoId(url);
    
    if (!videoId) {
        alert('URL YouTube non valido');
        return false;
    }
    
    // Generate a unique ID
    const id = Date.now().toString();
    
    // Create new request object
    const newRequest = {
        id,
        url,
        title,
        reason,
        videoId,
        dateRequested: new Date().toISOString()
    };
    
    // Add to state and save
    state.requests.push(newRequest);
    saveToLocalStorage(STORAGE_KEYS.REQUESTS, state.requests);
    
    // Update UI if admin is logged in
    if (state.isAdminLoggedIn) {
        renderRequests();
        updateRequestBadges();
    }
    
    return true;
}

function approveRequest(id) {
    const request = state.requests.find(req => req.id === id);
    
    if (request) {
        // Add the video
        addVideo(request.url, request.title);
        
        // Remove the request
        state.requests = state.requests.filter(req => req.id !== id);
        saveToLocalStorage(STORAGE_KEYS.REQUESTS, state.requests);
        
        // Update UI
        renderRequests();
        updateRequestBadges();
    }
}

function rejectRequest(id) {
    state.requests = state.requests.filter(req => req.id !== id);
    saveToLocalStorage(STORAGE_KEYS.REQUESTS, state.requests);
    
    // Update UI
    renderRequests();
    updateRequestBadges();
}

// Search and Filter
function filterVideos() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    
    // First filter by search term
    state.filteredVideos = state.videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm)
    );
    
    // Then apply date filter if active
    if (state.dateFilter && state.dateFilter.active) {
        state.filteredVideos = state.filteredVideos.filter(video => {
            const videoDate = new Date(video.dateAdded);
            let matchesFilter = true;
            
            if (state.dateFilter.from) {
                const fromDate = new Date(state.dateFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                matchesFilter = matchesFilter && videoDate >= fromDate;
            }
            
            if (state.dateFilter.to) {
                const toDate = new Date(state.dateFilter.to);
                toDate.setHours(23, 59, 59, 999);
                matchesFilter = matchesFilter && videoDate <= toDate;
            }
            
            return matchesFilter;
        });
    }
    
    renderVideos(elements.videoGallery, state.filteredVideos);
}

function applyDateFilter() {
    const fromValue = elements.dateFrom.value;
    const toValue = elements.dateTo.value;
    
    if (!fromValue && !toValue) {
        alert('Seleziona almeno una data per applicare il filtro');
        return;
    }
    
    state.dateFilter = {
        active: true,
        from: fromValue,
        to: toValue
    };
    
    filterVideos();
}

function clearDateFilter() {
    elements.dateFrom.value = '';
    elements.dateTo.value = '';
    
    state.dateFilter = {
        active: false,
        from: null,
        to: null
    };
    
    filterVideos();
}

function sortVideosAlphabetically() {
    state.filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
    renderVideos(elements.videoGallery, state.filteredVideos);
}

function sortVideosByDate() {
    state.filteredVideos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    renderVideos(elements.videoGallery, state.filteredVideos);
}

// Modal Management
function openVideoModal(video) {
    elements.modalTitle.textContent = video.title;
    elements.modalVideoContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${video.videoId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    elements.videoModal.classList.remove('hidden');
}

function openRequestModal() {
    elements.requestForm.reset();
    elements.requestModal.classList.remove('hidden');
}

function closeModals() {
    elements.videoModal.classList.add('hidden');
    elements.loginModal.classList.add('hidden');
    elements.requestModal.classList.add('hidden');
    
    // Stop video playback when closing modal
    elements.modalVideoContainer.innerHTML = '';
}

// Authentication
function openLoginModal() {
    elements.loginForm.reset();
    elements.loginError.classList.add('hidden');
    elements.loginModal.classList.remove('hidden');
}

function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        state.isAdminLoggedIn = true;
        saveToLocalStorage(STORAGE_KEYS.ADMIN_LOGGED_IN, true);
        closeModals();
        updateUIForAuthState();
        return true;
    } else {
        elements.loginError.textContent = 'Credenziali non valide';
        elements.loginError.classList.remove('hidden');
        return false;
    }
}

function logout() {
    state.isAdminLoggedIn = false;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    updateUIForAuthState();
}

// Event Listeners
function setupEventListeners() {
    // Login/Logout
    elements.loginBtn.addEventListener('click', openLoginModal);
    elements.logoutBtn.addEventListener('click', logout);
    
    // Login Form
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        login(elements.username.value, elements.password.value);
    });
    
    // Close Modals
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.videoModal) {
            closeModals();
        }
        if (e.target === elements.loginModal) {
            closeModals();
        }
        if (e.target === elements.requestModal) {
            closeModals();
        }
    });
    
    // Search and Filter
    elements.searchInput.addEventListener('input', filterVideos);
    elements.sortAlphaBtn.addEventListener('click', sortVideosAlphabetically);
    elements.sortDateBtn.addEventListener('click', sortVideosByDate);
    elements.applyDateFilterBtn.addEventListener('click', applyDateFilter);
    elements.clearDateFilterBtn.addEventListener('click', clearDateFilter);
    
    // Request Button and Form
    elements.requestVideoBtn.addEventListener('click', openRequestModal);
    elements.requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = submitRequest(
            elements.videoUrl.value,
            elements.videoTitle.value,
            elements.requestReason.value
        );
        
        if (success) {
            elements.requestForm.reset();
            closeModals();
            alert('Richiesta inviata con successo!');
        }
    });

    
    // Admin Add Video Form
    elements.addVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = addVideo(
            elements.adminVideoUrl.value,
            elements.adminVideoTitle.value
        );
        
        if (success) {
            elements.addVideoForm.reset();
        }
    });
    
    // Admin Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            
            // Hide all tab content
            elements.adminGallery.classList.add('hidden');
            elements.adminRequests.classList.add('hidden');
            
            // Show selected tab content
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
}

// Gestione sezioni dinamiche
let sezioni = [
    {
        nome: "Musica",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCB8hjHT54Jr_dx4oGd13VV9"
    },
    {
        nome: "Arte",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCByEoWtqaUywM7yifVNwdUS"
    },
    {
        nome: "Arte-Terapia",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCD8pum5M4kybk0LdvvZp8v3"
    },
    {
        nome: "Città",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCD-8Roi1wU3V59sdpyoKsgv"
    },
    {
        nome: "Filosofia",
        playlist: "https://www.youtube.com/embed/videoseries?list=PL30nV9p8EmCBcOCiNnCDZKiGy854_bezs"
    }
];

function renderSezioni() {
    const container = document.getElementById('dynamic-sections');
    if (!container) return;
    container.innerHTML = '';
    sezioni.forEach(sec => {
        const card = document.createElement('div');
        card.className = 'bio-card';
        card.innerHTML = `
            <div class="bio-info">
                <div class="bio-text">
                    <h3>${sec.nome}</h3>
                    <div class="video-embed">
                        <iframe width="360" height="203" src="${sec.playlist}" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderSezioniAdmin() {
    const container = document.getElementById('admin-sections-list');
    if (!container) return;
    container.innerHTML = '';
    sezioni.forEach((sec, idx) => {
        const li = document.createElement('li');
        li.textContent = `${sec.nome} (${sec.playlist})`;
        container.appendChild(li);
    });
}

function setupSectionForm() {
    const form = document.getElementById('section-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('section-name').value.trim();
            const playlist = document.getElementById('section-playlist').value.trim();
            if (name && playlist) {
                sezioni.push({ nome: name, playlist });
                renderSezioni();
                renderSezioniAdmin();
                document.getElementById('section-form-success').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('section-form-success').style.display = 'none';
                }, 2000);
                form.reset();
            }
        });
    }
}

// Initialization
function init() {
    loadData();
    setupEventListeners();
    updateUIForAuthState();
    renderSezioni();
    renderSezioniAdmin();
    setupSectionForm();
}

document.addEventListener('DOMContentLoaded', init);
