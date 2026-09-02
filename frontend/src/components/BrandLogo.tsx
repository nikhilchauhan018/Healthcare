import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: string;
}

export const MedicalPlusMark: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        fill="#E8F1EC"
        stroke="#245543"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.5V16.5M7.5 12H16.5"
        stroke="#245543"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 24,
  showText = true,
  textSize = 'text-2xl',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <MedicalPlusMark size={size} />
      {showText && (
        <div className="flex items-center tracking-tight select-none">
          <span className={`font-serif font-bold text-[#16211E] ${textSize}`}>
            Meridian
          </span>
          <span className={`font-serif font-bold text-[#245543] ${textSize}`}>
            Health
          </span>
        </div>
      )}
    </div>
  );
};
