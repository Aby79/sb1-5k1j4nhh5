/*
  # Ajout des champs fiscaux à la table excel_imports

  1. Modifications
    - Ajout des colonnes pour les informations fiscales :
      - identifiant_fiscal (texte, requis)
      - exercice_fiscal_du (date, requis)
      - exercice_fiscal_au (date, requis)
      - annee_versement (entier, requis)
    - Ajout des contraintes de validation pour les nouvelles colonnes
    - Mise à jour des index pour optimiser les performances

  2. Sécurité
    - Les politiques RLS existantes s'appliquent aux nouvelles colonnes
*/

-- Ajout des colonnes pour les informations fiscales
ALTER TABLE excel_imports 
ADD COLUMN IF NOT EXISTS identifiant_fiscal text,
ADD COLUMN IF NOT EXISTS exercice_fiscal_du date,
ADD COLUMN IF NOT EXISTS exercice_fiscal_au date,
ADD COLUMN IF NOT EXISTS annee_versement integer;

-- Ajout des contraintes de validation
ALTER TABLE excel_imports 
ADD CONSTRAINT identifiant_fiscal_check CHECK (identifiant_fiscal ~ '^\d+$'),
ADD CONSTRAINT exercice_fiscal_dates_check CHECK (exercice_fiscal_au >= exercice_fiscal_du),
ADD CONSTRAINT annee_versement_check CHECK (annee_versement >= 2020 AND annee_versement <= 2100);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS excel_imports_annee_versement_idx ON excel_imports(annee_versement);
CREATE INDEX IF NOT EXISTS excel_imports_exercice_fiscal_du_idx ON excel_imports(exercice_fiscal_du);
CREATE INDEX IF NOT EXISTS excel_imports_exercice_fiscal_au_idx ON excel_imports(exercice_fiscal_au);