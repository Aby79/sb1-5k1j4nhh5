import React from 'react';

interface NatureAffaire {
  code: string;
  libelle: string;
  description: string;
}

const NATURE_AFFAIRES: NatureAffaire[] = [
  {
    code: 'PENAL',
    libelle: 'Pénale',
    description: 'Affaires relevant du droit pénal et des procédures criminelles'
  },
  {
    code: 'COMMERC',
    libelle: 'Commerciale',
    description: 'Affaires relevant du droit commercial et des litiges entre commerçants'
  },
  {
    code: 'CIVIL',
    libelle: 'Civile',
    description: 'Affaires relevant du droit civil et des litiges entre particuliers'
  },
  {
    code: 'ADM',
    libelle: 'Administrative',
    description: 'Affaires relevant du droit administratif et des litiges avec l\'administration'
  }
];

export function NatureAffaireTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nature
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {NATURE_AFFAIRES.map((nature) => (
            <tr key={nature.code} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                {nature.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {nature.libelle}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                {nature.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}