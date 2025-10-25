import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Modal({ isOpen, onClose, children, title, size = 'medium' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-2xl p-8 w-full mx-4 max-h-[90vh] overflow-y-auto ${
        size === 'small' ? 'max-w-sm' : 
        size === 'large' ? 'max-w-4xl' : 
        'max-w-md'
      }`}>
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}



