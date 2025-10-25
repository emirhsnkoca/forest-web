import { ReactNode } from 'react';

interface BackgroundProps {
  type: 'pixel-green' | 'earth-sky' | 'earth-green' | 'forest' | 'plain';
  children?: ReactNode;
  className?: string;
}

export function Background({ type, children, className = '' }: BackgroundProps) {
  const getBackgroundClasses = () => {
    switch (type) {
      case 'pixel-green':
        return 'bg-pixel-green bg-forest-bg';
      case 'earth-sky':
        return 'bg-gradient-earth-sky';
      case 'earth-green':
        return 'bg-gradient-earth-green';
      case 'forest':
        return 'bg-gradient-forest';
      case 'plain':
        return 'bg-white';
      default:
        return 'bg-forest-bg';
    }
  };

  // Eğer children varsa wrapper, yoksa sadece background layer
  if (children) {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundClasses()} ${className}`} />
  );
}

