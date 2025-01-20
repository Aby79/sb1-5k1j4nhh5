// Types pour les données EDI
export interface EdiData {
  identifiantFiscal: string;
  exerciceFiscalDu: string;
  exerciceFiscalAu: string;
  anneeVersement: number;
  affairesJuridiques: AffaireJuridique[];
}

export interface AffaireJuridique {
  anneeNumDossier: number;
  numDossier: number;
  codeNumDossier: string;
  dateEnregistrement: string;
  dateEncaissement: string;
  referencePaiement: string;
  refNatureAffaireJuridique: 'PENAL' | 'COMMERC' | 'CIVIL' | 'ADM';
  refTribunal: 'TR_APPL_11' | 'TR_APPL_12' | 'TR_APPL_13';
}

// Exemple de données valides
export const exampleData: EdiData = {
  identifiantFiscal: "123456789",
  exerciceFiscalDu: "2024-01-01",
  exerciceFiscalAu: "2024-12-31",
  anneeVersement: 2024,
  affairesJuridiques: [
    {
      anneeNumDossier: 2024,
      numDossier: 1001,
      codeNumDossier: "7101",
      dateEnregistrement: "2024-01-15",
      dateEncaissement: "2024-02-01",
      referencePaiement: "REF2024-001",
      refNatureAffaireJuridique: "CIVIL",
      refTribunal: "TR_APPL_11"
    },
    {
      anneeNumDossier: 2024,
      numDossier: 1002,
      codeNumDossier: "7102",
      dateEnregistrement: "2024-01-20",
      dateEncaissement: "2024-02-05",
      referencePaiement: "REF2024-002",
      refNatureAffaireJuridique: "COMMERC",
      refTribunal: "TR_APPL_12"
    }
  ]
};

// Exemple de XML généré
export const exampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<VersementAvocatsRAF xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="VersementAvocatsRAF.xsd">
  <identifiantFiscal>123456789</identifiantFiscal>
  <exerciceFiscalDu>2024-01-01</exerciceFiscalDu>
  <exerciceFiscalAu>2024-12-31</exerciceFiscalAu>
  <anneeVersement>2024</anneeVersement>
  <listDetailAffaireJuridique>
    <DetailAffaireJuridiqueRAF>
      <anneeNumDossier>2024</anneeNumDossier>
      <numDossier>1001</numDossier>
      <codeNumDossier>7101</codeNumDossier>
      <dateEnregistrement>2024-01-15</dateEnregistrement>
      <dateEncaissement>2024-02-01</dateEncaissement>
      <referencePaiement>REF2024-001</referencePaiement>
      <refNatureAffaireJuridique>
        <code>CIVIL</code>
      </refNatureAffaireJuridique>
      <refTribunal>
        <code>TR_APPL_11</code>
      </refTribunal>
    </DetailAffaireJuridiqueRAF>
    <DetailAffaireJuridiqueRAF>
      <anneeNumDossier>2024</anneeNumDossier>
      <numDossier>1002</numDossier>
      <codeNumDossier>7102</codeNumDossier>
      <dateEnregistrement>2024-01-20</dateEnregistrement>
      <dateEncaissement>2024-02-05</dateEncaissement>
      <referencePaiement>REF2024-002</referencePaiement>
      <refNatureAffaireJuridique>
        <code>COMMERC</code>
      </refNatureAffaireJuridique>
      <refTribunal>
        <code>TR_APPL_12</code>
      </refTribunal>
    </DetailAffaireJuridiqueRAF>
  </listDetailAffaireJuridique>
</VersementAvocatsRAF>`;

// Guide de validation des données
export const validationGuide = {
  identifiantFiscal: {
    description: "Identifiant fiscal de l'avocat",
    format: "Chaîne de caractères numériques",
    exemple: "123456789",
    validation: "Doit contenir uniquement des chiffres"
  },
  dates: {
    description: "Dates d'exercice fiscal et de versement",
    format: "AAAA-MM-JJ",
    exemple: "2024-01-01",
    validation: "Date valide au format ISO"
  },
  natureAffaire: {
    description: "Nature de l'affaire juridique",
    valeursPossibles: ["PENAL", "COMMERC", "CIVIL", "ADM"],
    exemple: "CIVIL",
    validation: "Doit être une des valeurs autorisées"
  },
  tribunal: {
    description: "Code du tribunal",
    valeursPossibles: ["TR_APPL_11", "TR_APPL_12", "TR_APPL_13"],
    exemple: "TR_APPL_11",
    validation: "Doit être un code tribunal valide"
  },
  numeroDossier: {
    description: "Numéro du dossier",
    format: "Nombre entier positif",
    exemple: "1001",
    validation: "Doit être un nombre entier supérieur à 0"
  },
  codeNumDossier: {
    description: "Code du dossier",
    format: "4 chiffres",
    exemple: "7101",
    validation: "Doit être une chaîne de 4 chiffres"
  },
  referencePaiement: {
    description: "Référence unique du paiement",
    format: "Chaîne de caractères",
    exemple: "REF2024-001",
    validation: "Ne doit pas être vide"
  }
};