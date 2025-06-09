// Database Manager corretto per UUID - Arte Anima
class DatabaseManager {
  constructor() {
    // Le tue credenziali Supabase
    const supabaseUrl = "https://mfaizhxefjjalamqtrvq.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mYWl6aHhlZmpqYWxhbXF0cnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Mjc3OTEsImV4cCI6MjA2NTAwMzc5MX0.VGkazW_svsgDtB4xk1akC61kjsSees7Ty6KJxyXhlt8"

    this.supabase = supabase.createClient(supabaseUrl, supabaseKey)
    console.log("✅ Database Manager inizializzato con UUID")
  }

  // Registrazione utente
  async registerUser(userData) {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .insert({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          description: userData.description || "",
          youtube_channel: userData.youtubeChannel || "",
          is_admin: false,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Errore registrazione:", error)
      throw new Error(error.message || "Errore durante la registrazione")
    }
  }

  // Login utente
  async loginUser(email, password) {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error || !data) throw new Error("Credenziali non valide")
      return data
    } catch (error) {
      console.error("Errore login:", error)
      throw new Error("Email o password non validi")
    }
  }

  // Aggiorna profilo utente
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .update({
          description: updates.description,
          youtube_channel: updates.youtubeChannel,
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Errore aggiornamento profilo:", error)
      throw new Error("Errore durante l'aggiornamento del profilo")
    }
  }

  // Aggiungi video
  async addVideo(userId, videoData) {
    try {
      const videoId = this.extractYouTubeId(videoData.url)
      if (!videoId) throw new Error("URL YouTube non valido")

      const embedUrl = `https://www.youtube.com/embed/${videoId}`

      const { data, error } = await this.supabase
        .from("videos")
        .insert({
          user_id: userId,
          title: videoData.title,
          url: embedUrl,
          description: videoData.description || "",
        })
        .select(`
          *,
          user:users(name, is_admin)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Errore aggiunta video:", error)
      throw new Error(error.message || "Errore durante l'aggiunta del video")
    }
  }

  // Ottieni video utente
  async getUserVideos(userId) {
    try {
      const { data, error } = await this.supabase
        .from("videos")
        .select(`
          *,
          user:users(name, is_admin)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Errore caricamento video utente:", error)
      throw new Error("Errore durante il caricamento dei video")
    }
  }

  // Ottieni tutti i video
  async getAllVideos() {
    try {
      const { data, error } = await this.supabase
        .from("videos")
        .select(`
          *,
          user:users(name, is_admin)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Errore caricamento tutti i video:", error)
      throw new Error("Errore durante il caricamento dei video")
    }
  }

  // Elimina video
  async deleteVideo(videoId, userId) {
    try {
      // Verifica se l'utente può eliminare il video
      const { data: video, error: videoError } = await this.supabase
        .from("videos")
        .select("user_id")
        .eq("id", videoId)
        .single()

      if (videoError) throw videoError

      // Verifica se l'utente è admin
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .select("is_admin")
        .eq("id", userId)
        .single()

      if (userError) throw userError

      // Può eliminare se è il proprietario o è admin
      if (video.user_id !== userId && !user.is_admin) {
        throw new Error("Non hai i permessi per eliminare questo video")
      }

      const { error } = await this.supabase.from("videos").delete().eq("id", videoId)

      if (error) throw error
    } catch (error) {
      console.error("Errore eliminazione video:", error)
      throw new Error(error.message || "Errore durante l'eliminazione del video")
    }
  }

  // Ottieni tutti gli utenti (per explore)
  async getAllUsers() {
    try {
      const { data: users, error: usersError } = await this.supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError

      // Conta i video per ogni utente
      const { data: videos, error: videosError } = await this.supabase.from("videos").select("user_id")

      if (videosError) throw videosError

      const videoCounts = {}
      videos.forEach((video) => {
        videoCounts[video.user_id] = (videoCounts[video.user_id] || 0) + 1
      })

      return users.map((user) => ({
        ...user,
        totalVideos: videoCounts[user.id] || 0,
      }))
    } catch (error) {
      console.error("Errore caricamento utenti:", error)
      throw new Error("Errore durante il caricamento degli utenti")
    }
  }

  // Utility: estrai ID YouTube
  extractYouTubeId(url) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
}

// Istanza globale
window.db = new DatabaseManager()
