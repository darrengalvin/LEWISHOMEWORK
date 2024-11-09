-- Function to create learning content table
CREATE OR REPLACE FUNCTION create_learning_content_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS public.learning_content (
        id BIGSERIAL PRIMARY KEY,
        topic TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
END;
$$;

-- Function to create quiz questions table
CREATE OR REPLACE FUNCTION create_quiz_questions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
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
END;
$$;

-- Function to create user progress table
CREATE OR REPLACE FUNCTION create_user_progress_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
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