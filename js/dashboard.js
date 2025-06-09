// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", async () => {
  // Controlla se l'utente è loggato
  const userJson = localStorage.getItem("arteAnima_currentUser")
  if (!userJson) {
    window.location.href = "login.html"
    return
  }

  const currentUser = JSON.parse(userJson)
  console.log("👤 Utente corrente:", currentUser)

  // Menu toggle per mobile
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Aggiorna info utente
  function updateUserInfo() {
    document.getElementById("user-name").textContent = currentUser.name
    document.getElementById("user-email").textContent = currentUser.email

    // Avatar con iniziale
    const userAvatar = document.getElementById("user-avatar")
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"
    userAvatar.textContent = initial

    // Badge admin
    if (currentUser.is_admin) {
      document.getElementById("admin-badge").style.display = "block"
    }

    // Popola campi profilo
    document.getElementById("user-description").value = currentUser.description || ""
    document.getElementById("user-youtube").value = currentUser.youtube_channel || ""
  }

  // Logout
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("arteAnima_currentUser")
    window.location.href = "index.html"
  })

  // Aggiorna profilo
  document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const description = document.getElementById("user-description").value.trim()
    const youtubeChannel = document.getElementById("user-youtube").value.trim()

    try {
      await window.db.updateProfile(currentUser.id, {
        description,
        youtubeChannel,
      })

      // Aggiorna dati locali
      currentUser.description = description
      currentUser.youtube_channel = youtubeChannel
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(currentUser))

      alert("Profilo aggiornato con successo!")
    } catch (error) {
      alert("Errore: " + error.message)
    }
  })

  // Carica video utente
  async function loadUserVideos() {
    try {
      const loadingEl = document.getElementById("loading")
      const videosContainer = document.getElementById("videos-container")

      loadingEl.style.display = "block"
      videosContainer.style.display = "none"

      const videos = await window.db.getUserVideos(currentUser.id)
      displayUserVideos(videos)

      // Aggiorna stats
      document.getElementById("total-videos").textContent = videos.length
    } catch (error) {
      console.error("Errore caricamento video:", error)
      alert("Errore nel caricamento dei video: " + error.message)
    } finally {
      document.getElementById("loading").style.display = "none"
      document.getElementById("videos-container").style.display = "grid"
    }
  }

  // Mostra video utente
  function displayUserVideos(videos) {
    const videosContainer = document.getElementById("videos-container")
    videosContainer.innerHTML = ""

    if (videos.length === 0) {
      videosContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-video-slash"></i>
          <h3>Nessun video</h3>
          <p>Aggiungi il tuo primo video!</p>
        </div>
      `
      return
    }

    videos.forEach((video) => {
      const videoId = window.db.extractYouTubeId(video.url)
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
            <span>${new Date(video.created_at).toLocaleDateString("it-IT")}</span>
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

  // Modal video
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

  // Aggiungi video
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
      await window.db.addVideo(currentUser.id, { title, url, description })

      document.getElementById("add-video-form").reset()
      addVideoModal.style.display = "none"

      await loadUserVideos()
    } catch (error) {
      alert("Errore: " + error.message)
    }
  })

  // Elimina video (funzione globale)
  window.deleteVideo = async (videoId) => {
    if (!confirm("Sei sicuro di voler eliminare questo video?")) return

    try {
      await window.db.deleteVideo(videoId, currentUser.id)
      await loadUserVideos()
    } catch (error) {
      alert("Errore: " + error.message)
    }
  }

  // Gestione cambio password
  const passwordModal = document.getElementById('password-modal');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const closeBtn = document.querySelector('.close');
  const changePasswordForm = document.getElementById('change-password-form');
  const passwordMessage = document.getElementById('password-message');

  // Apri modale
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
      passwordModal.style.display = 'flex';
    });
  }

  // Chiudi modale
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      passwordModal.style.display = 'none';
      resetPasswordForm();
    });
  }

  // Chiudi cliccando fuori dal modale
  window.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
      passwordModal.style.display = 'none';
      resetPasswordForm();
    }
  });

  // Reset form
  function resetPasswordForm() {
    if (changePasswordForm) changePasswordForm.reset();
    if (passwordMessage) {
      passwordMessage.textContent = '';
      passwordMessage.className = 'message';
    }
  }

  // Invia form cambio password
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      // Validazione
      if (newPassword !== confirmPassword) {
        showMessage('Le password non corrispondono', 'error');
        return;
      }

      if (newPassword.length < 6) {
        showMessage('La password deve essere lunga almeno 6 caratteri', 'error');
        return;
      }

      try {
        // Aggiorna la password
        const { data, error: updateError } = await db.supabase.auth.updateUser({
          password: newPassword
        });

        if (updateError) throw updateError;
        
        // Aggiorna la password anche nella tabella users (se necessario)
        const { error: dbError } = await db.supabase
          .from('users')
          .update({ password: newPassword })
          .eq('id', currentUser.id);

        if (dbError) throw dbError;
        
        showMessage('Password aggiornata con successo!', 'success');
        setTimeout(() => {
          passwordModal.style.display = 'none';
          resetPasswordForm();
        }, 2000);
        
      } catch (error) {
        console.error('Errore durante il cambio password:', error);
        const errorMessage = error.message || 'Errore durante il cambio password. Riprova più tardi.';
        showMessage(errorMessage, 'error');
      }
    });
  }

  // Mostra messaggio
  function showMessage(message, type) {
    if (!passwordMessage) return;
    passwordMessage.textContent = message;
    passwordMessage.className = `message ${type}`;
  }

  // Inizializza
  updateUserInfo();
  await loadUserVideos();
})
