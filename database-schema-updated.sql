-- Schema SQL aggiornato per Supabase - Arte Anima
-- PRIMA ELIMINA L'ADMIN VECCHIO E CREA QUELLO NUOVO

-- Elimina l'admin precedente se esiste
DELETE FROM users WHERE email = 'mirkosabini@gmail.com';

-- Crea le tabelle (se non esistono già)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Nuovo admin con email arteanima1999@gmail.com
INSERT INTO users (name, email, password, is_admin)
SELECT 'Arte Anima Admin', 'arteanima1999@gmail.com', 'admin123', true
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'arteanima1999@gmail.com'
);

-- Verifica che l'admin sia stato creato
SELECT 'Admin creato con successo!' as message, * FROM users WHERE email = 'arteanima1999@gmail.com';
