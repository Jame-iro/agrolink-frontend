import React from 'react';

const Logo = ({ 
  variant = 'horizontal', // 'plain' | 'horizontal' | 'vertical'
  size = 'medium', // 'small' | 'medium' | 'large'
  className = '' 
}) => {
  const getLogoSource = () => {
    switch (variant) {
      case 'plain':
        return '/assets/lg-agrolink1.png';
      case 'horizontal':
        return '/assets/lg-agrolink2.png';
      case 'vertical':
        return '/assets/lg-agrolink3.png';
      default:
        return '/assets/lg-agrolink2.png';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-8';
      case 'medium':
        return 'h-12';
      case 'large':
        return 'h-16';
      default:
        return 'h-12';
    }
  };

  return (
    <img 
      src={getLogoSource()} 
      alt="AgriLink" 
      className={`${getSizeClasses()} ${className} object-contain`}
    />
  );
};

export default Logo;