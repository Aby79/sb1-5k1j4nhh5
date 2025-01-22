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
  const isoMatch = date.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) {
    return parseInt(date.split('-')[0]);
  }

  // Format JJ/MM/AAAA
  const frMatch = date.match(/^\d{2}\/\d{2}\/\d{4}$/);
  if (frMatch) {
    return parseInt(date.split('/')[2]);
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

  const [fiscalInfo, setFiscalInfo] = useState<FiscalInfo>(() => {
    if (Array.isArray(excelData) && excelData.length > 0) {
      const firstRecord = excelData[0];
      const year = extractYear(
        firstRecord.date_enregistrement || firstRecord.dateEnregistrement || new Date().getFullYear()
      );

      return {
        identifiantFiscal: '',
        exerciceFiscalDu: `${year}-01-01`,
        exerciceFiscalAu: `${year}-12-31`,
        anneeVersement: year,
      };
    }

    const currentYear = new Date().getFullYear();
    return {
      identifiantFiscal: '',
      exerciceFiscalDu: `${currentYear}-01-01`,
      exerciceFiscalAu: `${currentYear}-12-31`,
      anneeVersement: currentYear,
    };
  });

  useEffect(() => {
    if (Array.isArray(excelData) && excelData.length > 0) {
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
          anneeVersement: year,
        }));
      }
    }
  }, [excelData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'anneeVersement') {
      setFiscalInfo(prev => ({
        ...prev,
        [name]: parseInt(value) || prev.anneeVersement,
      }));
    } else {
      setFiscalInfo(prev => ({
        ...prev,
        [name]: value,
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
          refTribunal: row.ref_tribunal || row.refTribunal,
        })),
      };

      const { content: xmlContent, filename: xmlFilename } = generateEdiXml(versementData);

      const zip = new JSZip();
      zip.file(xmlFilename, xmlContent);

      const zipContent = await zip.generateAsync({ type: 'blob' });

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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Informations de versement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="identifiantFiscal" className="block text-sm font-medium text-gray-700 mb-1">
              Identifiant Fiscal *
            </label>
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
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-end gap-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !fiscalInfo.identifiantFiscal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Génération en cours...' : 'Générer EDI'}
          </button>
        </div>
      </div>
    </div>
  );
}
