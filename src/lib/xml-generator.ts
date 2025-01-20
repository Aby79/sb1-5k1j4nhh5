import { create } from 'xmlbuilder2';

// Types et constantes
export const NATURE_AFFAIRE_CODES = ['PENAL', 'COMMERC', 'CIVIL', 'ADM'] as const;

// Codes des tribunaux selon l'annexe 2
export const TRIBUNAL_CODES = [
  // Tribunaux administratifs
  'TR_ADM_APPL_1', 'TR_ADM_APPL_2',
  'TR_ADM_PIN_1', 'TR_ADM_PIN_2', 'TR_ADM_PIN_3', 'TR_ADM_PIN_4',
  'TR_ADM_PIN_5', 'TR_ADM_PIN_6', 'TR_ADM_PIN_7',
  // Tribunaux commerciaux
  'TR_COM_APPL_1', 'TR_COM_APPL_2', 'TR_COM_APPL_3',
  'TR_COM_PIN_1', 'TR_COM_PIN_2', 'TR_COM_PIN_3', 'TR_COM_PIN_4',
  'TR_COM_PIN_5', 'TR_COM_PIN_6', 'TR_COM_PIN_7', 'TR_COM_PIN_8',
  // Cours d'appel
  'TR_APPL_1', 'TR_APPL_2', 'TR_APPL_3', 'TR_APPL_4', 'TR_APPL_5',
  'TR_APPL_6', 'TR_APPL_7', 'TR_APPL_8', 'TR_APPL_9', 'TR_APPL_10',
  'TR_APPL_11', 'TR_APPL_12', 'TR_APPL_13', 'TR_APPL_14', 'TR_APPL_15',
  'TR_APPL_16', 'TR_APPL_17', 'TR_APPL_18', 'TR_APPL_19', 'TR_APPL_20',
  'TR_APPL_21', 'TR_APPL_22',
  // Tribunaux de première instance
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
  // Cour de cassation
  'TR_CASS_1'
] as const;

export type NatureAffaire = typeof NATURE_AFFAIRE_CODES[number];
export type TribunalCode = typeof TRIBUNAL_CODES[number];

export interface AffaireJuridique {
  anneeNumDossier: number;
  numDossier: number;
  codeNumDossier: string;
  dateEnregistrement: string;
  dateEncaissement: string;
  referencePaiement: string;
  refNatureAffaireJuridique: string;
  refTribunal: string;
}

export interface VersementData {
  identifiantFiscal: string;
  exerciceFiscalDu: string;
  exerciceFiscalAu: string;
  anneeVersement: number;
  affairesJuridiques: AffaireJuridique[];
}

// Fonction pour formater une date au format AAAA-MM-JJ
function formatDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];

  try {
    // Si c'est déjà une date au format ISO
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateStr.split('T')[0];
    }

    // Format JJ/MM/AAAA
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Si le format n'est pas reconnu, retourner la date actuelle
    return new Date().toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

