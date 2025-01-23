import { create } from 'xmlbuilder2';
import { format } from 'date-fns';
import JSZip from 'jszip';

export class XMLGenerator {
  constructor() {
    this.maxZipSizeBytes = 10 * 1024 * 1024; // 10MB max size
  }

  generateXML(data) {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('VersementAvocatsRAF', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'VersementAvocatsRAF.xsd'
      });

    root
      .ele('identifiantFiscal').txt(data.identifiantFiscal).up()
      .ele('exerciceFiscalDu').txt(data.exerciceFiscalDu).up()
      .ele('exerciceFiscalAu').txt(data.exerciceFiscalAu).up()
      .ele('anneeVersement').txt(data.anneeVersement.toString()).up();

    const listDetail = root.ele('listDetailAffaireJuridique');

    data.affaires.forEach(affaire => {
      const detail = listDetail.ele('DetailAffaireJuridiqueRAF');
      detail
        .ele('anneeNumDossier').txt(affaire.anneeNumDossier).up()
        .ele('numDossier').txt(affaire.numDossier).up()
        .ele('codeNumDossier').txt(affaire.codeNumDossier).up()
        .ele('dateEnregistrement').txt(affaire.dateEnregistrement).up()
        .ele('dateEncaissement').txt(affaire.dateEncaissement).up()
        .ele('referencePaiement').txt(affaire.referencePaiement).up()
        .ele('refNatureAffaireJuridique')
          .ele('code').txt(affaire.refNatureAffaireJuridique).up()
        .up()
        .ele('refTribunal')
          .ele('code').txt(affaire.refTribunal).up()
        .up();
    });

    return root.end({ prettyPrint: true });
  }

  async createZipFile(xmlContent, fileName) {
    const zip = new JSZip();
    
    // Add XML content to the ZIP
    zip.file(fileName, xmlContent);
    
    // Generate ZIP file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    });
    
    // Check ZIP size
    if (zipBlob.size > this.maxZipSizeBytes) {
      throw new Error(`Le fichier ZIP dépasse la taille maximale autorisée de ${this.maxZipSizeBytes} octets`);
    }
    
    return zipBlob;
  }
}
