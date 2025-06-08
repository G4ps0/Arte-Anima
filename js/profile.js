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
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatar-preview');
    
    // Utente corrente
    let currentUser = null;
    
    // Inizializza la pagina
    async function init() {
        try {
            // Verifica se l'utente è loggato
            const userData = localStorage.getItem('user');
            if (!userData) {
                // Se non c'è utente loggato, reindirizza al login
                window.location.href = 'login.html';
                return;
            }
            
            currentUser = JSON.parse(userData);
            await loadProfile();
            setupEventListeners();
            
        } catch (error) {
            console.error('Errore durante l\'inizializzazione:', error);
            showAlert('Si è verificato un errore durante il caricamento del profilo.', 'error');
        }
    }
    
    // Carica i dati del profilo utente
    async function loadProfile() {
        try {
            if (!currentUser) return;
            
            // Aggiorna le informazioni del profilo
            if (profileName) profileName.textContent = currentUser.name || 'Utente';
            if (profileEmail) profileEmail.textContent = currentUser.email || '';
            
            // Formatta e mostra la data di iscrizione
            if (memberSince && currentUser.created_at) {
                const joinDate = new Date(currentUser.created_at);
                memberSince.textContent = `Membro da ${joinDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
            }
            
            // Carica la descrizione e i link sociali
            if (description) description.value = currentUser.description || '';
            
            // Inizializza social_links se non esiste
            currentUser.social_links = currentUser.social_links || {
                youtube: '',
                instagram: '',
                website: '',
                other: ''
            };
            
            // Imposta i valori dei campi social
            const socialLinks = currentUser.social_links;
            if (youtubeInput) youtubeInput.value = socialLinks.youtube || '';
            if (instagramInput) instagramInput.value = socialLinks.instagram || '';
            if (websiteInput) websiteInput.value = socialLinks.website || '';
            if (otherInput) otherInput.value = socialLinks.other || '';
            
            // Imposta l'anteprima dell'avatar se presente
            if (currentUser.avatar_url && avatarPreview) {
                avatarPreview.style.backgroundImage = `url('${currentUser.avatar_url}')`;
                avatarPreview.textContent = '';
            } else if (avatarPreview) {
                avatarPreview.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
            }
            
        } catch (error) {
            console.error('Errore durante il caricamento del profilo:', error);
            showAlert('Si è verificato un errore durante il caricamento del profilo.', 'error');
        }
    }
    
    // Gestisce l'invio del form del profilo
    async function handleProfileSubmit(e) {
        e.preventDefault();
        
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
            
            // Gestisci l'upload dell'avatar se presente (opzionale)
            const avatarFile = avatarInput.files && avatarInput.files[0];
            if (avatarFile) {
                try {
                    // Se l'upload fallisce, continua comunque con il salvataggio
                    await handleAvatarUpload(avatarFile);
                } catch (error) {
                    console.log('Upload avatar saltato:', error.message);
                    // Continua con il salvataggio anche in caso di errore
                }
            }
            
            // Salva le modifiche nel database
            const { data, error } = await window.db.supabase
                .from('users')
                .update({
                    description: updates.description,
                    social_links: updates.social_links,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentUser.id)
                .select()
                .single();
            
            if (error) throw error;
            
            // Aggiorna i dati dell'utente corrente
            currentUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showAlert('Profilo aggiornato con successo!', 'success');
            
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
    
    // Gestisce l'upload dell'avatar (opzionale)
    async function handleAvatarUpload(file) {
        // Se non c'è nessun file, esci dalla funzione
        if (!file) return null;
        
        try {
            // Verifica che il file sia un'immagine (se fornito)
            if (!file.type.match('image.*')) {
                console.log('File non è un\'immagine, salto l\'upload');
                return null;
            }
            
            // Se il file è troppo grande, esci senza errori
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_SIZE) {
                console.log('Immagine troppo grande, salto l\'upload');
                return null;
            }
            
            // Mostra l'anteprima
            const previewUrl = URL.createObjectURL(file);
            if (avatarPreview) {
                avatarPreview.style.backgroundImage = `url('${previewUrl}')`;
                avatarPreview.textContent = '';
            }
            
            // Prepara il nome del file
            const fileExt = file.name.split('.').pop();
            const fileName = `avatars/${currentUser.id}-${Date.now()}.${fileExt}`;
            
            // Carica il file su Supabase Storage
            const { data: uploadData, error: uploadError } = await window.db.supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });
            
            if (uploadError) throw uploadError;
            
            // Ottieni l'URL pubblico del file
            const { data: { publicUrl } } = window.db.supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
            
            // Aggiorna l'URL dell'avatar nel profilo utente
            const { data: userData, error: updateError } = await window.db.supabase
                .from('users')
                .update({ 
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentUser.id)
                .select()
                .single();
                
            if (updateError) throw updateError;
            
            // Aggiorna i dati dell'utente corrente
            currentUser.avatar_url = userData.avatar_url;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            return publicUrl;
            
        } catch (error) {
            console.error('Errore durante il caricamento dell\'avatar:', error);
            throw error;
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
    
    // Mostra un messaggio di avviso
    function showAlert(message, type = 'info') {
        // Rimuovi eventuali alert esistenti
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Crea il nuovo alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Aggiungi l'alert in cima alla pagina
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.insertBefore(alertDiv, mainContent.firstChild);
            
            // Rimuovi l'alert dopo 5 secondi
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }
    
    // Imposta i gestori degli eventi
    function setupEventListeners() {
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileSubmit);
        }
        
        // Gestisci il cambio dell'immagine dell'avatar
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (avatarPreview) {
                            avatarPreview.style.backgroundImage = `url('${event.target.result}')`;
                            avatarPreview.textContent = '';
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
    }
    
    // Avvia l'inizializzazione
    init();
});
