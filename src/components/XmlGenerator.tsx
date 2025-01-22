import React, { useState, useEffect } from 'react';
import { generateEdiXml, VersementData } from '../lib/xml-generator';
import { FileCheck, AlertCircle, Download } from 'lucide-react';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

interface XmlGeneratorProps {}

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
  const isoMatch = date.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return parseInt(date.slice(0, 4));
  const frMatch = date.match(/^\d{2}\/\d{2}\/\d{4}$/);
  if (frMatch) return parseInt(date.split('/')[2]);
  if (/^\d{4}$/.test(date)) return parseInt(date);
  return new Date().getFullYear();
}

export function XmlGenerator() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fiscalInfo, setFiscalInfo] = useState<FiscalInfo>(() => {
    const currentYear = new Date().getFullYear();
    return {
      identifiantFiscal: '41802546',
      exerciceFiscalDu: `${currentYear}-01-01`,
      exerciceFiscalAu: `${currentYear}-12-31`,
      anneeVersement: currentYear,
    };
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'anneeVersement') {
      setFiscalInfo((prev) => ({
        ...prev,
        [name]: parseInt(value) || prev.anneeVersement,
      }));
    } else {
      setFiscalInfo((prev) => ({
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
        affairesJuridiques: excelData.map((row) => ({
          anneeNumDossier: row.anneeNumDossier,
          numDossier: row.numDossier,
          codeNumDossier: row.codeNumDossier,
          dateEnregistrement: row.dateEnregistrement,
          dateEncaissement: row.dateEncaissement,
          referencePaiement: row.referencePaiement,
          refNatureAffaireJuridique: row.refNatureAffaireJuridique,
          refTribunal: row.refTribunal,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Importer un fichier Excel</h3>
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Aperçu des affaires juridiques</h3>
          <span className="text-sm text-gray-500">{excelData.length} affaire(s) juridique(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Année</th>
                <th className="px-4 py-3">N° Dossier</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Date Enreg.</th>
                <th className="px-4 py-3">Date Encais.</th>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Nature</th>
                <th className="px-4 py-3">Tribunal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.map((row, index) => (
                <tr key={index}>
                  <td>{row.anneeNumDossier}</td>
                  <td>{row.numDossier}</td>
                  <td>{row.codeNumDossier}</td>
                  <td>{row.dateEnregistrement}</td>
                  <td>{row.dateEncaissement}</td>
                  <td>{row.referencePaiement}</td>
                  <td>{row.refNatureAffaireJuridique}</td>
                  <td>{row.refTribunal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!excelData.length || loading}>
        Générer EDI
      </button>
    </div>
  );
}
