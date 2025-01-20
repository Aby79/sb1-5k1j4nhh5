import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface DossierCode {
  code: string;
  libelle: string;
}

const DOSSIER_CODES: DossierCode[] = [
  { code: '7101', libelle: 'القضايا االستعجالية' },
  { code: '7102', libelle: 'األوامر المبنية عىل طلب' },
  { code: '7103', libelle: 'المصادقة عىل الحجز' },
  { code: '7104', libelle: 'صعوبة التنفيذ' },
  { code: '7105', libelle: 'إيقاف التنفيذ' },
  { code: '7106', libelle: 'إيقاف التنفيذ' },
  { code: '7107', libelle: 'المصادقة عىل الحجز لدى الغي' },
  { code: '7108', libelle: 'التسوية القضائية' },
  { code: '7109', libelle: 'تحصيل ديون الخزينة' },
  { code: '7110', libelle: 'التصفية القضائية' },
  { code: '7111', libelle: 'المسؤولية التقصيية' },
  { code: '7112', libelle: 'الطلبات األخرى المعروضة عىل القاضي المنتدب' },
  { code: '7113', libelle: 'المنازعات الضريبية' },
  { code: '7114', libelle: 'تذييل بالصيغة التنفيذية' },
  { code: '7115', libelle: 'األوامر باألداء' },
  { code: '7116', libelle: 'القضايا االستعجالية' },
  { code: '7129', libelle: 'جنحي عادي تأديبي' },
  { code: '7130', libelle: 'جنحي عادي ضبظي' },
  { code: '7201', libelle: 'االستعجالي' },
  { code: '7202', libelle: 'االستعجالي (مستأنف)' },
  { code: '7203', libelle: 'جنحي تلبسي اعتقال' },
  { code: '7204', libelle: 'جنحي تلبسي رساح' },
  { code: '7205', libelle: 'جنحي ضبظي اعتقال' },
  { code: '7206', libelle: 'االستعجالي' },
  { code: '7207', libelle: 'جنحي ضبظي رساح' },
  { code: '7208', libelle: 'جنحي عادي استئنافي اعتقال' },
  { code: '7209', libelle: 'تحصيل ديون الخزينة' },
  { code: '7210', libelle: 'جنحي تلبسي استئنافي' },
  { code: '7211', libelle: 'اإلنذار العقاري' },
  { code: '7212', libelle: 'اإلنذار بأداء الكراء' },
  { code: '7213', libelle: 'التنفيذ' },
  { code: '7214', libelle: 'تبليغ إنذار ظ.ه. 64-99' },
  { code: '7215', libelle: 'المصادقة عىل اإلنذار ظ.ه. 64-99' }
];

export function DossierCodesTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCodes = DOSSIER_CODES.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.libelle.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libellé
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCodes.map((item) => (
              <tr key={item.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right" dir="rtl">
                  {item.libelle}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message si aucun résultat */}
      {filteredCodes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucun code ne correspond à votre recherche
        </div>
      )}
    </div>
  );
}