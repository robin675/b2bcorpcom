// Hand-maintained mirror of the v0 schema in supabase/migrations/.
// Shape mirrors what `supabase gen types typescript` emits (Tables include a
// Relationships field for supabase-js's row-type inference to work).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      config: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value: Json; updated_at?: string };
        Update: { key?: string; value?: Json; updated_at?: string };
        Relationships: [];
      };
      discovery_run: {
        Row: {
          id: string;
          started_at: string;
          finished_at: string | null;
          status: string;
          query: string;
          candidates_found: number;
          error: string | null;
        };
        Insert: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          status?: string;
          query: string;
          candidates_found?: number;
          error?: string | null;
        };
        Update: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          status?: string;
          query?: string;
          candidates_found?: number;
          error?: string | null;
        };
        Relationships: [];
      };
      candidate: {
        Row: {
          id: string;
          discovery_run: string | null;
          url: string;
          domain: string;
          display_name: string | null;
          search_query: string | null;
          discovered_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          discovery_run?: string | null;
          url: string;
          domain: string;
          display_name?: string | null;
          search_query?: string | null;
          discovered_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          discovery_run?: string | null;
          url?: string;
          domain?: string;
          display_name?: string | null;
          search_query?: string | null;
          discovered_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      candidate_score: {
        Row: {
          id: string;
          candidate_id: string;
          score: number;
          reasons: Json;
          model_version: string | null;
          evaluated_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          score: number;
          reasons?: Json;
          model_version?: string | null;
          evaluated_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          score?: number;
          reasons?: Json;
          model_version?: string | null;
          evaluated_at?: string;
        };
        Relationships: [];
      };
      seed: {
        Row: {
          id: string;
          candidate_id: string;
          registered_at: string;
          active: boolean;
          threshold_used: number | null;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          registered_at?: string;
          active?: boolean;
          threshold_used?: number | null;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          registered_at?: string;
          active?: boolean;
          threshold_used?: number | null;
        };
        Relationships: [];
      };
      crawl_run: {
        Row: {
          id: string;
          seed_id: string;
          started_at: string;
          finished_at: string | null;
          status: string;
          docs_found: number;
          error: string | null;
        };
        Insert: {
          id?: string;
          seed_id: string;
          started_at?: string;
          finished_at?: string | null;
          status?: string;
          docs_found?: number;
          error?: string | null;
        };
        Update: {
          id?: string;
          seed_id?: string;
          started_at?: string;
          finished_at?: string | null;
          status?: string;
          docs_found?: number;
          error?: string | null;
        };
        Relationships: [];
      };
      document: {
        Row: {
          id: string;
          seed_id: string;
          crawl_run: string | null;
          source_url: string;
          doc_type: string;
          content_hash: string;
          raw_storage_path: string | null;
          normalized_text: string | null;
          title: string | null;
          published_at: string | null;
          fetched_at: string;
        };
        Insert: {
          id?: string;
          seed_id: string;
          crawl_run?: string | null;
          source_url: string;
          doc_type: string;
          content_hash: string;
          raw_storage_path?: string | null;
          normalized_text?: string | null;
          title?: string | null;
          published_at?: string | null;
          fetched_at?: string;
        };
        Update: {
          id?: string;
          seed_id?: string;
          crawl_run?: string | null;
          source_url?: string;
          doc_type?: string;
          content_hash?: string;
          raw_storage_path?: string | null;
          normalized_text?: string | null;
          title?: string | null;
          published_at?: string | null;
          fetched_at?: string;
        };
        Relationships: [];
      };
      document_chunk: {
        Row: {
          id: string;
          document_id: string;
          chunk_index: number;
          text: string;
          embedding: number[] | null;
        };
        Insert: {
          id?: string;
          document_id: string;
          chunk_index: number;
          text: string;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          document_id?: string;
          chunk_index?: number;
          text?: string;
          embedding?: number[] | null;
        };
        Relationships: [];
      };
      operator_feedback: {
        Row: {
          id: string;
          kind: string;
          payload: Json;
          candidate_id: string | null;
          seed_id: string | null;
          created_at: string;
          applied: boolean;
        };
        Insert: {
          id?: string;
          kind: string;
          payload: Json;
          candidate_id?: string | null;
          seed_id?: string | null;
          created_at?: string;
          applied?: boolean;
        };
        Update: {
          id?: string;
          kind?: string;
          payload?: Json;
          candidate_id?: string | null;
          seed_id?: string | null;
          created_at?: string;
          applied?: boolean;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
