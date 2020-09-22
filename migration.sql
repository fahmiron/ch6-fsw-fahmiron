CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30),
  experience NUMERIC DEFAULT 0,
  lvl NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO players (name, email) VALUES
  ('yogi', 'yogi@binaracademy.com'),
  ('sasa', 'sasa@binaracademy.com');