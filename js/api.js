// API principale per Arte Anima
class ArteAnimaAPI {
  constructor() {
    this.db = window.db
    this.init()
  }

  async init() {
    await this.db.initialize()
  }

  // Registrazione utente
  async registerUser(userData) {
    return await this.db.registerUser(userData)
  }

  // Login utente
  async loginUser(email, password) {
    return await this.db.loginUser(email, password)
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

  // Estrai ID YouTube
  extractYouTubeId(url) {
    return this.db.extractYouTubeId(url)
  }

  // Ottieni statistiche
  async getStats() {
    return await this.db.getStats()
  }

  // Ottieni tutti gli utenti (per explore)
  async getPublicArtists() {
    const users = await this.db.getAllUsers()
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      totalVideos: user.totalVideos,
      totalSections: 0, // Per compatibilità
      sections: [], // Per compatibilità
      createdAt: user.createdAt,
    }))
  }

  // Per compatibilità con il codice esistente
  async getUserById(userId) {
    const users = await this.db.getAllUsers()
    return users.find((u) => u.id === userId)
  }
}

// Istanza globale
window.api = new ArteAnimaAPI()
