// Database manager unificato per Supabase e localStorage
class DatabaseManager {
  constructor() {
    this.config = window.supabaseConfig
    this.storageKey = "arteAnima_data"
  }

  // Inizializza il database
  async initialize() {
    if (this.config.isUsingLocalStorage()) {
      this.initializeLocalStorage()
    } else {
      await this.initializeSupabase()
    }
  }

  initializeLocalStorage() {
    const data = this.getLocalData()
    if (!data.users || data.users.length === 0) {
      const adminUser = {
        id: "admin_1",
        name: "Mirko Sabini",
        email: "mirkosabini@gmail.com",
        password: "admin123",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      }

      const initialData = {
        users: [adminUser],
        videos: [],
      }

      localStorage.setItem(this.storageKey, JSON.stringify(initialData))
      console.log("✅ LocalStorage inizializzato con admin")
    }
  }

  async initializeSupabase() {
    try {
      const supabase = this.config.getClient()
      if (!supabase) return

      // Verifica se l'admin esiste già
      const { data: existingAdmin } = await supabase
        .from("users")
        .select("*")
        .eq("email", "mirkosabini@gmail.com")
        .single()

      if (!existingAdmin) {
        // Crea l'admin
        const { error } = await supabase.from("users").insert([
          {
            name: "Mirko Sabini",
            email: "mirkosabini@gmail.com",
            password: "admin123",
            is_admin: true,
          },
        ])

        if (!error) {
          console.log("✅ Supabase inizializzato con admin")
        }
      }
    } catch (error) {
      console.error("Errore inizializzazione Supabase:", error)
    }
  }

  getLocalData() {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : { users: [], videos: [] }
  }

  saveLocalData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // GESTIONE UTENTI
  async registerUser(userData) {
    if (this.config.isUsingLocalStorage()) {
      return this.registerUserLocal(userData)
    } else {
      return this.registerUserSupabase(userData)
    }
  }

  registerUserLocal(userData) {
    const data = this.getLocalData()

    if (data.users.find((u) => u.email === userData.email)) {
      throw new Error("Email già registrata")
    }

    const newUser = {
      id: "user_" + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    }

    data.users.push(newUser)
    this.saveLocalData(data)
    return newUser
  }

