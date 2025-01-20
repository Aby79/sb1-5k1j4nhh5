import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthRequiredProps {
  children: React.ReactNode;
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('it@fekhar-lawfirm.com');
  const [password, setPassword] = useState('fekhar');
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Veuillez configurer Supabase en cliquant sur le bouton "Connect to Supabase" en haut à droite.');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!supabase || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Présentation de l'application */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              EDI Converter
            </h1>
            <p className="text-lg text-gray-600">
              Simplifiez la conversion de vos fichiers Excel au format EDI-TDFC pour vos déclarations fiscales.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Import Excel</h3>
                  <p className="text-gray-600">Importez vos fichiers Excel en quelques clics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Validation automatique</h3>
                  <p className="text-gray-600">Vérification instantanée de la conformité des données</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Génération EDI</h3>
                  <p className="text-gray-600">Conversion automatique au format EDI-TDFC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <p className="mt-2 text-sm text-gray-600">
                Connectez-vous pour accéder à l'application
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            {!supabase ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  Veuillez configurer Supabase en cliquant sur le bouton "Connect to Supabase" en haut à droite.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleAuth}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? 'Chargement...' : 'Se connecter'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}