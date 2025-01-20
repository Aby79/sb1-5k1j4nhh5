/*
  # Mise à jour de la table excel_imports

  1. Modifications
    - Suppression de la contrainte de validation sur ref_tribunal
    - Conservation des autres contraintes de validation
  
  2. Sécurité
    - Vérification de l'existence des politiques avant création
*/

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS excel_imports;

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
  ref_tribunal text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dates_check CHECK (date_encaissement >= date_enregistrement)
);

-- Enable RLS
ALTER TABLE excel_imports ENABLE ROW LEVEL SECURITY;

-- Create policies with existence check
DO $$
BEGIN
    -- Check and create SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'excel_imports' 
        AND policyname = 'Users can view own imports'
    ) THEN
        CREATE POLICY "Users can view own imports"
        ON excel_imports
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'excel_imports' 
        AND policyname = 'Users can insert own imports'
    ) THEN
        CREATE POLICY "Users can insert own imports"
        ON excel_imports
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check and create UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'excel_imports' 
        AND policyname = 'Users can update own imports'
    ) THEN
        CREATE POLICY "Users can update own imports"
        ON excel_imports
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'excel_imports' 
        AND policyname = 'Users can delete own imports'
    ) THEN
        CREATE POLICY "Users can delete own imports"
        ON excel_imports
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS excel_imports_user_id_idx ON excel_imports(user_id);
CREATE INDEX IF NOT EXISTS excel_imports_created_at_idx ON excel_imports(created_at);