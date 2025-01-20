import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToasterProps {
  toasts?: Toast[];
}

export function Toaster({ toasts = [] }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
            }
            p-4 rounded-lg shadow-lg border flex items-start gap-3 max-w-md animate-slide-in
          `}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5" />}
          {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}