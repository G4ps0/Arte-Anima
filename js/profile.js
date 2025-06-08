document.addEventListener('DOMContentLoaded', async () => {
    // Elementi del DOM
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const memberSince = document.getElementById('memberSince');
    const description = document.getElementById('description');
    const youtubeInput = document.getElementById('youtube');
    const instagramInput = document.getElementById('instagram');
    const websiteInput = document.getElementById('website');
    const otherInput = document.getElementById('other');
    const profileForm = document.getElementById('profileForm');
    const myVideos = document.getElementById('myVideos');
    const profileActions = document.querySelector('.profile-actions');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const backToArtistsBtn = document.getElementById('backToArtistsBtn');
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Utente corrente e utente visualizzato
    let currentUser = null;
    let isViewingOwnProfile = true;
    let viewedUser = null;
    
    // Inizializza la pagina
    async function init() {
        try {
            // Verifica se c'è un ID utente nell'URL
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('id');
            
            // Verifica se l'utente è loggato
            const userData = localStorage.getItem('user');
            if (!userData && !userId) {
                // Se non c'è utente loggato né ID utente, reindirizza al login
                window.location.href = 'login.html';
                return;
            }
            
            if (userData) {
                currentUser = JSON.parse(userData);
            }
            
            if (userId) {
                // Se c'è un ID utente nell'URL, carica quel profilo
                isViewingOwnProfile = currentUser && currentUser.id === userId;
                await loadUserProfile(userId);
            } else if (currentUser) {
                // Altrimenti carica il profilo dell'utente loggato
                viewedUser = { ...currentUser };
                await loadProfile();
            }
            
            // Imposta i gestori degli eventi
            setupEventListeners();
            
            // Aggiorna l'interfaccia in base al tipo di visualizzazione
            updateUIForViewMode();
            
        } catch (error) {
            console.error('Errore durante l\'inizializzazione:', error);
            showAlert('Si è verificato un errore durante il caricamento del profilo.', 'error');
        }
    }
    
    // Carica i dati del profilo di un utente specifico
    async function loadUserProfile(userId) {
        try {
            // Qui dovresti implementare una chiamata API per ottenere i dati dell'utente
            // Per ora usiamo i dati dell'utente corrente se corrisponde all'ID
            if (currentUser && currentUser.id === userId) {
                viewedUser = { ...currentUser };
            } else {
                // Simuliamo il caricamento dei dati dell'utente
                // In un'applicazione reale, qui faresti una chiamata API
                const allArtists = await window.db.getPublicArtists();
                viewedUser = allArtists.find(artist => artist.id === userId);
                
                if (!viewedUser) {
                    throw new Error('Utente non trovato');
                }
            }
            
            await loadProfile();
            
        } catch (error) {
            console.error('Errore durante il caricamento del profilo utente:', error);
            showAlert('Impossibile caricare il profilo richiesto.', 'error');
            window.location.href = 'explore.html';
        }
    }
    
    // Carica i dati del profilo utente
    async function loadProfile() {
        try {
            const user = await window.db.getCurrentUser();
            if (!user) return;
            
            // Aggiorna l'UI con i dati dell'utente
            document.getElementById('profileName').textContent = user.name || 'Utente';
            document.getElementById('profileEmail').textContent = user.email || '';
            
            // Formatta la data di iscrizione
            if (user.created_at) {
                const joinDate = new Date(user.created_at);
                document.getElementById('memberSince').textContent = joinDate.toLocaleDateString('it-IT');
            }
            
            // Carica i dati aggiuntivi del profilo se disponibili
            if (user.description || user.social_links) {
                // Imposta la descrizione
                if (user.description) {
                    document.getElementById('description').value = user.description;
                }
                
                // Imposta i link sociali
                if (user.social_links) {
                    const socialLinks = user.social_links;
                    if (socialLinks.youtube) document.getElementById('youtube').value = socialLinks.youtube;
                    if (socialLinks.instagram) document.getElementById('instagram').value = socialLinks.instagram;
                    if (socialLinks.website) document.getElementById('website').value = socialLinks.website;
                    if (socialLinks.other) document.getElementById('other').value = socialLinks.other;
                }
            }
            
            // Imposta l'utente corrente
            currentUser = user;
            
            // Inizializza i link sociali vuoti se non esistono
            if (!currentUser.social_links) {
                currentUser.social_links = {
                    youtube: '',
                    instagram: '',
                    website: '',
                    other: ''
                };
            }
            
            // Imposta i link social
            youtubeInput.value = socialLinks.youtube || '';
            instagramInput.value = socialLinks.instagram || '';
            websiteInput.value = socialLinks.website || '';
            otherInput.value = socialLinks.other || '';
            
            // Carica i video dell'utente
            await loadUserVideos();
            
        } catch (error) {
            console.error('Errore durante il caricamento del profilo:', error);
            throw error;
        }
    }
    
    // Carica i video dell'utente
    async function loadUserVideos() {
        try {
            myVideos.innerHTML = '<p>Caricamento dei tuoi video...</p>';
            
            const videos = await window.db.getUserVideos(currentUser.id);
            
            if (videos.length === 0) {
                myVideos.innerHTML = `
                    <div class="no-videos">
                        <i class="fas fa-video-slash"></i>
                        <p>Non hai ancora caricato nessun video.</p>
                        <a href="videos.html" class="btn btn-primary">Carica il tuo primo video</a>
                    </div>
                `;
                return;
            }
            
            let videosHTML = '<h3>I tuoi video</h3><div class="video-grid">';
            
            videos.forEach(video => {
                const videoId = window.db.extractYouTubeId(video.url);
                const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
                
                videosHTML += `
                    <div class="video-card" data-video-id="${video.id}">
                        <div class="video-thumbnail">
                            <iframe 
                                src="${videoUrl}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="video-info">
                            <h4>${video.title || 'Video senza titolo'}</h4>
                            <div class="video-meta">
                                <span>${formattedDate}</span>
                                ${isViewingOwnProfile ? `
                                    <button class="btn btn-text btn-delete-video" data-video-id="${video.id}" title="Elimina video">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            videosHTML += '</div>';
            myVideos.innerHTML = videosHTML;
            
            // Aggiungi gestori eventi per i pulsanti di eliminazione
            document.querySelectorAll('.btn-delete-video').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const videoId = btn.getAttribute('data-video-id');
                    if (videoId) {
                        handleDeleteVideo(videoId);
                    }
                });
            });
            
            // Aggiungi gestore eventi per la visualizzazione del video
            document.querySelectorAll('.video-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Se il click non è su un pulsante di eliminazione
                    if (!e.target.closest('.btn-delete-video')) {
                        const iframe = item.querySelector('iframe');
                        if (iframe) {
                            // Apri il video in una nuova scheda
                            window.open(iframe.src, '_blank');
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error('Errore durante il caricamento dei video:', error);
            myVideos.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i>
                    Si è verificato un errore durante il caricamento dei video. Riprova più tardi.
                </div>
            `;
        }
    }
    
    // Gestisce l'invio del form del profilo
    async function handleProfileSubmit(e) {
        e.preventDefault();
        
        // Verifica che l'utente stia visualizzando il proprio profilo
        if (!isViewingOwnProfile) {
            showAlert('Non hai il permesso di modificare questo profilo.', 'error');
            return;
        }
        
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        try {
            // Mostra un indicatore di caricamento
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvataggio...';
            
            // Prepara i dati da aggiornare
            const updates = {
                description: description.value.trim(),
                social_links: {
                    youtube: youtubeInput.value.trim(),
                    instagram: instagramInput.value.trim(),
                    website: websiteInput.value.trim(),
                    other: otherInput.value.trim()
                }
            };
            
            // Valida gli URL
            if (updates.social_links.youtube && !isValidUrl(updates.social_links.youtube)) {
                throw new Error('Inserisci un URL YouTube valido');
            }
            if (updates.social_links.instagram && !isValidUrl(updates.social_links.instagram)) {
                throw new Error('Inserisci un URL Instagram valido');
            }
            if (updates.social_links.website && !isValidUrl(updates.social_links.website)) {
                throw new Error('Inserisci un URL del sito web valido');
            }
            if (updates.social_links.other && !isValidUrl(updates.social_links.other)) {
                throw new Error('Inserisci un URL valido per il link aggiuntivo');
            }
            
            // Aggiorna il profilo
            const success = await window.db.updateUserProfile(currentUser.id, updates);
            
            if (success) {
                // Aggiorna i dati dell'utente corrente
                currentUser = { ...currentUser, ...updates };
                viewedUser = { ...currentUser };
                
                // Aggiorna i dati nell'archivio locale
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                // Mostra un messaggio di successo
                showAlert('Profilo aggiornato con successo!', 'success');
                
                // Aggiorna la visualizzazione del profilo
                updateProfileView();
            } else {
                throw new Error('Impossibile aggiornare il profilo');
            }
            
        } catch (error) {
            console.error('Errore durante il salvataggio del profilo:', error);
            showAlert(error.message || 'Si è verificato un errore durante il salvataggio. Riprova più tardi.', 'error');
        } finally {
            // Ripristina il pulsante di invio
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    }
    
    // Funzione per validare gli URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // Aggiorna la visualizzazione del profilo
    function updateProfileView() {
        if (!viewedUser) return;
        
        // Aggiorna la descrizione
        const descriptionElement = document.querySelector('.profile-description');
        if (descriptionElement) {
            descriptionElement.textContent = viewedUser.description || 'Nessuna descrizione disponibile';
        }
        
        // Aggiorna i link sociali nella visualizzazione
        const socialLinksContainer = document.querySelector('.social-links');
        if (socialLinksContainer) {
            const socialLinks = viewedUser.social_links || {};
            
            let socialLinksHTML = '';
            
            if (socialLinks.youtube) {
                socialLinksHTML += `
                    <a href="${socialLinks.youtube}" target="_blank" class="social-link youtube">
                        <i class="fab fa-youtube"></i>
                    </a>
                `;
            }
            
            if (socialLinks.instagram) {
                socialLinksHTML += `
                    <a href="${socialLinks.instagram}" target="_blank" class="social-link instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                `;
            }
            
            if (socialLinks.website) {
                socialLinksHTML += `
                    <a href="${socialLinks.website}" target="_blank" class="social-link website">
                        <i class="fas fa-globe"></i>
                    </a>
                `;
            }
            
            if (socialLinks.other) {
                socialLinksHTML += `
                    <a href="${socialLinks.other}" target="_blank" class="social-link other">
                        <i class="fas fa-link"></i>
                    </a>
                `;
            }
            
            socialLinksContainer.innerHTML = socialLinksHTML || '<p>Nessun link sociale disponibile</p>';
        }
    }
    
    // Mostra un messaggio di avviso
    function showAlert(message, type = 'info') {
        // Rimuovi eventuali messaggi precedenti
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `<p>${message}</p>`;
        
        // Inserisci il messaggio all'inizio del form
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(alertDiv, form.firstChild);
        }
        
        // Rimuovi il messaggio dopo 5 secondi
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
    
    // Aggiorna l'interfaccia in base alla modalità di visualizzazione
    function updateUIForViewMode() {
        if (!isViewingOwnProfile) {
            // Modalità visualizzazione (profilo pubblico)
            if (profileForm) {
                profileForm.style.display = 'none';
                // Mostra i link social come elementi di sola lettura
                const socialLinks = viewedUser?.social_links || {};
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
                
                // Mostra la descrizione e i link social come testo
                const profileContent = `
                    <div class="profile-content">
                        ${viewedUser?.description ? `<div class="profile-description">${viewedUser.description}</div>` : ''}
                        ${socialLinksHTML}
                    </div>
                `;
                
                // Inserisci il contenuto del profilo
                const profileTab = document.getElementById('profile-tab');
                if (profileTab) {
                    profileTab.innerHTML = profileContent;
                }
            }
            
            if (editProfileBtn) editProfileBtn.style.display = 'none';
            if (backToArtistsBtn) backToArtistsBtn.style.display = 'inline-flex';
            
        } else {
            // Modalità modifica (proprio profilo)
            if (profileForm) {
                profileForm.style.display = 'block';
            }
            
            if (editProfileBtn) {
                editProfileBtn.style.display = 'inline-flex';
                // Nascondi il pulsante di modifica se già in modalità modifica
                if (profileForm && profileForm.style.display === 'block') {
                    editProfileBtn.style.display = 'none';
                }
            }
            
            if (backToArtistsBtn) backToArtistsBtn.style.display = 'none';
            
            // Abilita/disabilita i campi del form in base alla modalità
            const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea, #profileForm button');
            const isFormVisible = profileForm && profileForm.style.display === 'block';
            
            formInputs.forEach(input => {
                input.disabled = !isFormVisible;
            });
        }
        
        // Aggiorna lo stato attivo della scheda
        const activeTab = isViewingOwnProfile ? 'profile' : 'videos';
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === activeTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Aggiorna la visibilità dei pannelli delle schede
        tabPanes.forEach(pane => {
            if (pane.id === `${activeTab}-tab`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }
    
    // Imposta i gestori degli eventi
    function setupEventListeners() {
        // Gestione delle schede
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Aggiorna i pulsanti delle schede
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostra il contenuto della scheda selezionata
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `${tabId}-tab`) {
                        pane.classList.add('active');
                    }
                });
                
                // Se si passa alla scheda video, ricarica i video
                if (tabId === 'videos' && viewedUser) {
                    loadUserVideos();
                }
            });
        });
        
        // Gestione del form del profilo
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileSubmit);
        }
        
        // Pulsante per tornare alla lista artisti
        if (backToArtistsBtn) {
            backToArtistsBtn.addEventListener('click', () => {
                window.location.href = 'explore.html';
            });
        }
        
        // Pulsante per annullare le modifiche
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                // Ricarica i dati originali del profilo
                if (viewedUser) {
                    loadProfile();
                }
            });
        }
        
        // Pulsante per attivare la modifica del profilo
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                // Attiva la modalità modifica
                isViewingOwnProfile = true;
                updateUIForViewMode();
                
                // Mostra la scheda del profilo
                tabBtns.forEach(btn => {
                    if (btn.getAttribute('data-tab') === 'profile') {
                        btn.click();
                    }
                });
            });
        }
    }
    
    // Funzione per gestire l'eliminazione di un video
    async function handleDeleteVideo(videoId) {
        if (!videoId) return;
        
        // Mostra un dialog di conferma personalizzato
        const confirmDelete = await showConfirmDialog(
            'Conferma eliminazione',
            'Sei sicuro di voler eliminare questo video? Questa azione non può essere annullata.',
            'Elimina',
            'Annulla'
        );
        
        if (!confirmDelete) return;
        
        try {
            // Mostra un indicatore di caricamento
            const deleteBtn = document.querySelector(`.btn-delete-video[data-video-id="${videoId}"]`);
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }
            
            // Chiama la funzione per eliminare il video
            const success = await window.db.deleteVideo(videoId);
            
            if (success) {
                // Mostra un messaggio di successo
                showAlert('Video eliminato con successo!', 'success');
                
                // Ricarica la lista dei video
                await loadUserVideos();
                
                // Aggiorna il contatore dei video nel profilo se necessario
                if (viewedUser && viewedUser.totalVideos !== undefined) {
                    viewedUser.totalVideos = Math.max(0, viewedUser.totalVideos - 1);
                    updateVideoCount();
                }
            } else {
                throw new Error('Impossibile eliminare il video');
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione del video:', error);
            showAlert('Si è verificato un errore durante l\'eliminazione del video. Riprova più tardi.', 'error');
            
            // Ripristina il pulsante di eliminazione in caso di errore
            const deleteBtn = document.querySelector(`.btn-delete-video[data-video-id="${videoId}"]`);
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            }
        }
    }
    
    // Mostra un dialog di conferma personalizzato
    function showConfirmDialog(title, message, confirmText, cancelText) {
        return new Promise((resolve) => {
            // Crea il contenitore del dialog
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog-overlay';
            dialog.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-dialog-header">
                        <h3>${title}</h3>
                        <button class="close-dialog">&times;</button>
                    </div>
                    <div class="confirm-dialog-body">
                        <p>${message}</p>
                    </div>
                    <div class="confirm-dialog-footer">
                        <button class="btn btn-outline" id="cancelBtn">${cancelText || 'Annulla'}</button>
                        <button class="btn btn-danger" id="confirmBtn">${confirmText || 'Conferma'}</button>
                    </div>
                </div>
            `;
            
            // Aggiungi il dialog al documento
            document.body.appendChild(dialog);
            document.body.style.overflow = 'hidden';
            
            // Gestisci i pulsanti
            const confirmBtn = dialog.querySelector('#confirmBtn');
            const cancelBtn = dialog.querySelector('#cancelBtn');
            const closeBtn = dialog.querySelector('.close-dialog');
            
            // Funzione per chiudere il dialog
            const closeDialog = (result) => {
                document.body.removeChild(dialog);
                document.body.style.overflow = '';
                resolve(result);
            };
            
            // Aggiungi gestori eventi
            confirmBtn.addEventListener('click', () => closeDialog(true));
            cancelBtn.addEventListener('click', () => closeDialog(false));
            closeBtn.addEventListener('click', () => closeDialog(false));
            
            // Chiudi il dialog cliccando fuori dal contenuto
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    closeDialog(false);
                }
            });
        });
    }
    
    // Aggiorna il contatore dei video nel profilo
    function updateVideoCount() {
        const videoCount = viewedUser?.totalVideos || 0;
        const videoTabBtn = document.querySelector('.tab-btn[data-tab="videos"]');
        if (videoTabBtn) {
            const countBadge = videoTabBtn.querySelector('.badge') || document.createElement('span');
            countBadge.className = 'badge';
            countBadge.textContent = videoCount;
            
            if (!videoTabBtn.querySelector('.badge')) {
                videoTabBtn.appendChild(document.createTextNode(' '));
                videoTabBtn.appendChild(countBadge);
            }
        }
    }
    
    // Avvia l'inizializzazione
    init();
});
