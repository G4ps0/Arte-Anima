-- Schema SQL per Supabase - Arte Anima
-- Esegui questo codice nel SQL Editor di Supabase

-- Tabella utenti
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella video
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Inserisci l'admin di default (se non esiste già)
INSERT INTO users (name, email, password, is_admin)
SELECT 'Mirko Sabini', 'mirkosabini@gmail.com', 'admin123', true
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'mirkosabini@gmail.com'
);

-- Commenti per spiegare la struttura
COMMENT ON TABLE users IS 'Tabella degli utenti registrati';
COMMENT ON TABLE videos IS 'Tabella dei video caricati dagli utenti';
COMMENT ON COLUMN users.is_admin IS 'Flag per identificare gli amministratori';
COMMENT ON COLUMN videos.user_id IS 'Riferimento all''utente che ha caricato il video';

-- Query di test per verificare che tutto funzioni
-- SELECT * FROM users;
-- SELECT * FROM videos;
