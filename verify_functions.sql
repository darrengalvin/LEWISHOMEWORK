-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_schema = 'public' 
AND routine_name IN (
  'create_learning_content_table',
  'create_quiz_questions_table',
  'create_user_progress_table'
);