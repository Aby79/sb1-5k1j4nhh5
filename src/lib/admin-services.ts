import { adminDb, adminAuth, adminStorage } from './firebase-admin';
import { FileRecord, FileValidationError } from '../types';

export class AdminServices {
  // Gestion des utilisateurs
  static async createUser(email: string, password: string) {
    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: true // Pour votre cas d'usage professionnel
      });
      
      // Créer un document utilisateur dans Firestore
      await adminDb.collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        createdAt: new Date(),
        role: 'user'
      });

      return userRecord;
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      throw error;
    }
  }

  // Gestion des fichiers
  static async createFileRecord(userId: string, fileName: string): Promise<FileRecord> {
    try {
      const fileRef = adminDb.collection('files').doc();
      const fileRecord: FileRecord = {
        id: fileRef.id,
        userId,
        originalFileName: fileName,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await fileRef.set(fileRecord);
      return fileRecord;
    } catch (error) {
      console.error('Erreur création fichier:', error);
      throw error;
    }
  }

  static async updateFileStatus(
    fileId: string,
    status: 'processing' | 'completed' | 'error',
    errorDetails?: FileValidationError[]
  ) {
    try {
      const updateData: Partial<FileRecord> = {
        status,
        updatedAt: new Date()
      };

      if (errorDetails) {
        updateData.errorDetails = errorDetails;
      }

      await adminDb.collection('files').doc(fileId).update(updateData);
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw error;
    }
  }

  static async getFileRecords(userId: string): Promise<FileRecord[]> {
    try {
      const snapshot = await adminDb
        .collection('files')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as FileRecord[];
    } catch (error) {
      console.error('Erreur récupération fichiers:', error);
      throw error;
    }
  }

  // Gestion du stockage
  static async getFileDownloadUrl(userId: string, fileName: string): Promise<string> {
    try {
      const filePath = `uploads/${userId}/${fileName}`;
      const [url] = await adminStorage
        .bucket()
        .file(filePath)
        .getSignedUrl({
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000 // URL valide 15 minutes
        });
      
      return url;
    } catch (error) {
      console.error('Erreur génération URL:', error);
      throw error;
    }
  }

  // Validation et traitement des fichiers
  static async processFile(fileId: string, userId: string) {
    try {
      // Mettre à jour le statut en "processing"
      await this.updateFileStatus(fileId, 'processing');

      const fileDoc = await adminDb.collection('files').doc(fileId).get();
      const fileData = fileDoc.data() as FileRecord;

      // Récupérer l'URL du fichier
      const fileUrl = await this.getFileDownloadUrl(userId, fileData.originalFileName);

      // TODO: Implémenter la logique de traitement du fichier Excel
      // 1. Télécharger le fichier depuis l'URL
      // 2. Valider le contenu
      // 3. Générer le XML
      // 4. Sauvegarder le résultat

      // Pour l'exemple, on simule un succès
      await this.updateFileStatus(fileId, 'completed');

    } catch (error) {
      console.error('Erreur traitement fichier:', error);
      await this.updateFileStatus(fileId, 'error', [{
        message: 'Erreur lors du traitement du fichier'
      }]);
      throw error;
    }
  }
}