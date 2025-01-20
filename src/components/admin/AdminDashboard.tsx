import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ExcelProcessor } from '../ExcelProcessor';
import { LogOut, FileText, Upload, FileDown } from 'lucide-react';
import { Tab } from '../Tab';
import { ProcessGuide } from './ProcessGuide';
import { XmlGenerator } from '../XmlGenerator';

export function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'process' | 'upload' | 'generate'>('process');
  const [excelData, setExcelData] = useState<any[]>([]);

  const handleFileSelect = (file: File, data: any[]) => {
    setExcelData(data);
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Portail des Avocats
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* Onglets */}
          <div className="border-b border-gray-200 px-6 flex gap-2">
            <Tab
              isActive={activeTab === 'process'}
              onClick={() => setActiveTab('process')}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Processus
              </div>
            </Tab>
            <Tab
              isActive={activeTab === 'upload'}
              onClick={() => setActiveTab('upload')}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Excel
              </div>
            </Tab>
            <Tab
              isActive={activeTab === 'generate'}
              onClick={() => setActiveTab('generate')}
            >
              <div className="flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                Générer XML
              </div>
            </Tab>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'process' && <ProcessGuide />}
            {activeTab === 'upload' && <ExcelProcessor onFileSelect={handleFileSelect} />}
            {activeTab === 'generate' && <XmlGenerator excelData={excelData} />}
          </div>
        </div>
      </main>
    </div>
  );
}