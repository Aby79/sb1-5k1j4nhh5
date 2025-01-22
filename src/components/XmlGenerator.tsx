import React, { useState, useEffect } from 'react';
import { generateEdiXml, VersementData } from '../lib/xml-generator';
import { AlertCircle, FileCheck, Download } from 'lucide-react';

interface XmlGeneratorProps {
  excelData: any[];
}

interface FiscalInfo {
  identifiantFiscal: string;
  exerciceFiscalDu: string;
  exerciceFiscalAu: string;
  anneeVersement: number;
}

function extractYear(dateStr: string | number): number {
  if (!dateStr) return new Date().getFullYear();
  const date = String(dateStr);
  const isoMatch = date.match(/^(\d{4})-\d{2}-\d{2}/);
  if (isoMatch) return parseInt(isoMatch[1]);
  const frMatch = date.match(/^\d{2}\/\d{2}\/(\d{4})$/);
  if (frMatch) return parseInt(frMatch[1]);
  if (/^\d{4}$/.test(date)) return parseInt(date);
  return new Date().getFullYear();
}

export function XmlGenerator({ excelData }: XmlGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fiscalInfo, setFiscalInfo] = useState<FiscalInfo>(() => {
    const currentYear = new Date().getFullYear();
    return {
      identifiantFiscal: '',
      exerciceFiscalDu: `${currentYear}-01-01`,
      exerciceFiscalAu: `${currentYear}-12-31`,
      anneeVersement: currentYear,
    };
  });

  useEffect(() => {
    if (excelData.length > 0) {
      const dates = excelData.map(row => row.date_enregistrement).filter(Boolean).sort();
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
    setFiscalInfo(prev => ({
      ...prev,
      [name]: name === 'anneeVersement' ? parseInt(value) || prev.anneeVersement : value,
    }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!fiscalInfo.identifiantFiscal.trim()) {
        throw new Error('L\'identifiant fiscal est obligatoire.');
      }

      const versementData: VersementData = {
        identifiantFiscal: fiscalInfo.identifiantFiscal.trim(),
        exerciceFiscalDu: fiscalInfo.exerciceFiscalDu,
        exerciceFiscalAu: fiscalInfo.exerciceFiscalAu,
        anneeVersement: fiscalInfo.anneeVersement,
        affairesJuridiques: excelData.map(row => ({
          anneeNumDossier: row.annee_num_dossier,
          numDossier: row.num_dossier,
          codeNumDossier: row.code_num_dossier,
          dateEnregistrement: row.date_enregistrement,
          dateEncaissement: row.date_encaissement,
          referencePaiement: row.reference_paiement,
          refNatureAffaireJuridique: { code: row.ref_nature_affaire_juridique },
          refTribunal: { code: row.ref_tribunal },
        })),
      };

      const { content: xmlContent, filename: xmlFilename } = generateEdiXml(versementData);

      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = xmlFilename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Informations fiscales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="identifiantFiscal" className="block text-sm font-medium text-gray-700">Identifiant Fiscal *</label>
            <input
              id="identifiantFiscal"
              name="identifiantFiscal"
              type="text"
              value={fiscalInfo.identifiantFiscal}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="anneeVersement" className="block text-sm font-medium text-gray-700">Année de versement</label>
            <input
              id="anneeVersement"
              name="anneeVersement"
              type="number"
              value={fiscalInfo.anneeVersement}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="exerciceFiscalDu" className="block text-sm font-medium text-gray-700">Exercice fiscal du *</label>
            <input
              id="exerciceFiscalDu"
              name="exerciceFiscalDu"
              type="date"
              value={fiscalInfo.exerciceFiscalDu}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="exerciceFiscalAu" className="block text-sm font-medium text-gray-700">Exercice fiscal au *</label>
            <input
              id="exerciceFiscalAu"
              name="exerciceFiscalAu"
              type="date"
              value={fiscalInfo.exerciceFiscalAu}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Génération...' : 'Générer XML'}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">XML généré avec succès !</div>}
    </div>
  );
}
