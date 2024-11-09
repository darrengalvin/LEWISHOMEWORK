-- Create tables
CREATE TABLE IF NOT EXISTS public.learning_content (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic, question)
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    practice_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create function to initialize tables
CREATE OR REPLACE FUNCTION initialize_tables()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create tables if they don't exist
    CREATE TABLE IF NOT EXISTS public.learning_content (
        id BIGSERIAL PRIMARY KEY,
        topic TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.quiz_questions (
        id BIGSERIAL PRIMARY KEY,
        topic TEXT NOT NULL,
        question TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        explanation TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(topic, question)
    );

    CREATE TABLE IF NOT EXISTS public.user_progress (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        practice_mode BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id)
    );
END;
$$;