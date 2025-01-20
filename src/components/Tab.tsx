import React from 'react';
import { TabProps } from '../types';
import { clsx } from 'clsx';

export function Tab({ isActive, children, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 font-medium rounded-t-lg transition-colors',
        isActive
          ? 'bg-white text-blue-600 border-t border-x border-gray-200'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      )}
    >
      {children}
    </button>
  );
}