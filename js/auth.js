// Gestione autenticazione
document.addEventListener("DOMContentLoaded", () => {
  // Gestione Login
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const messageEl = document.getElementById("login-message")

    try {
      messageEl.textContent = "Accesso in corso..."
      messageEl.className = "message show"

      const user = await window.db.loginUser(email, password)

      messageEl.textContent = "Accesso riuscito! Reindirizzamento..."
      messageEl.className = "message show success"

      // Salva utente in localStorage
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(user))

      // Reindirizza alla dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } catch (error) {
      messageEl.textContent = error.message
      messageEl.className = "message show error"
    }
  })

  // Gestione Registrazione
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("register-name").value.trim()
    const email = document.getElementById("register-email").value.trim()
    const password = document.getElementById("register-password").value
    const description = document.getElementById("register-description").value.trim()
    const youtubeChannel = document.getElementById("register-youtube").value.trim()
    const messageEl = document.getElementById("register-message")

    try {
      messageEl.textContent = "Registrazione in corso..."
      messageEl.className = "message show"

      const user = await window.db.registerUser({
        name,
        email,
        password,
        description,
        youtubeChannel,
      })

      messageEl.textContent = "Registrazione completata!"
      messageEl.className = "message show success"

      // Salva utente in localStorage
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(user))

      // Reindirizza alla dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } catch (error) {
      messageEl.textContent = error.message
      messageEl.className = "message show error"
    }
  })
})