  async registerUserSupabase(userData) {
    const supabase = this.config.getClient()

    const { data: existingUser } = await supabase.from("users").select("*").eq("email", userData.email).single()

    if (existingUser) {
      throw new Error("Email già registrata")
    }

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          is_admin: false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.is_admin,
      createdAt: newUser.created_at,
    }
  }

  async loginUser(email, password) {
    if (this.config.isUsingLocalStorage()) {
      return this.loginUserLocal(email, password)
    } else {
      return this.loginUserSupabase(email, password)
    }
  }

  loginUserLocal(email, password) {
    const data = this.getLocalData()
    const user = data.users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Email o password non validi")
    }

    return user
  }

  async loginUserSupabase(email, password) {
    const supabase = this.config.getClient()

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single()

    if (error || !user) {
      throw new Error("Email o password non validi")
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
    }
  }

  // GESTIONE VIDEO
  async addVideo(userId, videoData) {
    if (this.config.isUsingLocalStorage()) {
      return this.addVideoLocal(userId, videoData)
    } else {
      return this.addVideoSupabase(userId, videoData)
    }
  }

  addVideoLocal(userId, videoData) {
    const data = this.getLocalData()

    const videoId = this.extractYouTubeId(videoData.url)
    if (!videoId) {
      throw new Error("URL YouTube non valido")
    }

    const newVideo = {
      id: "video_" + Date.now(),
      userId: userId,
      title: videoData.title,
      url: videoData.url,
      description: videoData.description || "",
      createdAt: new Date().toISOString(),
    }

    data.videos.push(newVideo)
    this.saveLocalData(data)
    return newVideo
  }

  async addVideoSupabase(userId, videoData) {
    const supabase = this.config.getClient()

    const videoId = this.extractYouTubeId(videoData.url)
    if (!videoId) {
      throw new Error("URL YouTube non valido")
    }

    const { data: newVideo, error } = await supabase
      .from("videos")
      .insert([
        {
          user_id: userId,
          title: videoData.title,
          url: videoData.url,
          description: videoData.description || "",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      id: newVideo.id,
      userId: newVideo.user_id,
      title: newVideo.title,
      url: newVideo.url,
      description: newVideo.description,
      createdAt: newVideo.created_at,
    }
  }

  async getUserVideos(userId) {
    if (this.config.isUsingLocalStorage()) {
      return this.getUserVideosLocal(userId)
    } else {
      return this.getUserVideosSupabase(userId)
    }
  }

  getUserVideosLocal(userId) {
    const data = this.getLocalData()
    return data.videos.filter((v) => v.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getUserVideosSupabase(userId) {
    const supabase = this.config.getClient()

    const { data: videos, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return videos.map((video) => ({
      id: video.id,
      userId: video.user_id,
      title: video.title,
      url: video.url,
      description: video.description,
      createdAt: video.created_at,
    }))
  }

  async getAllVideos() {
    if (this.config.isUsingLocalStorage()) {
      return this.getAllVideosLocal()
    } else {
      return this.getAllVideosSupabase()
    }
  }

  getAllVideosLocal() {
    const data = this.getLocalData()
    return data.videos
      .map((video) => {
        const user = data.users.find((u) => u.id === video.userId)
        return {
          ...video,
          userName: user ? user.name : "Utente sconosciuto",
          userIsAdmin: user ? user.isAdmin : false,
        }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getAllVideosSupabase() {
    const supabase = this.config.getClient()

    const { data: videos, error } = await supabase
      .from("videos")
      .select(`
        *,
        users (
          name,
          is_admin
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return videos.map((video) => ({
      id: video.id,
      userId: video.user_id,
      title: video.title,
      url: video.url,
      description: video.description,
      createdAt: video.created_at,
      userName: video.users?.name || "Utente sconosciuto",
      userIsAdmin: video.users?.is_admin || false,
    }))
  }

  async deleteVideo(videoId, userId) {
    if (this.config.isUsingLocalStorage()) {
      return this.deleteVideoLocal(videoId, userId)
    } else {
      return this.deleteVideoSupabase(videoId, userId)
    }
  }

  deleteVideoLocal(videoId, userId) {
    const data = this.getLocalData()
    const user = data.users.find((u) => u.id === userId)

    if (!user) throw new Error("Utente non trovato")

    if (!user.isAdmin) {
      const video = data.videos.find((v) => v.id === videoId)
      if (!video || video.userId !== userId) {
        throw new Error("Non autorizzato")
      }
    }

    data.videos = data.videos.filter((v) => v.id !== videoId)
    this.saveLocalData(data)
  }

  async deleteVideoSupabase(videoId, userId) {
    const supabase = this.config.getClient()

    const { data: user } = await supabase.from("users").select("is_admin").eq("id", userId).single()

    if (!user) throw new Error("Utente non trovato")

    let query = supabase.from("videos").delete().eq("id", videoId)

    if (!user.is_admin) {
      query = query.eq("user_id", userId)
    }

    const { error } = await query

    if (error) throw new Error("Non autorizzato o video non trovato")
  }

  async getAllUsers() {
    if (this.config.isUsingLocalStorage()) {
      const data = this.getLocalData()
      return data.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        totalVideos: data.videos.filter((v) => v.userId === user.id).length,
      }))
    } else {
      const supabase = this.config.getClient()

      const { data: users, error } = await supabase.from("users").select(`
        *,
        videos (count)
      `)

      if (error) throw error

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
        totalVideos: user.videos?.[0]?.count || 0,
      }))
    }
  }

  // Utility
  extractYouTubeId(url) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  async getStats() {
    if (this.config.isUsingLocalStorage()) {
      const data = this.getLocalData()
      return {
        totalUsers: data.users.length,
        totalVideos: data.videos.length,
        totalAdmins: data.users.filter((u) => u.isAdmin).length,
      }
    } else {
      const supabase = this.config.getClient()

      const [usersResult, videosResult, adminsResult] = await Promise.all([
        supabase.from("users").select("id", { count: "exact" }),
        supabase.from("videos").select("id", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact" }).eq("is_admin", true),
      ])

      return {
        totalUsers: usersResult.count || 0,
        totalVideos: videosResult.count || 0,
        totalAdmins: adminsResult.count || 0,
      }
    }
  }
}

// Istanza globale
window.db = new DatabaseManager()
