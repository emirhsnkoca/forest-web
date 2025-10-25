import { ReactNode } from 'react';

interface BackgroundProps {
  type: 'pixel-green' | 'pixel-earth' | 'pixel-water' | 'pixel-grass' | 'earth-sky' | 'earth-green' | 'forest' | 'plain';
  children?: ReactNode;
  className?: string;
}

export function Background({ type, children, className = '' }: BackgroundProps) {
  const getBackgroundClasses = () => {
    switch (type) {
      case 'pixel-green':
        return 'bg-pixel-green bg-forest-bg';
      case 'pixel-earth':
        return 'bg-pixel-earth bg-[#7D5A3F]';
      case 'pixel-water':
        return 'bg-pixel-water bg-[#3BA0C1]';
      case 'pixel-grass':
        return 'bg-pixel-grass bg-[#6B9F3D]';
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

