import React from 'react';

function Logo({ size = 34, withText = true, className = '' }) {
  return (
    <span className={`ur-logo ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ur-logo-icon"
      >
        {/* Sneaker sole */}
        <path
          d="M18 66 C18 80 33 90 50 90 C67 90 82 80 82 66 L77 66 C73 76 62 82 50 82 C38 82 27 76 23 66 Z"
          fill="currentColor"
        />
        {/* Stem rising from the sole */}
        <rect x="46" y="30" width="8" height="38" rx="4" fill="currentColor" />
        {/* Left leaf */}
        <path
          d="M50 38 C38 36 28 26 26 14 C40 14 50 24 50 38 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Right leaf */}
        <path
          d="M50 38 C62 36 72 26 74 14 C60 14 50 24 50 38 Z"
          fill="currentColor"
        />
      </svg>
      {withText && (
        <span className="ur-logo-text">
          <span className="ur-logo-urban">Urban</span>
          <span className="ur-logo-roots">Roots</span>
        </span>
      )}
    </span>
  );
}

export default Logo;
