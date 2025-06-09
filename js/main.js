// Main JavaScript per Arte Anima
document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle per mobile
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Controlla se l'utente è loggato
  const currentUser = localStorage.getItem("arteAnima_currentUser")
  const authBtn = document.getElementById("auth-btn")

  if (currentUser && authBtn) {
    authBtn.textContent = "Dashboard"
    authBtn.href = "dashboard.html"
  }

  console.log("🚀 Arte Anima inizializzata")
})
