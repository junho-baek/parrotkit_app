// Minimal generated-shape placeholder for Supabase table contracts used in this project.
// Keep this file in sync when schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          interests: string[];
          onboarding_completed: boolean;
          subscription_id: string | null;
          subscription_status: string;
          plan_type: string;
          subscription_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      references: {
        Row: {
          id: string;
          user_id: string;
          source_url: string;
          platform: string | null;
          video_id: string | null;
          niche: string | null;
          goal: string | null;
          description: string | null;
          transcript: Json;
          transcript_source: string;
          transcript_language: string | null;
          source_metadata: Json;
          created_at: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          reference_id: string | null;
          video_url: string;
          scenes: Json;
          total_scenes: number;
          captured_scene_ids: number[];
          match_results: Json;
          analysis_metadata: Json;
          script_source: string;
          captured_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      recipe_captures: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          scene_id: number;
          storage_path: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
      };
      event_logs: {
        Row: {
          id: number;
          user_id: string | null;
          event_name: string;
          page: string | null;
          payload: Json;
          created_at: string;
        };
      };
    };
  };
}
