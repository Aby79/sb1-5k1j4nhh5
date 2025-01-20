export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      excel_imports: {
        Row: {
          id: string
          user_id: string
          annee_num_dossier: number
          num_dossier: number
          code_num_dossier: string
          date_enregistrement: string
          date_encaissement: string
          reference_paiement: string
          ref_nature_affaire_juridique: string
          ref_tribunal: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          annee_num_dossier: number
          num_dossier: number
          code_num_dossier: string
          date_enregistrement: string
          date_encaissement: string
          reference_paiement: string
          ref_nature_affaire_juridique: string
          ref_tribunal: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          annee_num_dossier?: number
          num_dossier?: number
          code_num_dossier?: string
          date_enregistrement?: string
          date_encaissement?: string
          reference_paiement?: string
          ref_nature_affaire_juridique?: string
          ref_tribunal?: string
          created_at?: string
        }
      }
    }
  }
}