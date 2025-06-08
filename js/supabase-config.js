// Configurazione Supabase per Arte Anima
class SupabaseConfig {
  constructor() {
    // 🔧 CONFIGURA QUI LE TUE CREDENZIALI SUPABASE
    this.supabaseUrl = "YOUR_SUPABASE_URL"
    this.supabaseKey = "YOUR_SUPABASE_ANON_KEY"

    // Verifica se Supabase è configurato
    if (this.supabaseUrl === "YOUR_SUPABASE_URL" || this.supabaseKey === "YOUR_SUPABASE_ANON_KEY") {
      console.warn("⚠️ Supabase non configurato. Usando localStorage come fallback.")
      this.useLocalStorage = true
    } else {
      this.useLocalStorage = false
      this.loadSupabase()
    }
  }

  async loadSupabase() {
    try {
      // Carica Supabase da CDN se non già presente
      if (!window.supabase) {
        await this.loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2")
      }

      this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey)
      console.log("✅ Supabase inizializzato correttamente")
    } catch (error) {
      console.error("❌ Errore inizializzazione Supabase:", error)
      this.useLocalStorage = true
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
    return this.useLocalStorage
  }
}

// Istanza globale
window.supabaseConfig = new SupabaseConfig()
