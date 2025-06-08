// Database manager - SOLO SUPABASE
class DatabaseManager {
  constructor() {
    this.config = window.supabaseConfig
  }

  // Inizializza il database
  async initialize() {
    console.log("🗄️ Inizializzazione database...")
    try {
      // Attendi che Supabase sia inizializzato
      this.supabase = await this.config.waitForInitialization()
      if (!this.supabase) {
        throw new Error("Impossibile inizializzare Supabase")
      }
      await this.initializeSupabase()
    } catch (error) {
      console.error("❌ Errore inizializzazione database:", error)
      throw error
    }
  }

  async initializeSupabase() {
    try {
      if (!this.supabase) {
        throw new Error("Supabase non inizializzato")
      }

      // Verifica se l'admin esiste già
      const { data: existingAdmin, error: fetchError } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", "arteanima1999@gmail.com")
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError
      }

      if (!existingAdmin) {
        console.log("👤 Creazione admin di default...")
        // Crea l'admin
        const { error: insertError } = await this.supabase
          .from("users")
          .insert([
            {
              name: "Arte & Anima Admin",
              email: "arteanima1999@gmail.com",
              password: "loremirko123",
              is_admin: true,
            },
          ])

        if (insertError) {
          console.error("❌ Errore creazione admin:", insertError)
          throw insertError
        }
        console.log("✅ Admin creato con successo")
      } else {
        console.log("✅ Admin già presente nel database")
      }
    } catch (error) {
      console.error("❌ Errore inizializzazione database:", error)
      throw error
    }
  }

  // Restituisce il client Supabase
  async getClient() {
    if (!this.supabase) {
      this.supabase = await this.config.waitForInitialization()
    }
    return this.supabase
  }

  // GESTIONE UTENTI
  async getPublicArtists() {
    try {
      const supabase = await this.getClient()
      if (!supabase) {
        throw new Error("Supabase non inizializzato")
      }

      const { data: users, error } = await supabase
        .from('users')
        .select(`
          *,
          videos:user_id(count)
        `)
        .order('name', { ascending: true })
      if (error) throw error

      // Formatta i dati per la risposta
      return users.map(user => ({
        id: user.id,
        name: user.name || 'Utente Senza Nome',
        email: user.email,
        isAdmin: user.is_admin || false,
        totalVideos: user.videos?.[0]?.count || 0,
        createdAt: user.created_at || new Date().toISOString(),
        description: user.description || "",
        social_links: user.social_links || {
          youtube: "",
          instagram: "",
          website: "",
          other: ""
        }
      }))
    } catch (error) {
      console.error("Errore nel recupero degli artisti:", error)
      throw error
    }
  }

  // GESTIONE UTENTI
  async registerUser(userData) {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", userData.email)
      .single()

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
          social_links: {
            youtube: "",
            instagram: "",
            website: "",
            other: ""
          },
          description: ""
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
      description: newUser.description || "",
      social_links: newUser.social_links || {
        youtube: "",
        instagram: "",
        website: "",
        other: ""
      }
    }
  }

  async loginUser(email, password) {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

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
      description: user.description || "",
      social_links: user.social_links || {
        youtube: "",
        instagram: "",
        website: "",
        other: ""
      }
    }
  }

  // GESTIONE VIDEO
  async addVideo(userId, videoData) {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

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
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

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
      createdAt: video.created_at
    }))
  }

  async getAllVideos() {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

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
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

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
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        *,
        videos (count)
      `)
      .order("name", { ascending: true })

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

  // Aggiorna i link social di un utente
  async updateSocialLinks(userId, socialLinks) {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

    const { data, error } = await supabase
      .from('users')
      .update({ social_links: socialLinks })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  }

  // Aggiorna la descrizione del profilo
  async updateProfileDescription(userId, description) {
    const supabase = await this.getClient()
    if (!supabase) {
      throw new Error("Supabase non inizializzato")
    }

    const { data, error } = await supabase
      .from('users')
      .update({ description })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  }

  // Utility
  extractYouTubeId(url) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  async getStats() {
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

// Istanza globale
window.db = new DatabaseManager()
