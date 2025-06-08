// API aggiornata che usa il DatabaseManager
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

  // Ottieni statistiche (per admin)
  async getStats() {
    return await this.db.getStats()
  }

  // Metodi per compatibilità con il codice esistente
  async getUserById(userId) {
    // Implementazione semplificata per compatibilità
    if (this.db.config.isUsingLocalStorage()) {
      const data = this.db.getLocalData()
      return data.users.find((u) => u.id === userId)
    } else {
      const supabase = this.db.config.getClient()
      const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
          createdAt: user.created_at,
        }
      }
      return null
    }
  }

  async getPublicArtists() {
    // Implementazione semplificata - restituisce tutti gli utenti con video
    const allVideos = await this.getAllVideos()
    const userStats = {}

    // Calcola statistiche per utente
    allVideos.forEach((video) => {
      if (!userStats[video.userId]) {
        userStats[video.userId] = {
          id: video.userId,
          name: video.userName,
          isAdmin: video.userIsAdmin,
          totalVideos: 0,
          totalSections: 0,
          sections: [],
        }
      }
      userStats[video.userId].totalVideos++
    })

    return Object.values(userStats)
  }
}

// Sostituisci l'API globale
window.api = new ArteAnimaAPI()
