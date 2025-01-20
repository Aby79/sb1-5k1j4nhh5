import React, { useState, useEffect } from 'react';
import { generateEdiXml, VersementData } from '../lib/xml-generator';
import { FileCheck, AlertCircle, Download } from 'lucide-react';
import JSZip from 'jszip';

interface XmlGeneratorProps {
  excelData: any[];
}

interface FiscalInfo {
  identifiantFiscal: string;
  exerciceFiscalDu: string;
  exerciceFiscalAu: string;
  anneeVersement: number;
}

// Fonction pour extraire l'année d'une date
function extractYear(dateStr: string | number): number {
  if (!dateStr) return new Date().getFullYear();
  
  const date = String(dateStr);
  
  // Format AAAA-MM-JJ
  const isoMatch = date.match(/^(\d{4})-\d{2}-\d{2}/);
  if (isoMatch) {
    return parseInt(isoMatch[1]);
  }
  
  // Format JJ/MM/AAAA
  const frMatch = date.match(/^\d{2}\/\d{2}\/(\d{4})$/);
  if (frMatch) {
    return parseInt(frMatch[1]);
  }
  
  // Si c'est déjà une année
  if (/^\d{4}$/.test(date)) {
    return parseInt(date);
  }
  
  return new Date().getFullYear();
}

export function XmlGenerator({ excelData }: XmlGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // État initial avec les données du premier enregistrement Excel
  const [fiscalInfo, setFiscalInfo] = useState<FiscalInfo>(() => {
    if (Array.isArray(excelData) && excelData.length > 0) {
      const firstRecord = excelData[0];
      const year = extractYear(firstRecord.date_enregistrement || firstRecord.dateEnregistrement || new Date().getFullYear());
      
      return {
        identifiantFiscal: '',
        exerciceFiscalDu: `${year}-01-01`,
        exerciceFiscalAu: `${year}-12-31`,
        anneeVersement: year
      };
    }
    
    const currentYear = new Date().getFullYear();
    return {
      identifiantFiscal: '',
      exerciceFiscalDu: `${currentYear}-01-01`,
      exerciceFiscalAu: `${currentYear}-12-31`,
      anneeVersement: currentYear
    };
  });

  // Effet pour mettre à jour les dates d'exercice fiscal en fonction des données Excel
  useEffect(() => {
    if (Array.isArray(excelData) && excelData.length > 0) {
      // Trouver la première et la dernière date d'enregistrement
      const dates = excelData
        .map(row => row.date_enregistrement || row.dateEnregistrement)
        .filter(Boolean)
        .sort();

      if (dates.length > 0) {
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const year = extractYear(firstDate);

        setFiscalInfo(prev => ({
          ...prev,
          exerciceFiscalDu: firstDate,
          exerciceFiscalAu: lastDate,
          anneeVersement: year
        }));
      }
    }
  }, [excelData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'anneeVersement') {
      setFiscalInfo(prev => ({
        ...prev,
        [name]: parseInt(value) || prev.anneeVersement
      }));
    } else {
      setFiscalInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!Array.isArray(excelData) || excelData.length === 0) {
        throw new Error('Aucune donnée à générer');
      }

      // Préparation des données
      const versementData: VersementData = {
        identifiantFiscal: fiscalInfo.identifiantFiscal.trim(),
        exerciceFiscalDu: fiscalInfo.exerciceFiscalDu,
        exerciceFiscalAu: fiscalInfo.exerciceFiscalAu,
        anneeVersement: fiscalInfo.anneeVersement,
        affairesJuridiques: excelData.map(row => ({
          anneeNumDossier: row.annee_num_dossier || row.anneeNumDossier,
          numDossier: row.num_dossier || row.numDossier,
          codeNumDossier: row.code_num_dossier || row.codeNumDossier,
          dateEnregistrement: row.date_enregistrement || row.dateEnregistrement,
          dateEncaissement: row.date_encaissement || row.dateEncaissement,
          referencePaiement: row.reference_paiement || row.referencePaiement,
          refNatureAffaireJuridique: row.ref_nature_affaire_juridique || row.refNatureAffaireJuridique,
          refTribunal: row.ref_tribunal || row.refTribunal
        }))
      };

      // Génération du XML
      const { content: xmlContent, filename: xmlFilename } = generateEdiXml(versementData);

      // Création du ZIP
      const zip = new JSZip();
      zip.file(xmlFilename, xmlContent);

      // Génération du ZIP
      const zipContent = await zip.generateAsync({ type: 'blob' });

      // Téléchargement du fichier ZIP
      const zipFilename = xmlFilename.replace('.xml', '.zip');
      const url = window.URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du fichier');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations fiscales */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Informations de versement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="identifiantFiscal" className="block text-sm font-medium text-gray-700 mb-1">
              Identifiant Fiscal *
            </label>
            <div className="relative">
              <input
                id="identifiantFiscal"
                type="text"
                name="identifiantFiscal"
                value={fiscalInfo.identifiantFiscal}
                onChange={handleInputChange}
                pattern="\d+"
                placeholder="Ex: 123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-sm text-gray-500">Numérique</span>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="anneeVersement" className="block text-sm font-medium text-gray-700 mb-1">
              Année de versement
            </label>
            <input
              id="anneeVersement"
              type="number"
              name="anneeVersement"
              value={fiscalInfo.anneeVersement}
              onChange={handleInputChange}
              min="2020"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="exerciceFiscalDu" className="block text-sm font-medium text-gray-700 mb-1">
              Exercice fiscal du *
            </label>
            <input
              id="exerciceFiscalDu"
              type="date"
              name="exerciceFiscalDu"
              value={fiscalInfo.exerciceFiscalDu}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="exerciceFiscalAu" className="block text-sm font-medium text-gray-700 mb-1">
              Exercice fiscal au *
            </label>
            <input
              id="exerciceFiscalAu"
              type="date"
              name="exerciceFiscalAu"
              value={fiscalInfo.exerciceFiscalAu}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Aperçu des données */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Aperçu des affaires juridiques</h3>
          <span className="text-sm text-gray-500">
            {excelData.length} affaire(s) juridique(s)
          </span>
        </div>
        
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
              {excelData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.annee_num_dossier || row.anneeNumDossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.num_dossier || row.numDossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.code_num_dossier || row.codeNumDossier}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.date_enregistrement || row.dateEnregistrement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.date_encaissement || row.dateEncaissement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.reference_paiement || row.referencePaiement}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.ref_nature_affaire_juridique || row.refNatureAffaireJuridique}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {row.ref_tribunal || row.refTribunal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Messages d'erreur ou de succès */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">Fichier EDI généré avec succès</h3>
            <p className="text-sm text-green-700 mt-1">
              Le fichier ZIP contenant le XML a été généré et téléchargé automatiquement.
            </p>
          </div>
        </div>
      )}

      {/* Bouton de génération */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !Array.isArray(excelData) || excelData.length === 0 || !fiscalInfo.identifiantFiscal}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Génération en cours...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Générer EDI
            </>
          )}
        </button>
      </div>
    </div>
  );
}