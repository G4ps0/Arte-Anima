document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle for mobile
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })
  }

  // Check if user is logged in and update auth button
  const authBtn = document.getElementById("auth-btn")
  const currentUser = localStorage.getItem("arteAnima_currentUser")

  if (currentUser && authBtn) {
    try {
      const user = JSON.parse(currentUser)
      authBtn.textContent = "Dashboard"
      authBtn.href = "dashboard.html"
    } catch (e) {
      console.error("Errore nel parsing dell'utente corrente:", e)
    }
  }
})

// Utility function to extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return null
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  } catch (e) {
    console.error("Errore nell'estrazione dell'ID YouTube:", e)
    return null
  }
}