// Fonction pour valider une affaire juridique
function validateAffaireJuridique(affaire: AffaireJuridique, index: number): void {
  const errors: string[] = [];

  // Validation de l'année
  if (!affaire.anneeNumDossier || isNaN(affaire.anneeNumDossier)) {
    errors.push(`Ligne ${index + 1}: Année du dossier invalide`);
  }

  // Validation du numéro de dossier
  if (!affaire.numDossier || isNaN(affaire.numDossier)) {
    errors.push(`Ligne ${index + 1}: Numéro de dossier invalide`);
  }

  // Validation du code dossier
  if (!affaire.codeNumDossier || !/^\d{4}$/.test(affaire.codeNumDossier)) {
    errors.push(`Ligne ${index + 1}: Code dossier invalide (doit être un nombre à 4 chiffres)`);
  }

  // Validation des dates
  try {
    const dateEnreg = formatDate(affaire.dateEnregistrement);
    const dateEncais = formatDate(affaire.dateEncaissement);

    if (dateEncais < dateEnreg) {
      errors.push(`Ligne ${index + 1}: La date d'encaissement doit être postérieure ou égale à la date d'enregistrement`);
    }
  } catch (error) {
    errors.push(`Ligne ${index + 1}: Format de date invalide`);
  }

  // Validation de la référence de paiement
  if (!affaire.referencePaiement?.trim()) {
    errors.push(`Ligne ${index + 1}: Référence de paiement manquante`);
  }

  // Validation de la nature d'affaire
  if (!NATURE_AFFAIRE_CODES.includes(affaire.refNatureAffaireJuridique as NatureAffaire)) {
    errors.push(`Ligne ${index + 1}: Nature d'affaire invalide. Valeurs possibles: ${NATURE_AFFAIRE_CODES.join(', ')}`);
  }

  // Validation du tribunal
  if (!TRIBUNAL_CODES.includes(affaire.refTribunal as TribunalCode)) {
    errors.push(`Ligne ${index + 1}: Code tribunal invalide`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

// Fonction pour générer le nom du fichier
function generateFileName(identifiantFiscal: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `VersementAvocats_${identifiantFiscal}_${timestamp}.xml`;
}

// Fonction de validation des données
function validateData(data: VersementData): void {
  const errors: string[] = [];

  // Validation de l'identifiant fiscal
  if (!data.identifiantFiscal?.trim()) {
    errors.push('L\'identifiant fiscal est requis');
  }
  if (!/^\d+$/.test(data.identifiantFiscal)) {
    errors.push('L\'identifiant fiscal doit contenir uniquement des chiffres');
  }

  // Validation des dates d'exercice
  try {
    const dateDu = formatDate(data.exerciceFiscalDu);
    const dateAu = formatDate(data.exerciceFiscalAu);

    if (dateAu < dateDu) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }
  } catch (error) {
    errors.push('Format de date invalide pour l\'exercice fiscal');
  }

  // Validation de l'année de versement
  const currentYear = new Date().getFullYear();
  if (!data.anneeVersement || isNaN(data.anneeVersement) || 
      data.anneeVersement < 2020 || data.anneeVersement > currentYear + 1) {
    errors.push(`L'année de versement doit être comprise entre 2020 et ${currentYear + 1}`);
  }

  // Validation des affaires juridiques
  if (!Array.isArray(data.affairesJuridiques) || data.affairesJuridiques.length === 0) {
    errors.push('La liste des affaires juridiques est vide');
  } else {
    data.affairesJuridiques.forEach((affaire, index) => {
      try {
        validateAffaireJuridique(affaire, index);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : `Erreur dans l'affaire ${index + 1}`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n\n'));
  }
}

// Fonction de génération XML
export function generateEdiXml(data: VersementData): { content: string; filename: string } {
  try {
    // Validation des données
    validateData(data);

    // Création du document XML selon l'annexe 1
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('VersementAvocatsRAF')
      .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
      .att('xsi:noNamespaceSchemaLocation', 'VersementAvocatsRAF.xsd');

    // Ajout des informations d'en-tête
    doc.ele('identifiantFiscal').txt(data.identifiantFiscal);
    doc.ele('exerciceFiscalDu').txt(formatDate(data.exerciceFiscalDu));
    doc.ele('exerciceFiscalAu').txt(formatDate(data.exerciceFiscalAu));
    doc.ele('anneeVersement').txt(data.anneeVersement.toString());

    // Ajout de la liste des affaires juridiques
    const listDetailAffaire = doc.ele('listDetailAffaireJuridique');

    // Tri des affaires par date d'enregistrement
    const sortedAffaires = [...data.affairesJuridiques].sort((a, b) => 
      formatDate(a.dateEnregistrement).localeCompare(formatDate(b.dateEnregistrement))
    );

    // Ajout de chaque affaire juridique
    sortedAffaires.forEach(affaire => {
      const detailAffaire = listDetailAffaire.ele('DetailAffaireJuridiqueRAF');
      
      detailAffaire.ele('anneeNumDossier').txt(affaire.anneeNumDossier.toString());
      detailAffaire.ele('numDossier').txt(affaire.numDossier.toString());
      detailAffaire.ele('codeNumDossier').txt(affaire.codeNumDossier);
      detailAffaire.ele('dateEnregistrement').txt(formatDate(affaire.dateEnregistrement));
      detailAffaire.ele('dateEncaissement').txt(formatDate(affaire.dateEncaissement));
      detailAffaire.ele('referencePaiement').txt(affaire.referencePaiement);
      
      const refNature = detailAffaire.ele('refNatureAffaireJuridique');
      refNature.ele('code').txt(affaire.refNatureAffaireJuridique);
      
      const refTribunal = detailAffaire.ele('refTribunal');
      refTribunal.ele('code').txt(affaire.refTribunal);
    });

    // Génération du XML avec indentation
    return {
      content: doc.end({ prettyPrint: true }),
      filename: generateFileName(data.identifiantFiscal)
    };
  } catch (error) {
    console.error('Erreur lors de la génération du XML:', error);
    throw error instanceof Error ? error : new Error('Erreur lors de la génération du XML');
  }
}