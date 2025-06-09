-- Schema SQL semplificato per Supabase - Arte Anima

-- Crea le tabelle
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_channel VARCHAR(500),
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

-- Admin predefinito
INSERT INTO users (name, email, password, is_admin, description, youtube_channel)
SELECT 'Admin Arte Anima', 'admin@arteanima.com', 'admin123', true, 'Amministratore della piattaforma Arte & Anima', ''
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@arteanima.com'
);

-- Verifica creazione admin
SELECT 'Admin creato con successo!' as message, * FROM users WHERE email = 'admin@arteanima.com';
