import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';
import { Toaster } from './components/ui/Toaster';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}