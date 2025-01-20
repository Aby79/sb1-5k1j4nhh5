/*
  # Mise à jour des codes tribunaux

  1. Modifications
    - Ajout de nouveaux codes tribunaux valides
    - Conservation des contraintes existantes
  
  2. Sécurité
    - Maintien des politiques RLS existantes
*/

-- Supprimer la contrainte existante sur ref_tribunal
ALTER TABLE excel_imports DROP CONSTRAINT IF EXISTS excel_imports_ref_tribunal_check;

-- Ajouter la nouvelle contrainte avec tous les codes tribunaux
ALTER TABLE excel_imports ADD CONSTRAINT excel_imports_ref_tribunal_check CHECK (
  ref_tribunal IN (
    -- Tribunaux administratifs
    'TR_ADM_APPL_1', 'TR_ADM_APPL_2',
    'TR_ADM_PIN_1', 'TR_ADM_PIN_2', 'TR_ADM_PIN_3', 'TR_ADM_PIN_4',
    'TR_ADM_PIN_5', 'TR_ADM_PIN_6', 'TR_ADM_PIN_7',
    -- Tribunaux commerciaux
    'TR_COM_APPL_1', 'TR_COM_APPL_2', 'TR_COM_APPL_3',
    'TR_COM_PIN_1', 'TR_COM_PIN_2', 'TR_COM_PIN_3', 'TR_COM_PIN_4',
    'TR_COM_PIN_5', 'TR_COM_PIN_6', 'TR_COM_PIN_7', 'TR_COM_PIN_8',
    -- Cours d'appel
    'TR_APPL_1', 'TR_APPL_2', 'TR_APPL_3', 'TR_APPL_4', 'TR_APPL_5',
    'TR_APPL_6', 'TR_APPL_7', 'TR_APPL_8', 'TR_APPL_9', 'TR_APPL_10',
    'TR_APPL_11', 'TR_APPL_12', 'TR_APPL_13', 'TR_APPL_14', 'TR_APPL_15',
    'TR_APPL_16', 'TR_APPL_17', 'TR_APPL_18', 'TR_APPL_19', 'TR_APPL_20',
    'TR_APPL_21', 'TR_APPL_22',
    -- Tribunaux de première instance
    'TR_PIN_1', 'TR_PIN_2', 'TR_PIN_3', 'TR_PIN_4', 'TR_PIN_5',
    'TR_PIN_6', 'TR_PIN_7', 'TR_PIN_8', 'TR_PIN_9', 'TR_PIN_10',
    'TR_PIN_11', 'TR_PIN_12', 'TR_PIN_13', 'TR_PIN_14', 'TR_PIN_15',
    'TR_PIN_16', 'TR_PIN_17', 'TR_PIN_18', 'TR_PIN_19', 'TR_PIN_20',
    'TR_PIN_21', 'TR_PIN_22', 'TR_PIN_23', 'TR_PIN_24', 'TR_PIN_25',
    'TR_PIN_26', 'TR_PIN_27', 'TR_PIN_28', 'TR_PIN_29', 'TR_PIN_30',
    'TR_PIN_31', 'TR_PIN_32', 'TR_PIN_33', 'TR_PIN_34', 'TR_PIN_36',
    'TR_PIN_37', 'TR_PIN_38', 'TR_PIN_39', 'TR_PIN_40', 'TR_PIN_41',
    'TR_PIN_42', 'TR_PIN_43', 'TR_PIN_44', 'TR_PIN_45', 'TR_PIN_46',
    'TR_PIN_47', 'TR_PIN_48', 'TR_PIN_49', 'TR_PIN_50', 'TR_PIN_51',
    'TR_PIN_52', 'TR_PIN_53', 'TR_PIN_54', 'TR_PIN_55', 'TR_PIN_56',
    'TR_PIN_57', 'TR_PIN_58', 'TR_PIN_59', 'TR_PIN_60', 'TR_PIN_61',
    'TR_PIN_62', 'TR_PIN_63', 'TR_PIN_64', 'TR_PIN_65', 'TR_PIN_66',
    'TR_PIN_67', 'TR_PIN_68', 'TR_PIN_69', 'TR_PIN_70', 'TR_PIN_71',
    'TR_PIN_72', 'TR_PIN_73', 'TR_PIN_74', 'TR_PIN_75', 'TR_PIN_76',
    'TR_PIN_77', 'TR_PIN_78', 'TR_PIN_79', 'TR_PIN_80', 'TR_PIN_83',
    -- Cour de cassation
    'TR_CASS_1'
  )
);