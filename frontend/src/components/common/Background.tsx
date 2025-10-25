import { ReactNode } from 'react';

interface BackgroundProps {
  type: 'pixel-green' | 'earth-sky' | 'earth-green' | 'forest' | 'plain';
  children: ReactNode;
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
        return 'bg-forest-bg';
      default:
        return 'bg-forest-bg';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} ${className}`}>
      {children}
    </div>
  );
}

