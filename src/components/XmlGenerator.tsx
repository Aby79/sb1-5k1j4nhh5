import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface RowData {
  anneeNumDossier: string;
  numDossier: string;
  codeNumDossier: string;
  dateEnregistrement: string;
  dateEncaissement: string;
  referencePaiement: string;
  refNatureAffaireJuridique: string;
  refTribunal: string;
}

const ExcelToXMLConverter: React.FC = () => {
  const [excelData, setExcelData] = useState<RowData[]>([]);

  // Fonction pour reformater les dates
  const formatDate = (input: any): string => {
    if (!input) return "";
    const date = new Date(input);
    if (isNaN(date.getTime())) return ""; // Si la date est invalide
    return date.toISOString().split("T")[0];
  };

  // Gestion de l'importation du fichier Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Reformater les dates dans les données
        const formattedData = jsonData.map((row: any) => ({
          anneeNumDossier: row["Année"] || "",
          numDossier: row["N° Dossier"] || "",
          codeNumDossier: row["Code"] || "",
          dateEnregistrement: formatDate(row["Date Enreg."]),
          dateEncaissement: formatDate(row["Date Encais."]),
          referencePaiement: row["Référence"] || "",
          refNatureAffaireJuridique: row["Nature"] || "",
          refTribunal: row["Tribunal"] || "",
        }));

        setExcelData(formattedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Génération du fichier XML
  const generateXML = () => {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Affaires>\n';
    excelData.forEach((row) => {
      xmlContent += `  <Affaire>\n`;
      xmlContent += `    <Annee>${row.anneeNumDossier}</Annee>\n`;
      xmlContent += `    <NumDossier>${row.numDossier}</NumDossier>\n`;
      xmlContent += `    <Code>${row.codeNumDossier}</Code>\n`;
      xmlContent += `    <DateEnregistrement>${row.dateEnregistrement}</DateEnregistrement>\n`;
      xmlContent += `    <DateEncaissement>${row.dateEncaissement}</DateEncaissement>\n`;
      xmlContent += `    <Reference>${row.referencePaiement}</Reference>\n`;
      xmlContent += `    <Nature>${row.refNatureAffaireJuridique}</Nature>\n`;
      xmlContent += `    <Tribunal>${row.refTribunal}</Tribunal>\n`;
      xmlContent += `  </Affaire>\n`;
    });
    xmlContent += `</Affaires>`;

    // Enregistrer le fichier XML
    const blob = new Blob([xmlContent], { type: "application/xml" });
    saveAs(blob, "AffairesJuridiques.xml");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Importer et Générer un XML</h1>

      {/* Importation du fichier Excel */}
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border p-2"
        />
      </div>

      {/* Tableau des données */}
      {excelData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Aperçu des Données</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Année</th>
                <th className="border border-gray-300 px-4 py-2">N° Dossier</th>
                <th className="border border-gray-300 px-4 py-2">Code</th>
                <th className="border border-gray-300 px-4 py-2">Date Enreg.</th>
                <th className="border border-gray-300 px-4 py-2">Date Encais.</th>
                <th className="border border-gray-300 px-4 py-2">Référence</th>
                <th className="border border-gray-300 px-4 py-2">Nature</th>
                <th className="border border-gray-300 px-4 py-2">Tribunal</th>
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.anneeNumDossier}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.numDossier}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.codeNumDossier}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.dateEnregistrement}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.dateEncaissement}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.referencePaiement}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.refNatureAffaireJuridique}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.refTribunal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bouton pour générer le fichier XML */}
      <div className="mt-4">
        <button
          onClick={generateXML}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Générer XML
        </button>
      </div>
    </div>
  );
};

export default ExcelToXMLConverter;
