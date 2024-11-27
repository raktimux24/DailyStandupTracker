import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <Button
              variant="secondary"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};