// API principale per Arte Anima - SOLO SUPABASE
class ArteAnimaAPI {
  constructor() {
    this.db = window.db
    this.initialized = false
    this.init()
  }

  async init() {
    try {
      console.log("🚀 Inizializzazione API...")
      await this.db.initialize()
      this.initialized = true
      console.log("✅ API inizializzata correttamente")
    } catch (error) {
      console.error("❌ Errore inizializzazione API:", error)
      throw error
    }
  }

  async waitForInit() {
    while (!this.initialized) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  // Registrazione utente
  async registerUser(userData) {
    await this.waitForInit()
    console.log("📝 Registrazione utente:", userData.email)

    try {
      const result = await this.db.registerUser(userData)
      console.log("✅ Utente registrato:", result)
      return result
    } catch (error) {
      console.error("❌ Errore registrazione:", error)
      throw error
    }
  }

  // Login utente
  async loginUser(email, password) {
    await this.waitForInit()
    console.log("🔑 Login utente:", email)

    try {
      const result = await this.db.loginUser(email, password)
      console.log("✅ Login riuscito:", result)
      return result
    } catch (error) {
      console.error("❌ Errore login:", error)
      throw error
    }
  }

  // Aggiungi video
  async addVideo(userId, videoData) {
    await this.waitForInit()
    return await this.db.addVideo(userId, videoData)
  }

  // Ottieni video utente
  async getUserVideos(userId) {
    await this.waitForInit()
    return await this.db.getUserVideos(userId)
  }

  // Ottieni tutti i video
  async getAllVideos() {
    await this.waitForInit()
    return await this.db.getAllVideos()
  }

  // Elimina video
  async deleteVideo(videoId, userId) {
    await this.waitForInit()
    return await this.db.deleteVideo(videoId, userId)
  }

  // Estrai ID YouTube
  extractYouTubeId(url) {
    return this.db.extractYouTubeId(url)
  }

  // Ottieni statistiche
  async getStats() {
    await this.waitForInit()
    return await this.db.getStats()
  }

  // Ottieni tutti gli utenti (per explore)
  async getPublicArtists() {
    await this.waitForInit()
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
    await this.waitForInit()
    const users = await this.db.getAllUsers()
    return users.find((u) => u.id === userId)
  }
}

// Istanza globale
console.log("🔧 Creazione istanza API globale...")
window.api = new ArteAnimaAPI()
