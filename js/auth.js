document.addEventListener("DOMContentLoaded", () => {
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

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    const errorEl = document.getElementById("login-error")
    const successEl = document.getElementById("login-success")

    errorEl.textContent = ""
    successEl.textContent = ""

    try {
      const user = await api.loginUser(email, password)

      // Salva utente corrente (senza password)
      const { password: pwd, ...userInfo } = user
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(userInfo))

      successEl.textContent = user.isAdmin ? "Login Admin effettuato!" : "Login effettuato con successo!"

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } catch (error) {
      errorEl.textContent = error.message
    }
  })

  // Register form
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("register-name").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const errorEl = document.getElementById("register-error")
    const successEl = document.getElementById("register-success")

    errorEl.textContent = ""
    successEl.textContent = ""

    if (password.length < 6) {
      errorEl.textContent = "La password deve essere di almeno 6 caratteri"
      return
    }

    try {
      const user = await api.registerUser({ name, email, password })

      // Auto login
      const { password: pwd, ...userInfo } = user
      localStorage.setItem("arteAnima_currentUser", JSON.stringify(userInfo))

      successEl.textContent = "Registrazione completata!"

      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } catch (error) {
      errorEl.textContent = error.message
    }
  })

  // Check if already logged in
  const currentUser = localStorage.getItem("arteAnima_currentUser")
  if (currentUser) {
    window.location.href = "dashboard.html"
  }
})

const api = {
  loginUser: async (email, password) => {
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@example.com" && password === "password") {
          resolve({ name: "Admin User", email: "admin@example.com", isAdmin: true })
        } else if (email === "user@example.com" && password === "password") {
          resolve({ name: "Test User", email: "user@example.com", isAdmin: false })
        } else {
          reject(new Error("Credenziali non valide"))
        }
      }, 500)
    })
  },
  registerUser: async (userData) => {
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password) {
          resolve({ name: userData.name, email: userData.email, isAdmin: false })
        } else {
          reject(new Error("Dati di registrazione non validi"))
        }
      }, 500)
    })
  },
}
