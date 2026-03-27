CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (title, content)
SELECT seed.title, seed.content
FROM (
  VALUES
    (
      'Configurer Docker Compose',
      'Verifier que les services api et db demarrent ensemble avec les bonnes variables d environnement.'
    ),
    (
      'Initialiser PostgreSQL',
      'Le script SQL est monte dans /docker-entrypoint-initdb.d pour creer la table notes au premier lancement.'
    ),
    (
      'Tester l API',
      'Appeler GET /notes puis POST /notes pour confirmer que les donnees seed et les nouvelles notes sont bien persistantes.'
    )
) AS seed(title, content)
WHERE NOT EXISTS (
  SELECT 1
  FROM notes
);
