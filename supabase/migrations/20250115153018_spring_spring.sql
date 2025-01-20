/*
  # Ajout des tables pour la gestion des versements EDI

  1. Nouvelles Tables
    - `versements`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers profiles)
      - `identifiant_fiscal` (text)
      - `exercice_fiscal_du` (date)
      - `exercice_fiscal_au` (date)
      - `annee_versement` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `affaires_juridiques`
      - `id` (uuid, clé primaire)
      - `versement_id` (uuid, référence vers versements)
      - `annee_num_dossier` (integer)
      - `num_dossier` (integer)
      - `code_num_dossier` (text)
      - `date_enregistrement` (date)
      - `date_encaissement` (date)
      - `reference_paiement` (text)
      - `ref_nature_affaire_juridique` (text)
      - `ref_tribunal` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur les deux tables
    - Ajout des politiques pour la gestion des accès utilisateurs

  3. Types énumérés
    - `versement_status`: pour gérer les différents états d'un versement
    - `nature_affaire`: pour les types d'affaires juridiques
    - `tribunal`: pour les codes des tribunaux
*/

-- Types énumérés
CREATE TYPE versement_status AS ENUM (
  'draft',
  'pending',
  'completed',
  'error'
);

CREATE TYPE nature_affaire AS ENUM (
  'PENAL',
  'COMMERC',
  'CIVIL',
  'ADM'
);

CREATE TYPE tribunal AS ENUM (
  'TR_ADM_APPL_1',
  'TR_ADM_APPL_2',
  'TR_ADM_APPL_3',
  'TR_COM_PIN_1',
  'TR_COM_PIN_2',
  'TR_COM_PIN_3',
  'TR_APPL_11',
  'TR_APPL_12',
  'TR_APPL_13'
);

-- Table des versements
CREATE TABLE IF NOT EXISTS versements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  identifiant_fiscal text NOT NULL CHECK (identifiant_fiscal ~ '^\d+$'),
  exercice_fiscal_du date NOT NULL,
  exercice_fiscal_au date NOT NULL,
  annee_versement integer NOT NULL CHECK (annee_versement >= 2020),
  status versement_status NOT NULL DEFAULT 'draft',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT exercice_fiscal_dates_check CHECK (exercice_fiscal_au >= exercice_fiscal_du),
  CONSTRAINT unique_versement_per_year UNIQUE (user_id, annee_versement)
);

-- Table des affaires juridiques
CREATE TABLE IF NOT EXISTS affaires_juridiques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  versement_id uuid REFERENCES versements(id) ON DELETE CASCADE NOT NULL,
  annee_num_dossier integer NOT NULL CHECK (annee_num_dossier > 0),
  num_dossier integer NOT NULL CHECK (num_dossier > 0),
  code_num_dossier text NOT NULL CHECK (code_num_dossier ~ '^\d{4}$'),
  date_enregistrement date NOT NULL,
  date_encaissement date NOT NULL,
  reference_paiement text NOT NULL,
  ref_nature_affaire_juridique nature_affaire NOT NULL,
  ref_tribunal tribunal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT dates_check CHECK (date_encaissement >= date_enregistrement)
);

-- Activation RLS
ALTER TABLE versements ENABLE ROW LEVEL SECURITY;
ALTER TABLE affaires_juridiques ENABLE ROW LEVEL SECURITY;

-- Politiques pour les versements
CREATE POLICY "Users can view own versements"
  ON versements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own versements"
  ON versements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own versements"
  ON versements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques pour les affaires juridiques
CREATE POLICY "Users can view own affaires"
  ON affaires_juridiques
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM versements
      WHERE versements.id = affaires_juridiques.versement_id
      AND versements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own affaires"
  ON affaires_juridiques
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM versements
      WHERE versements.id = affaires_juridiques.versement_id
      AND versements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own affaires"
  ON affaires_juridiques
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM versements
      WHERE versements.id = affaires_juridiques.versement_id
      AND versements.user_id = auth.uid()
    )
  );

-- Triggers pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER versements_updated_at
  BEFORE UPDATE ON versements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER affaires_juridiques_updated_at
  BEFORE UPDATE ON affaires_juridiques
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();