class DatabaseManager {
    constructor() {
        this.supabaseUrl = 'IL_TUO_SUPABASE_URL';
        this.supabaseKey = 'IL_TUO_SUPABASE_ANON_KEY';
        this.supabase = null;
        this.initialize();
    }

    async initialize() {
        // Inizializza Supabase
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        // Controlla lo stato di autenticazione
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            // L'utente è autenticato
            this.user = session.user;
        }
    }

    // Ottieni l'utente corrente
    async getCurrentUser() {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return null;
        
        // Ottieni i dati aggiuntivi dell'utente dal database
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (error) {
            console.error('Errore nel recupero dei dati utente:', error);
            return null;
        }
        
        return { ...user, ...data };
    }

    // Aggiorna il profilo utente
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    description: updates.description,
                    social_links: updates.social_links,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();
                
            if (error) throw error;
            return !!data;
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del profilo:', error);
            throw error;
        }
    }
}

// Crea un'istanza globale
window.db = new DatabaseManager();
