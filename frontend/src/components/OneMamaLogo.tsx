'use client';

/**
 * OneMamaLogo Component
 * 
 * SVG logo component for One Mama brand
 * Displays the silhouette of a woman and child in a circular frame
 */

import React from 'react';

interface OneMamaLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const OneMamaLogo: React.FC<OneMamaLogoProps> = ({ 
  className = '', 
  width = 32, 
  height = 32 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular background */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Woman silhouette */}
      <path
        d="M25 75 C25 65, 30 55, 35 50 C35 45, 38 40, 42 38 C45 35, 50 35, 55 38 C58 40, 60 45, 60 50 C65 55, 70 65, 70 75 L25 75 Z"
        fill="currentColor"
      />
      
      {/* Woman's head */}
      <circle
        cx="47"
        cy="28"
        r="8"
        fill="currentColor"
      />
      
      {/* Child silhouette */}
      <path
        d="M55 65 C55 60, 58 55, 62 53 C62 50, 64 48, 66 47 C68 45, 70 45, 72 47 C74 48, 75 50, 75 53 C78 55, 80 60, 80 65 L55 65 Z"
        fill="currentColor"
      />
      
      {/* Child's head */}
      <circle
        cx="67"
        cy="40"
        r="5"
        fill="currentColor"
      />
    </svg>
  );
};

export default OneMamaLogo;