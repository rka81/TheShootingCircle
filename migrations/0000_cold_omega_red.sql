
-- Drop existing table if it exists
DROP TABLE IF EXISTS challenge_attempts CASCADE;

-- Create the table with correct schema
CREATE TABLE challenge_attempts (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    session_id INTEGER NOT NULL REFERENCES sessions(id),
    accuracy INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
