import React from 'react';
import { FileText, Upload, FileDown, ArrowRight } from 'lucide-react';

export function ProcessGuide() {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Guide du processus de déclaration
        </h2>
        <p className="text-gray-600">
          Cette application vous permet de générer facilement des fichiers EDI-TDFC pour vos déclarations fiscales.
          Suivez les étapes ci-dessous pour compléter votre déclaration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Étape 1 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            1. Préparation des données
          </h3>
          <p className="text-gray-600 text-sm">
            Préparez vos données dans un fichier Excel en suivant le modèle fourni.
            Assurez-vous que toutes les informations requises sont présentes.
          </p>
        </div>

        {/* Étape 2 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            2. Import du fichier Excel
          </h3>
          <p className="text-gray-600 text-sm">
            Importez votre fichier Excel dans l'application. Les données seront
            automatiquement validées selon les règles de la DGI.
          </p>
        </div>

        {/* Étape 3 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileDown className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            3. Génération du fichier EDI
          </h3>
          <p className="text-gray-600 text-sm">
            Une fois les données validées, générez le fichier EDI-TDFC au format XML.
            Le fichier sera automatiquement compressé au format ZIP.
          </p>
        </div>
      </div>

      {/* Processus détaillé */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Processus détaillé
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">1</span>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">Préparation du fichier Excel</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Téléchargez le modèle Excel fourni</li>
                  <li>• Remplissez toutes les colonnes requises</li>
                  <li>• Vérifiez la conformité des données</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">2</span>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">Import et validation</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Importez le fichier Excel dans l'application</li>
                  <li>• Vérification automatique des données</li>
                  <li>• Correction des erreurs si nécessaire</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">3</span>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900">Génération EDI</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Saisie des informations complémentaires</li>
                  <li>• Génération du fichier XML</li>
                  <li>• Compression au format ZIP</li>
                  <li>• Téléchargement du fichier final</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-base font-medium text-yellow-800 mb-2">
          Notes importantes
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Assurez-vous que votre identifiant fiscal est correct</li>
          <li>• Les dates doivent être au format JJ/MM/AAAA</li>
          <li>• Utilisez les codes tribunaux et natures d'affaire officiels</li>
          <li>• Conservez une copie de vos fichiers générés</li>
        </ul>
      </div>
    </div>
  );
}