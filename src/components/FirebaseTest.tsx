import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function FirebaseTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [testCredentials, setTestCredentials] = useState<{ email: string; password: string } | null>(null);

  const testConnection = async () => {
    setStatus('loading');
    setError('');
    setTestCredentials(null);
    
    try {
      // Créer un utilisateur test avec un email unique
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'Test123!';
      
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setTestCredentials({ email: testEmail, password: testPassword });
      setStatus('success');
    } catch (err) {
      console.error('Erreur test Firebase:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test de Connexion Firebase</h2>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Test en cours...
            </span>
          ) : (
            'Tester la connexion'
          )}
        </button>

        {status === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Connexion réussie !</h3>
                <p className="text-sm text-green-700 mt-1">
                  Firebase est correctement configuré. Utilisez ces identifiants pour vous connecter :
                </p>
                {testCredentials && (
                  <div className="mt-3 p-3 bg-white rounded-md border border-green-200">
                    <p className="text-sm font-mono">Email: {testCredentials.email}</p>
                    <p className="text-sm font-mono">Mot de passe: {testCredentials.password}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Erreur de connexion</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}