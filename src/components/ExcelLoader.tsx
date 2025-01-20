import React, { useState } from 'react';
import { Upload, AlertCircle, Download, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ExcelLoader() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const downloadTemplate = () => {
    // Créer un exemple de données
    const templateData = [
      {
        annee_num_dossier: 2024,
        num_dossier: 1,
        code_num_dossier: "7101",
        date_enregistrement: "01/01/2024",
        date_encaissement: "15/01/2024",
        reference_paiement: "REF001",
        ref_nature_affaire_juridique: "CIVIL",
        ref_tribunal: "TR_PIN_1"
      }
    ];

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Modèle");

    // Télécharger le fichier
    XLSX.writeFile(wb, "modele_import.xlsx");
  };

  const processExcelFile = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convertir les données en tableau d'objets sans validation
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        raw: false,
        defval: ''
      });

      // Formatage minimal des données
      const formattedData = rawData.map((row: any) => ({
        annee_num_dossier: parseInt(String(row.annee_num_dossier || '0').replace(/[^\d]/g, '')),
        num_dossier: parseInt(String(row.num_dossier || '0').replace(/[^\d]/g, '')),
        code_num_dossier: String(row.code_num_dossier || '0000').padStart(4, '0'),
        date_enregistrement: row.date_enregistrement || '',
        date_encaissement: row.date_encaissement || '',
        reference_paiement: String(row.reference_paiement || ''),
        ref_nature_affaire_juridique: String(row.ref_nature_affaire_juridique || '').toUpperCase(),
        ref_tribunal: String(row.ref_tribunal || '').toUpperCase()
      }));

      setData(formattedData);
    } catch (err) {
      setError('Erreur lors du traitement du fichier');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        processExcelFile(file);
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xls ou .xlsx)');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        processExcelFile(file);
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xls ou .xlsx)');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Guide d'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          Guide d'importation simplifié
        </h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Utilisez le modèle Excel fourni ci-dessous</li>
          <li>Remplissez les colonnes selon vos besoins</li>
          <li>Les valeurs manquantes seront remplacées par des valeurs par défaut</li>
        </ul>
        <button
          onClick={downloadTemplate}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FileDown className="w-4 h-4" />
          Télécharger le modèle Excel
        </button>
      </div>

      {/* Zone de dépôt de fichier */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-900">
          Glissez-déposez votre fichier Excel ici
        </p>
        <p className="mt-2 text-sm text-gray-600">ou</p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            className="hidden"
            accept=".xls,.xlsx"
            onChange={handleFileInput}
          />
          <span className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
            Parcourir les fichiers
          </span>
        </label>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* Tableau des données */}
      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Dossier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Enreg.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Encais.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nature
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tribunal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.annee_num_dossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.num_dossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.code_num_dossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.date_enregistrement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.date_encaissement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.reference_paiement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.ref_nature_affaire_juridique}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.ref_tribunal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}