# Arte&Anima - Galleria Video

Un sito web elegante per la gestione e visualizzazione di video YouTube, con interfaccia admin e utente.

## Caratteristiche

### Per Utenti
- Visualizzazione galleria video in formato griglia responsive
- Riproduzione video in modal overlay
- Ricerca per titolo e filtri (alfabetico, data)
- Richiesta inserimento nuovi video

### Per Amministratori
- Gestione richieste (approvazione/rifiuto)
- Inserimento diretto di nuovi video
- Rimozione video esistenti
- Pannello di controllo con notifiche

## Credenziali Admin
- Username: mirko
- Password: arteanima1999

## Tecnologie Utilizzate
- HTML5
- CSS3 (con variabili e media queries per responsive design)
- JavaScript (ES6+)
- LocalStorage per persistenza dati
- YouTube Embed API

## Palette Colori
- Verde Petrolio Principale: #004d40
- Verde Petrolio Medio: #00796b
- Verde Petrolio Chiaro: #009688
- Rosso Errore/Logout: #d32f2f
- Bianco/Grigio: #f9f9f9, #ffffff
- Grigio Scuro: #333333

## Struttura File
```
/
├── index.html          # Pagina principale
├── css/
│   └── styles.css      # Stili CSS
├── js/
│   └── app.js          # Logica applicazione
└── README.md           # Questo file
```

## Guida al Deployment su GitHub Pages

### 1. Creare un Repository GitHub
1. Accedi al tuo account GitHub
2. Crea un nuovo repository (consigliato: "arte-anima" o "arteanima-gallery")
3. Non inizializzare il repository con README, .gitignore o licenza

### 2. Inizializzare Git e Caricare i File
```bash
# Nella directory del progetto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/NOME-REPOSITORY.git
git push -u origin main
```

### 3. Attivare GitHub Pages
1. Vai alla pagina del repository su GitHub
2. Clicca su "Settings" (in alto a destra)
3. Scorri fino alla sezione "GitHub Pages"
4. In "Source", seleziona il branch "main"
5. Clicca su "Save"
6. Attendi che il sito sia pubblicato (1-2 minuti)
7. Usa l'URL fornito per accedere al sito

### 4. Verificare il Deployment
- Controlla che tutte le funzionalità funzionino correttamente
- Testa il sito su diversi dispositivi e browser
- Verifica che l'accesso admin funzioni

## Note Importanti
- I dati sono salvati in localStorage, quindi sono specifici per ogni browser/dispositivo
- Il design è ottimizzato per schermi da 320px a 1920px di larghezza
- Compatibilità garantita con Chrome, Firefox, Safari e Edge recenti
