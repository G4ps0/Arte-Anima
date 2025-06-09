// API principale per Arte & Anima
class ArteAnimaAPI {
  constructor() {
    this.db = window.db
    console.log("🚀 API Arte Anima inizializzata")
  }

  // Registrazione utente
  async registerUser(userData) {
    return await this.db.registerUser(userData)
  }

  // Login utente
  async loginUser(email, password) {
    return await this.db.loginUser(email, password)
  }

  // Aggiorna profilo
  async updateProfile(userId, updates) {
    return await this.db.updateProfile(userId, updates)
  }

  // Aggiungi video
  async addVideo(userId, videoData) {
    return await this.db.addVideo(userId, videoData)
  }

  // Ottieni video utente
  async getUserVideos(userId) {
    return await this.db.getUserVideos(userId)
  }

  // Ottieni tutti i video
  async getAllVideos() {
    return await this.db.getAllVideos()
  }

  // Elimina video
  async deleteVideo(videoId, userId) {
    return await this.db.deleteVideo(videoId, userId)
  }

  // Ottieni tutti gli utenti (per explore)
  async getPublicArtists() {
    return await this.db.getAllUsers()
  }

  // Estrai ID YouTube
  extractYouTubeId(url) {
    return this.db.extractYouTubeId(url)
  }
}

// Istanza globale
window.api = new ArteAnimaAPI()
