/*
  # Create excel_imports table

  1. New Tables
    - `excel_imports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `annee_num_dossier` (integer)
      - `num_dossier` (integer)
      - `code_num_dossier` (text)
      - `date_enregistrement` (date)
      - `date_encaissement` (date)
      - `reference_paiement` (text)
      - `ref_nature_affaire_juridique` (text)
      - `ref_tribunal` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `excel_imports` table
    - Add policies for authenticated users to manage their own data
*/

-- Create excel_imports table
CREATE TABLE IF NOT EXISTS excel_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  annee_num_dossier integer NOT NULL CHECK (annee_num_dossier > 0),
  num_dossier integer NOT NULL CHECK (num_dossier > 0),
  code_num_dossier text NOT NULL CHECK (code_num_dossier ~ '^\d{4}$'),
  date_enregistrement date NOT NULL,
  date_encaissement date NOT NULL,
  reference_paiement text NOT NULL,
  ref_nature_affaire_juridique text NOT NULL CHECK (
    ref_nature_affaire_juridique IN ('PENAL', 'COMMERC', 'CIVIL', 'ADM')
  ),
  ref_tribunal text NOT NULL CHECK (
    ref_tribunal IN (
      'TR_ADM_APPL_1', 'TR_ADM_APPL_2', 'TR_ADM_APPL_3',
      'TR_COM_PIN_1', 'TR_COM_PIN_2', 'TR_COM_PIN_3',
      'TR_APPL_11', 'TR_APPL_12', 'TR_APPL_13'
    )
  ),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dates_check CHECK (date_encaissement >= date_enregistrement)
);

-- Enable RLS
ALTER TABLE excel_imports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own imports"
  ON excel_imports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imports"
  ON excel_imports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own imports"
  ON excel_imports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own imports"
  ON excel_imports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX excel_imports_user_id_idx ON excel_imports(user_id);
CREATE INDEX excel_imports_created_at_idx ON excel_imports(created_at);