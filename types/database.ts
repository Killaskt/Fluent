// Auto-generated Supabase types live here once you run:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
//
// Until then this stub keeps TypeScript happy.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          is_admin: boolean;
          waitlist: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          is_admin?: boolean;
          waitlist?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string;
          is_admin?: boolean;
          waitlist?: boolean;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          completed_lessons: string[];
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          earned_badges: string[];
          updated_at: string;
        };
        Insert: {
          user_id: string;
          completed_lessons?: string[];
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          earned_badges?: string[];
        };
        Update: {
          completed_lessons?: string[];
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          earned_badges?: string[];
          updated_at?: string;
        };
      };
    };
  };
};
