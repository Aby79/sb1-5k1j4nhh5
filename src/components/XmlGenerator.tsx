import React, { useState } from 'react';
import JSZip from 'jszip';
import { create } from 'xmlbuilder2';
import * as XLSX from 'xlsx';

interface ExcelRow {
  anneeNumDossier: number;
  numDossier: number;
  codeNumDossier: number;
  dateEnregistrement: string;
  dateEncaissement: string;
  referencePaiement: string;
  refNatureAffaireJuridique: string;
  refTribunal: string;
}

export function XmlGeneratorApp(): JSX.Element {
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Validation et mappage des données
          const mappedData = jsonData.map((row: any) => {
            if (!row['Année'] || !row['Numéro de Dossier'] || !row['Code Dossier']) {
              throw new Error('Le fichier Excel est mal formaté ou contient des données manquantes.');
            }
            return {
              anneeNumDossier: row['Année'],
              numDossier: row['Numéro de Dossier'],
              codeNumDossier: row['Code Dossier'],
              dateEnregistrement: row['Date Enregistrement'] || '',
              dateEncaissement: row['Date Encaissement'] || '',
              referencePaiement: row['Référence Paiement'] || '',
              refNatureAffaireJuridique: row['Nature Affaire'] || '',
              refTribunal: row['Tribunal'] || '',
            };
          });

          setExcelData(mappedData as ExcelRow[]);
          setError(null);
        } catch (err) {
          setError('Erreur lors du traitement du fichier Excel : ' + (err as Error).message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Aucun fichier sélectionné.');
    }
  };

  const generateXML = (data: {
    identifiantFiscal: string;
    exerciceFiscalDu: string;
    exerciceFiscalAu: string;
    anneeVersement: number;
    affaires: ExcelRow[];
  }): string => {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('VersementAvocatsRAF', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'VersementAvocatsRAF.xsd'
      });

    root
      .ele('identifiantFiscal').txt(data.identifiantFiscal).up()
      .ele('exerciceFiscalDu').txt(data.exerciceFiscalDu).up()
      .ele('exerciceFiscalAu').txt(data.exerciceFiscalAu).up()
      .ele('anneeVersement').txt(data.anneeVersement.toString()).up();

    const listDetail = root.ele('listDetailAffaireJuridique');

    data.affaires.forEach(affaire => {
      const detail = listDetail.ele('DetailAffaireJuridiqueRAF');
      detail
        .ele('anneeNumDossier').txt(affaire.anneeNumDossier.toString()).up()
        .ele('numDossier').txt(affaire.numDossier.toString()).up()
        .ele('codeNumDossier').txt(affaire.codeNumDossier.toString()).up()
        .ele('dateEnregistrement').txt(affaire.dateEnregistrement).up()
        .ele('dateEncaissement').txt(affaire.dateEncaissement).up()
        .ele('referencePaiement').txt(affaire.referencePaiement).up()
        .ele('refNatureAffaireJuridique')
          .ele('code').txt(affaire.refNatureAffaireJuridique).up()
        .up()
        .ele('refTribunal')
          .ele('code').txt(affaire.refTribunal).up()
        .up();
    });

    return root.end({ prettyPrint: true });
  };

  const handleGenerate = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!Array.isArray(excelData) || excelData.length === 0) {
        throw new Error('Aucune donnée disponible pour générer le fichier XML.');
      }

      // Préparer les données pour la génération du XML
      const data = {
        identifiantFiscal: '123456789', // Remplacez par la vraie valeur si nécessaire
        exerciceFiscalDu: '2024-01-01',
        exerciceFiscalAu: '2024-12-31',
        anneeVersement: 2024,
        affaires: excelData,
      };

      const xmlContent = generateXML(data);

      // Créer un fichier ZIP
      const zip = new JSZip();
      const xmlFilename = 'VersementAvocatsRAF.xml';
      zip.file(xmlFilename, xmlContent);

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Téléchargement du fichier ZIP
      const zipFilename = 'VersementAvocatsRAF.zip';
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Portail des Avocats</h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Importer un fichier Excel :</span>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>

      {error && <div className="text-red-600">Erreur: {error}</div>}
      {success && <div className="text-green-600">Fichier XML généré avec succès.</div>}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Aperçu des données Excel</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Numéro de Dossier</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code Dossier</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Enregistrement</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Encaissement</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Référence Paiement</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nature Affaire</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tribunal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.anneeNumDossier}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.numDossier}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.codeNumDossier}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.dateEnregistrement}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.dateEncaissement}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.referencePaiement}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.refNatureAffaireJuridique}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.refTribunal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Génération en cours...' : 'Générer XML'}
      </button>
    </div>
  );
}
