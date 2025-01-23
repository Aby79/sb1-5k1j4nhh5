import React, { useState } from 'react';
import JSZip from 'jszip';
import { create } from 'xmlbuilder2';

export function XmlGenerator({ excelData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!Array.isArray(excelData) || excelData.length === 0) {
        throw new Error('Aucune donnée disponible pour générer le fichier XML.');
      }

      // Préparer les données XML
      const root = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('VersementAvocatsRAF', {
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:noNamespaceSchemaLocation': 'VersementAvocatsRAF.xsd'
        });

      const fiscalInfo = {
        identifiantFiscal: '123456789', // Remplacez par la vraie valeur si nécessaire
        exerciceFiscalDu: '2024-01-01',
        exerciceFiscalAu: '2024-12-31',
        anneeVersement: 2024,
      };

      root
        .ele('identifiantFiscal').txt(fiscalInfo.identifiantFiscal).up()
        .ele('exerciceFiscalDu').txt(fiscalInfo.exerciceFiscalDu).up()
        .ele('exerciceFiscalAu').txt(fiscalInfo.exerciceFiscalAu).up()
        .ele('anneeVersement').txt(fiscalInfo.anneeVersement.toString()).up();

      const listDetail = root.ele('listDetailAffaireJuridique');

      excelData.forEach(row => {
        const detail = listDetail.ele('DetailAffaireJuridiqueRAF');
        detail
          .ele('anneeNumDossier').txt(row.anneeNumDossier).up()
          .ele('numDossier').txt(row.numDossier).up()
          .ele('codeNumDossier').txt(row.codeNumDossier).up()
          .ele('dateEnregistrement').txt(row.dateEnregistrement).up()
          .ele('dateEncaissement').txt(row.dateEncaissement).up()
          .ele('referencePaiement').txt(row.referencePaiement).up()
          .ele('refNatureAffaireJuridique')
            .ele('code').txt(row.refNatureAffaireJuridique).up()
          .up()
          .ele('refTribunal')
            .ele('code').txt(row.refTribunal).up()
          .up();
      });

      const xmlContent = root.end({ prettyPrint: true });

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-600">Erreur: {error}</div>}
      {success && <div className="text-green-600">Fichier XML généré avec succès.</div>}
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
