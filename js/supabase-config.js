// Configurazione Supabase per Arte Anima - SOLO SUPABASE
class SupabaseConfig {
  constructor() {
    console.log("🚀 Inizializzazione Arte Anima con Supabase...")

    // 🔧 Configurazione Supabase
    this.supabaseUrl = "https://qthnrtpoxdjbyppaybuj.supabase.co"
    this.supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aG5ydHBveGRqYnlwcGF5YnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTM3MDYsImV4cCI6MjA2NDk4OTcwNn0.gWXJlr3b-vq_Hss2KdavkxAA-bxCzIDLT3idumlKJx0"

    console.log("✅ URL Supabase:", this.supabaseUrl)
    console.log("🔑 Connessione a Supabase...")

    // SOLO SUPABASE - nessun fallback localStorage
    this.useLocalStorage = false
    this.initialized = false
    this.initializationPromise = this.initialize()
  }

  async initialize() {
    try {
      await this.loadSupabase()
      this.initialized = true
      return this.supabase
    } catch (error) {
      console.error("❌ Errore inizializzazione Supabase:", error)
      throw error
    }
  }

  // Metodo per attendere l'inizializzazione
  async waitForInitialization() {
    if (this.initialized) return this.supabase
    return this.initializationPromise
  }

  async loadSupabase() {
    try {
      // Carica Supabase da CDN se non già presente
      if (!window.supabase) {
        console.log("📦 Caricamento libreria Supabase...")
        await this.loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2")
      }

      this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey)
      console.log("✅ Supabase inizializzato correttamente")

      // Test connessione
      const { data, error } = await this.supabase.from("users").select("count").limit(1)
      if (error) {
        console.error("❌ Errore test connessione:", error)
        throw error
      }
      console.log("🔗 Connessione al database verificata")
    } catch (error) {
      console.error("❌ ERRORE CRITICO - Supabase non disponibile:", error)
      alert("❌ Errore di connessione al database. Verifica la configurazione Supabase.")
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  getClient() {
    return this.supabase
  }

  isUsingLocalStorage() {
    return false // SEMPRE false - solo Supabase
  }
}

// Istanza globale
window.supabaseConfig = new SupabaseConfig()
