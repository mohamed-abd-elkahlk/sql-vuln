-- The database name is set by the environment variable POSTGRES_DB in docker-compose.yml
-- So we only need to create the table and seed data here.

-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Delete existing data to avoid duplicates during repeated setups
TRUNCATE TABLE users;

-- Insert an admin user
INSERT INTO users (username, password, role) VALUES ('admin', 'p@ssword123', 'admin');

-- Insert a regular user
INSERT INTO users (username, password, role) VALUES ('user', 'user123', 'user');
