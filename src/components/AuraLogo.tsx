'use client';

import React from 'react';

export const AuraLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-8 h-8",
  size = 32
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Elegant Aesthetic Clinic Female Silhouette Line Art in Champagne Gold */}
      <path
        d="M50 8 C30 8 22 28 22 46 C22 66 32 82 46 92 C54 90 62 82 66 74 C72 62 76 46 72 32 C68 20 60 14 50 8 Z"
        stroke="#C5A880"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 24 C44 32 46 42 52 48 C56 52 64 56 66 64 C68 70 64 78 58 84"
        stroke="#B48A54"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38 40 C42 42 46 42 50 40"
        stroke="#C5A880"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M44 54 C46 56 50 56 52 54"
        stroke="#C5A880"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
