// Configurazione Supabase per Arte Anima
class SupabaseConfig {
  constructor() {
    console.log("🚀 Inizializzazione configurazione Supabase...");
    
    // 🔧 Configurazione Supabase
    this.supabaseUrl = "https://auxahcufzdldjokdbrru.supabase.co"
    this.supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eGFoY3VmemRsZGpva2RicnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTA0MjYsImV4cCI6MjA2NDk4NjQyNn0.JIdjIk_7aLYRDfAqftyNi0gkwP52Ei18HfkTijpAYPE"

    console.log("✅ URL Supabase:", this.supabaseUrl);
    console.log("🔑 Chiave Supabase presente:", this.supabaseKey ? 'Sì' : 'No');

    // Verifica se Supabase è configurato
    if (this.supabaseUrl === "YOUR_SUPABASE_URL" || this.supabaseKey === "YOUR_SUPABASE_ANON_KEY") {
      console.warn("⚠️ Supabase non configurato. Usando localStorage come fallback.")
      this.useLocalStorage = true
    } else {
      console.log("🔌 Tentativo di connessione a Supabase...");
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
