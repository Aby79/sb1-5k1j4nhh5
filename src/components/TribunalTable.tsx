import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Tribunal {
  code: string;
  nom: string;
  type: 'administratif' | 'commercial' | 'appel' | 'premiere_instance' | 'cassation';
}

const TRIBUNAUX: Tribunal[] = [
  // Tribunaux administratifs
  { code: 'TR_ADM_APPL_1', nom: 'Tribunal d\'appel administratif de Rabat', type: 'administratif' },
  { code: 'TR_ADM_APPL_2', nom: 'Tribunal d\'appel administratif de Marrakech', type: 'administratif' },
  { code: 'TR_ADM_PIN_1', nom: 'Tribunal administratif de Rabat', type: 'administratif' },
  { code: 'TR_ADM_PIN_2', nom: 'Tribunal administratif de Casablanca', type: 'administratif' },
  { code: 'TR_ADM_PIN_3', nom: 'Tribunal administratif de Fes', type: 'administratif' },
  { code: 'TR_ADM_PIN_4', nom: 'Tribunal administratif de Meknes', type: 'administratif' },
  { code: 'TR_ADM_PIN_5', nom: 'Tribunal administratif de Oujda', type: 'administratif' },
  { code: 'TR_ADM_PIN_6', nom: 'Tribunal administratif de Marrakech', type: 'administratif' },
  { code: 'TR_ADM_PIN_7', nom: 'Tribunal administratif de Agadir', type: 'administratif' },

  // Tribunaux commerciaux
  { code: 'TR_COM_APPL_1', nom: 'Tribunal d\'appel commercial de Casablanca', type: 'commercial' },
  { code: 'TR_COM_APPL_2', nom: 'Tribunal d\'appel commercial de Marrakech', type: 'commercial' },
  { code: 'TR_COM_APPL_3', nom: 'Tribunal d\'appel commercial de Fes', type: 'commercial' },
  { code: 'TR_COM_PIN_1', nom: 'Tribunal commercial de Rabat', type: 'commercial' },
  { code: 'TR_COM_PIN_2', nom: 'Tribunal commercial de Casablanca', type: 'commercial' },
  { code: 'TR_COM_PIN_3', nom: 'Tribunal commercial de Agadir', type: 'commercial' },
  { code: 'TR_COM_PIN_4', nom: 'Tribunal commercial de Marrakech', type: 'commercial' },
  { code: 'TR_COM_PIN_5', nom: 'Tribunal commercial de Fes', type: 'commercial' },
  { code: 'TR_COM_PIN_6', nom: 'Tribunal commercial de Meknes', type: 'commercial' },
  { code: 'TR_COM_PIN_7', nom: 'Tribunal commercial de Oujda', type: 'commercial' },
  { code: 'TR_COM_PIN_8', nom: 'Tribunal commercial de Tanger', type: 'commercial' },

  // Cours d'appel
  { code: 'TR_APPL_1', nom: 'Tribunal d\'appel de Rabat', type: 'appel' },
  { code: 'TR_APPL_2', nom: 'Tribunal d\'appel de Laayoune', type: 'appel' },
  { code: 'TR_APPL_3', nom: 'Tribunal d\'appel de Agadir', type: 'appel' },
  { code: 'TR_APPL_4', nom: 'Tribunal d\'appel de Ouarzazate', type: 'appel' },
  { code: 'TR_APPL_5', nom: 'Tribunal d\'appel de Kenitra', type: 'appel' },
  { code: 'TR_APPL_6', nom: 'Tribunal d\'appel de Settat', type: 'appel' },
  { code: 'TR_APPL_7', nom: 'Tribunal d\'appel de Khouribga', type: 'appel' },
  { code: 'TR_APPL_8', nom: 'Tribunal d\'appel de Casablanca', type: 'appel' },
  { code: 'TR_APPL_9', nom: 'Tribunal d\'appel de Marrakech', type: 'appel' },
  { code: 'TR_APPL_10', nom: 'Tribunal d\'appel de Safi', type: 'appel' },
  { code: 'TR_APPL_11', nom: 'Tribunal d\'appel de Tanger', type: 'appel' },
  { code: 'TR_APPL_12', nom: 'Tribunal d\'appel de Tetouan', type: 'appel' },
  { code: 'TR_APPL_13', nom: 'Tribunal d\'appel de Al Hoceima', type: 'appel' },
  { code: 'TR_APPL_14', nom: 'Tribunal d\'appel de Taza', type: 'appel' },
  { code: 'TR_APPL_15', nom: 'Tribunal d\'appel de Oujda', type: 'appel' },
  { code: 'TR_APPL_16', nom: 'Tribunal d\'appel de Meknes', type: 'appel' },
  { code: 'TR_APPL_17', nom: 'Tribunal d\'appel de El Jadida', type: 'appel' },
  { code: 'TR_APPL_18', nom: 'Tribunal d\'appel de Beni Mellal', type: 'appel' },
  { code: 'TR_APPL_19', nom: 'Tribunal d\'appel de Errachidia', type: 'appel' },
  { code: 'TR_APPL_20', nom: 'Tribunal d\'appel de Nador', type: 'appel' },
  { code: 'TR_APPL_21', nom: 'Tribunal d\'appel de Fes', type: 'appel' },
  { code: 'TR_APPL_22', nom: 'Tribunal d\'appel de Guelmim', type: 'appel' },

  // Tribunaux de première instance
  { code: 'TR_PIN_1', nom: 'Tribunal de 1ère instance de Rabat', type: 'premiere_instance' },
  { code: 'TR_PIN_2', nom: 'Tribunal de 1ère instance de Salé', type: 'premiere_instance' },
  { code: 'TR_PIN_3', nom: 'Tribunal de 1ère instance de Temara', type: 'premiere_instance' },
  { code: 'TR_PIN_4', nom: 'Tribunal de 1ère instance de Khemisset', type: 'premiere_instance' },
  { code: 'TR_PIN_5', nom: 'Tribunal de 1ère instance de Rommani', type: 'premiere_instance' },
  { code: 'TR_PIN_6', nom: 'Tribunal de 1ère instance de Tiflet', type: 'premiere_instance' },
  { code: 'TR_PIN_7', nom: 'Tribunal de 1ère instance de Oued Eddahab', type: 'premiere_instance' },
  { code: 'TR_PIN_8', nom: 'Tribunal de 1ère instance de Laayoune', type: 'premiere_instance' },
  { code: 'TR_PIN_9', nom: 'Tribunal de 1ère instance de Essmara', type: 'premiere_instance' },
  { code: 'TR_PIN_10', nom: 'Tribunal de 1ère instance de Tata', type: 'premiere_instance' },
  { code: 'TR_PIN_11', nom: 'Tribunal de 1ère instance de Inezgane', type: 'premiere_instance' },
  { code: 'TR_PIN_12', nom: 'Tribunal de 1ère instance de Taroudant', type: 'premiere_instance' },
  { code: 'TR_PIN_13', nom: 'Tribunal de 1ère instance de Tiznit', type: 'premiere_instance' },
  { code: 'TR_PIN_14', nom: 'Tribunal de 1ère instance de Agadir', type: 'premiere_instance' },
  { code: 'TR_PIN_15', nom: 'Tribunal de 1ère instance de Ouarzazate', type: 'premiere_instance' },
  { code: 'TR_PIN_16', nom: 'Tribunal de 1ère instance de Zagora', type: 'premiere_instance' },
  { code: 'TR_PIN_17', nom: 'Tribunal de 1ère instance de Tinghir', type: 'premiere_instance' },
  { code: 'TR_PIN_18', nom: 'Tribunal de 1ère instance de Kenitra', type: 'premiere_instance' },
  { code: 'TR_PIN_19', nom: 'Tribunal de 1ère instance de Sidi Slimane', type: 'premiere_instance' },
  { code: 'TR_PIN_20', nom: 'Tribunal de 1ère instance de Souk El Arbaa', type: 'premiere_instance' },
  { code: 'TR_PIN_21', nom: 'Tribunal de 1ère instance de Sidi Kacem', type: 'premiere_instance' },
  { code: 'TR_PIN_22', nom: 'Tribunal de 1ère instance de Mechra Bel Ksiri', type: 'premiere_instance' },
  { code: 'TR_PIN_23', nom: 'Tribunal de 1ère instance de Settat', type: 'premiere_instance' },
  { code: 'TR_PIN_24', nom: 'Tribunal de 1ère instance de Berchid', type: 'premiere_instance' },
  { code: 'TR_PIN_25', nom: 'Tribunal de 1ère instance de Ben Ahmed', type: 'premiere_instance' },
  { code: 'TR_PIN_26', nom: 'Tribunal de 1ère instance de Khouribga', type: 'premiere_instance' },
  { code: 'TR_PIN_27', nom: 'Tribunal de 1ère instance de Oued Zem', type: 'premiere_instance' },
  { code: 'TR_PIN_28', nom: 'Tribunal de 1ère instance de Bejaad', type: 'premiere_instance' },
  { code: 'TR_PIN_29', nom: 'Tribunal civile de Benslimane', type: 'premiere_instance' },
  { code: 'TR_PIN_30', nom: 'Tribunal de 1ère instance civile de Casablanca', type: 'premiere_instance' },
  { code: 'TR_PIN_31', nom: 'Tribunal de 1ère instance de Bouznika', type: 'premiere_instance' },
  { code: 'TR_PIN_32', nom: 'Tribunal civile de Mohamedia', type: 'premiere_instance' },
  { code: 'TR_PIN_33', nom: 'Tribunal de 1ère instance de Imintanout', type: 'premiere_instance' },
  { code: 'TR_PIN_34', nom: 'Tribunal de 1ère instance de Marrakech', type: 'premiere_instance' },
  { code: 'TR_PIN_36', nom: 'Tribunal de 1ère instance de El Kelaa des Sraghna', type: 'premiere_instance' },
  { code: 'TR_PIN_37', nom: 'Tribunal de 1ère instance de Ben Guerir', type: 'premiere_instance' },
  { code: 'TR_PIN_38', nom: 'Tribunal de 1ère instance de Tahanaout', type: 'premiere_instance' },
  { code: 'TR_PIN_39', nom: 'Tribunal de 1ère instance de Essaouira', type: 'premiere_instance' },
  { code: 'TR_PIN_40', nom: 'Tribunal de 1ère instance de Safi', type: 'premiere_instance' },
  { code: 'TR_PIN_41', nom: 'Tribunal de 1ère instance de Youssoufia', type: 'premiere_instance' },
  { code: 'TR_PIN_42', nom: 'Tribunal de 1ère instance de Tanger', type: 'premiere_instance' },
  { code: 'TR_PIN_43', nom: 'Tribunal de 1ère instance de Asilah', type: 'premiere_instance' },
  { code: 'TR_PIN_44', nom: 'Tribunal de 1ère instance de Larache', type: 'premiere_instance' },
  { code: 'TR_PIN_45', nom: 'Tribunal de 1ère instance de Ksar El Kebir', type: 'premiere_instance' },
  { code: 'TR_PIN_46', nom: 'Tribunal de 1ère instance de Ouazzane', type: 'premiere_instance' },
  { code: 'TR_PIN_47', nom: 'Tribunal de 1ère instance de Tetouan', type: 'premiere_instance' },
  { code: 'TR_PIN_48', nom: 'Tribunal de 1ère instance de Chefchaouen', type: 'premiere_instance' },
  { code: 'TR_PIN_49', nom: 'Tribunal de 1ère instance de Mdiq', type: 'premiere_instance' },
  { code: 'TR_PIN_50', nom: 'Tribunal de 1ère instance de Al Hoceima', type: 'premiere_instance' },
  { code: 'TR_PIN_51', nom: 'Tribunal de 1ère instance de Targuist', type: 'premiere_instance' },
  { code: 'TR_PIN_52', nom: 'Tribunal de 1ère instance de Taza', type: 'premiere_instance' },
  { code: 'TR_PIN_53', nom: 'Tribunal de 1ère instance de Oujda', type: 'premiere_instance' },
  { code: 'TR_PIN_54', nom: 'Tribunal de 1ère instance de Berkane', type: 'premiere_instance' },
  { code: 'TR_PIN_55', nom: 'Tribunal de 1ère instance de Guercif', type: 'premiere_instance' },
  { code: 'TR_PIN_56', nom: 'Tribunal de 1ère instance de Taourirt', type: 'premiere_instance' },
  { code: 'TR_PIN_57', nom: 'Tribunal de 1ère instance de Jrada', type: 'premiere_instance' },
  { code: 'TR_PIN_58', nom: 'Tribunal de 1ère instance de Figuig Bouarfa', type: 'premiere_instance' },
  { code: 'TR_PIN_59', nom: 'Tribunal de 1ère instance de Meknes', type: 'premiere_instance' },
  { code: 'TR_PIN_60', nom: 'Tribunal de 1ère instance de Hajeb', type: 'premiere_instance' },
  { code: 'TR_PIN_61', nom: 'Tribunal de 1ère instance de Azrou', type: 'premiere_instance' },
  { code: 'TR_PIN_62', nom: 'Tribunal de 1ère instance de El Jadida', type: 'premiere_instance' },
  { code: 'TR_PIN_63', nom: 'Tribunal de 1ère instance de Sidi Bennour', type: 'premiere_instance' },
  { code: 'TR_PIN_64', nom: 'Tribunal de 1ère instance de Beni Mellal', type: 'premiere_instance' },
  { code: 'TR_PIN_65', nom: 'Tribunal de 1ère instance de Azilal', type: 'premiere_instance' },
  { code: 'TR_PIN_66', nom: 'Tribunal de 1ère instance de Fquih ben salah', type: 'premiere_instance' },
  { code: 'TR_PIN_67', nom: 'Tribunal de 1ère instance de Khenifra', type: 'premiere_instance' },
  { code: 'TR_PIN_68', nom: 'Tribunal de 1ère instance de Kasba Tadla', type: 'premiere_instance' },
  { code: 'TR_PIN_69', nom: 'Tribunal de 1ère instance de Souk Sebt Oulad Nemma', type: 'premiere_instance' },
  { code: 'TR_PIN_70', nom: 'Tribunal de 1ère instance de Errachidia', type: 'premiere_instance' },
  { code: 'TR_PIN_71', nom: 'Tribunal de 1ère instance de Midelt', type: 'premiere_instance' },
  { code: 'TR_PIN_72', nom: 'Tribunal de 1ère instance de Nador', type: 'premiere_instance' },
  { code: 'TR_PIN_73', nom: 'Tribunal de 1ère instance de Driouch', type: 'premiere_instance' },
  { code: 'TR_PIN_74', nom: 'Tribunal de 1ère instance de Fes', type: 'premiere_instance' },
  { code: 'TR_PIN_75', nom: 'Tribunal de 1ère instance de Boulemane', type: 'premiere_instance' },
  { code: 'TR_PIN_76', nom: 'Tribunal de 1ère instance de Sefrou', type: 'premiere_instance' },
  { code: 'TR_PIN_77', nom: 'Tribunal de 1ère instance de Taouante', type: 'premiere_instance' },
  { code: 'TR_PIN_78', nom: 'Tribunal de 1ère instance de Guelmim', type: 'premiere_instance' },
  { code: 'TR_PIN_79', nom: 'Tribunal de 1ère instance de Assa Zag', type: 'premiere_instance' },
  { code: 'TR_PIN_80', nom: 'Tribunal de 1ère instance de Tantan', type: 'premiere_instance' },
  { code: 'TR_PIN_83', nom: 'Tribunal de 1ère instance de Sidi Ifni', type: 'premiere_instance' },

  // Cour de cassation
  { code: 'TR_CASS_1', nom: 'Cour de cassation de Rabat', type: 'cassation' }
];

export function TribunalTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Tribunal['type'] | 'tous'>('tous');

  const filteredTribunaux = TRIBUNAUX.filter(tribunal => {
    const matchesSearch = tribunal.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tribunal.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'tous' || tribunal.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un tribunal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filtre par type */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as Tribunal['type'] | 'tous')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="tous">Tous les types</option>
          <option value="administratif">Tribunaux administratifs</option>
          <option value="commercial">Tribunaux commerciaux</option>
          <option value="appel">Cours d'appel</option>
          <option value="premiere_instance">Tribunaux de 1ère instance</option>
          <option value="cassation">Cour de cassation</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du tribunal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTribunaux.map((tribunal) => (
              <tr key={tribunal.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                  {tribunal.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {tribunal.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {tribunal.type === 'administratif' && 'Tribunal administratif'}
                  {tribunal.type === 'commercial' && 'Tribunal commercial'}
                  {tribunal.type === 'appel' && 'Cour d\'appel'}
                  {tribunal.type === 'premiere_instance' && 'Tribunal de 1ère instance'}
                  {tribunal.type === 'cassation' && 'Cour de cassation'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message si aucun résultat */}
      {filteredTribunaux.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucun tribunal ne correspond à votre recherche
        </div>
      )}
    </div>
  );
}