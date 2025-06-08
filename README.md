# 🎨 Arte Anima - Piattaforma Video

Una piattaforma semplice e moderna per condividere video YouTube, con supporto per database reale tramite Supabase.

## ✨ Caratteristiche

- 🎥 **Condivisione video YouTube** - Aggiungi facilmente i tuoi video
- 👥 **Sistema utenti** - Registrazione e login sicuri
- 🔍 **Ricerca e filtri** - Trova video per titolo, utente o data
- 📱 **Design responsive** - Funziona su tutti i dispositivi
- 🗄️ **Database reale** - Supporto Supabase con fallback localStorage
- 🚀 **Deploy facile** - Compatibile con GitHub Pages

## 🚀 Setup Rapido

### 1. Clone o Download
\`\`\`bash
git clone [il-tuo-repo]
cd arte-anima
\`\`\`

### 2. Configurazione Base (Funziona Subito)
Il sito funziona immediatamente con localStorage. Apri `index.html` nel browser!

**Account di test:**
- Email: `mirkosabini@gmail.com`
- Password: `admin123`

### 3. Setup Database Supabase (Opzionale)

#### A. Crea account Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Crea un nuovo progetto (gratuito)
3. Aspetta che sia pronto (2-3 minuti)

#### B. Configura database
1. Vai su **SQL Editor** in Supabase
2. Copia e incolla il contenuto di `database-schema.sql`
3. Esegui il codice

#### C. Configura credenziali
1. In Supabase vai su **Settings → API**
2. Copia **Project URL** e **anon public key**
3. Apri `js/supabase-config.js`
4. Sostituisci:
\`\`\`javascript
this.supabaseUrl = "https://tuoprogetto.supabase.co"
this.supabaseKey = "la-tua-anon-key-qui"
\`\`\`

### 4. Deploy su GitHub Pages
1. Fai push del codice su GitHub
2. Vai su **Settings → Pages**
3. Seleziona **Deploy from a branch → main**
4. Il sito sarà online in pochi minuti!

## 📁 Struttura File

\`\`\`
arte-anima/
├── index.html              # Homepage
├── login.html              # Autenticazione
├── dashboard.html           # Dashboard utente
├── videos.html             # Tutti i video
├── explore.html            # Esplora artisti
├── css/
│   ├── style.css           # Stili principali
│   ├── dashboard.css       # Stili dashboard
│   ├── videos.css          # Stili video
│   └── explore.css         # Stili esplorazione
├── js/
│   ├── supabase-config.js  # Configurazione database
│   ├── database.js         # Manager database
│   ├── api.js              # API principale
│   ├── auth.js             # Autenticazione
│   ├── dashboard.js        # Dashboard
│   ├── videos.js           # Gestione video
│   ├── explore.js          # Esplorazione
│   └── main.js             # Funzioni comuni
├── database-schema.sql     # Schema database
└── README.md              # Questo file
\`\`\`

## 🔧 Funzionalità

### Per Utenti
- ✅ Registrazione e login
- ✅ Caricamento video YouTube
- ✅ Gestione dei propri video
- ✅ Visualizzazione video community
- ✅ Ricerca e filtri

### Per Admin
- ✅ Tutti i privilegi utente
- ✅ Eliminazione di qualsiasi video
- ✅ Badge amministratore
- ✅ Statistiche piattaforma

## 🛠️ Tecnologie

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Database**: Supabase (PostgreSQL) con fallback localStorage
- **Icone**: Font Awesome 6
- **Deploy**: GitHub Pages, Netlify, Vercel

## 🔄 Sistema Ibrido

L'applicazione funziona con **doppio sistema**:

1. **Supabase** (se configurato): Database reale condiviso
2. **localStorage** (fallback): Dati locali nel browser

Il sistema rileva automaticamente quale usare!

## 🎯 Vantaggi

- ✅ **Funziona subito** - Nessuna configurazione richiesta
- ✅ **Scalabile** - Aggiungi database quando vuoi
- ✅ **Semplice** - Codice pulito e commentato
- ✅ **Responsive** - Perfetto su mobile e desktop
- ✅ **Veloce** - Caricamento istantaneo
- ✅ **Gratuito** - Deploy e database gratuiti

## 🐛 Risoluzione Problemi

### Video non si caricano
- Verifica che l'URL YouTube sia valido
- Controlla la connessione internet

### Supabase non funziona
- Verifica le credenziali in `supabase-config.js`
- Controlla che il database sia configurato
- Il sistema userà localStorage come fallback

### Errori di login
- Verifica email e password
- Usa l'account di test: `mirkosabini@gmail.com` / `admin123`

## 📞 Supporto

Per problemi o domande:
1. Controlla questo README
2. Verifica la console del browser (F12)
3. Testa con l'account admin di default

## 🎉 Pronto all'uso!

Il sito è **già funzionante** con localStorage. Supabase è solo un upgrade opzionale per avere dati condivisi!

**Buon divertimento con Arte Anima! 🎨**
