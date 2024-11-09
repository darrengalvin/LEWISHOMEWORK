export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_points: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_points?: number;
          updated_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          mode: 'practice' | 'points';
          questions: {
            question_id: string;
            selected_answer: number;
            correct: boolean;
            points_earned?: number;
          }[];
          total_points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: 'practice' | 'points';
          questions: {
            question_id: string;
            selected_answer: number;
            correct: boolean;
            points_earned?: number;
          }[];
          total_points: number;
          created_at?: string;
        };
      };
    };
  };
}