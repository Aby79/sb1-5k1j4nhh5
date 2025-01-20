import { supabase } from './supabase';
import * as XLSX from 'xlsx';
import { Database } from './database.types';

type ExcelImport = Database['public']['Tables']['excel_imports']['Insert'];

// Fonction pour formater une date
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

// Fonction pour valider et formater les données Excel
function validateAndFormatExcelData(rawData: any[]): ExcelImport[] {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('Le fichier ne contient aucune donnée');
  }

  const formattedData: ExcelImport[] = [];

  rawData.forEach((row: any) => {
    // Préserver les valeurs exactes du fichier Excel
    formattedData.push({
      annee_num_dossier: row.anneeVersement || row.annee_num_dossier || row.anneeNumDossier,
      num_dossier: row.numDossier || row.num_dossier,
      code_num_dossier: String(row.codeNumDossier || row.code_num_dossier || '').padStart(4, '0'),
      date_enregistrement: formatDate(row.dateEnregistrement || row.date_enregistrement),
      date_encaissement: formatDate(row.dateEncaissement || row.date_encaissement),
      reference_paiement: row.referencePaiement || row.reference_paiement || 'CDOSS',
      ref_nature_affaire_juridique: (row.refNatureAffaireJuridique || row.ref_nature_affaire_juridique || 'COMMERC').toUpperCase(),
      ref_tribunal: (row.refTribunal || row.ref_tribunal || 'TR_COM_PIN_2').toUpperCase(),
      user_id: '' // Sera rempli plus tard
    });
  });

  return formattedData;
}

// Fonction pour vider la table des données d'un utilisateur
async function clearExcelImports(userId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  try {
    const { error } = await supabase
      .from('excel_imports')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Erreur lors de la suppression des données: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage de la table:', error);
    throw error;
  }
}

// Fonction pour stocker les données dans Supabase
export async function storeExcelData(userId: string, data: any[]): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  try {
    // 1. Vider la table pour cet utilisateur
    await clearExcelImports(userId);

    // 2. Formater les nouvelles données
    const formattedData = validateAndFormatExcelData(data);

    // 3. Ajouter l'ID utilisateur à chaque ligne
    const dataWithUserId = formattedData.map(row => ({
      ...row,
      user_id: userId
    }));

    // 4. Insérer les nouvelles données
    const { error: insertError } = await supabase
      .from('excel_imports')
      .insert(dataWithUserId);

    if (insertError) {
      throw new Error(`Erreur lors de l'insertion des données: ${insertError.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Une erreur inattendue est survenue lors du traitement des données');
    }
  }
}

// Fonction pour récupérer les données de Supabase
export async function getExcelData(userId: string): Promise<any[]> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const { data, error } = await supabase
    .from('excel_imports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
  }

  return data || [];
}