document.addEventListener("DOMContentLoaded", async () => {
  // Aspetta che l'API sia inizializzata
  console.log("🔐 Inizializzazione pagina di autenticazione...")

  // Aspetta che l'API sia pronta
  while (!window.api) {
    console.log("⏳ Aspettando inizializzazione API...")
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log("✅ API pronta per l'autenticazione")

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab")

      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      tabContents.forEach((content) => {
        content.classList.add("hidden")
        if (content.id === tabId + "-tab") {
          content.classList.remove("hidden")
        }
      })
    })
  })

  // Login form
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("login-email").value.trim()
    const password = document.getElementById("login-password").value
    const errorEl = document.getElementById("login-error")
    const successEl = document.getElementById("login-success")
    const submitBtn = e.target.querySelector('button[type="submit"]')

    // Reset messaggi
    errorEl.textContent = ""
    successEl.textContent = ""

    // Disabilita il bottone durante il login
    submitBtn.disabled = true
    submitBtn.textContent = "Accesso in corso..."

    try {
      console.log("🔑 Tentativo di login per:", email)
      const user = await window.api.loginUser(email, password)
      console.log("✅ Login riuscito:", user)

      // Salva utente corrente (senza password)
      const { password: pwd, ...userInfo } = user
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(userInfo))

      successEl.textContent = user.isAdmin ? "Login Admin effettuato!" : "Login effettuato con successo!"

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } catch (error) {
      console.error("❌ Errore login:", error)
      errorEl.textContent = error.message

      // Riabilita il bottone
      submitBtn.disabled = false
      submitBtn.textContent = "Accedi"
    }
  })

  // Gestione anteprima avatar
  const registerAvatarInput = document.getElementById('register-avatar');
  const registerAvatarPreview = document.getElementById('register-avatar-preview');
  
  if (registerAvatarInput && registerAvatarPreview) {
    registerAvatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          registerAvatarPreview.style.backgroundImage = `url('${e.target.result}')`;
          registerAvatarPreview.innerHTML = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Register form
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("register-name").value.trim()
    const email = document.getElementById("register-email").value.trim()
    const password = document.getElementById("register-password").value
    const description = document.getElementById("register-description").value.trim()
    const avatarFile = document.getElementById("register-avatar").files[0]
    const errorEl = document.getElementById("register-error")
    const successEl = document.getElementById("register-success")
    const submitBtn = e.target.querySelector('button[type="submit"]')

    // Reset messaggi
    errorEl.textContent = ""
    successEl.textContent = ""

    // Validazioni
    if (!name) {
      errorEl.textContent = "Il nome è obbligatorio"
      return
    }

    if (!email) {
      errorEl.textContent = "L'email è obbligatoria"
      return
    }

    if (password.length < 6) {
      errorEl.textContent = "La password deve essere di almeno 6 caratteri"
      return
    }

    // Disabilita il bottone durante la registrazione
    submitBtn.disabled = true
    submitBtn.textContent = "Registrazione in corso..."

    try {
      console.log("📝 Tentativo di registrazione per:", email)
      
      // 1. Registra l'utente
      const user = await window.api.registerUser({ 
        name, 
        email, 
        password,
        description,
        avatarFile
      })
      
      console.log("✅ Registrazione riuscita:", user)

      // 2. Auto login dopo registrazione
      const { password: pwd, ...userInfo } = user
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(userInfo))

      successEl.textContent = "Registrazione completata!"

      setTimeout(() => {
        window.location.href = "profile.html" // Reindirizza alla pagina del profilo
      }, 1000)
    } catch (error) {
      console.error("❌ Errore registrazione:", error)
      errorEl.textContent = typeof error === 'string' ? error : (error.message || "Si è verificato un errore durante la registrazione")

      // Riabilita il bottone
      submitBtn.disabled = false
      submitBtn.textContent = "Registrati"
    }
  })

  // Check if already logged in
  const currentUser = localStorage.getItem("arteAnima_currentUser")
  if (currentUser) {
    console.log("👤 Utente già loggato, reindirizzamento...")
    window.location.href = "dashboard.html"
  }
})
