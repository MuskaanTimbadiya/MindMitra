import React from 'react';

export default function Logo({ size = 32, animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 0 8px var(--secondary-glow))',
        animation: animated ? 'floating-logo 5s ease-in-out infinite' : 'none'
      }}
    >
      {/* Outer breathing ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="var(--secondary)"
        strokeWidth="2"
        strokeDasharray="4 8"
        style={{
          transformOrigin: 'center',
          animation: animated ? 'slow-spin 20s linear infinite' : 'none'
        }}
      />
      {/* Inner glowing lotus/mind petals */}
      <path
        d="M50 20 C42 35, 30 45, 30 55 C30 68, 50 80, 50 80 C50 80, 70 68, 70 55 C70 45, 58 35, 50 20 Z"
        fill="url(#lotus-grad)"
        opacity="0.8"
      />
      <path
        d="M50 35 C45 45, 38 52, 38 60 C38 68, 50 75, 50 75 C50 75, 62 68, 62 60 C62 52, 55 45, 50 35 Z"
        fill="url(#inner-grad)"
        opacity="0.9"
      />
      <circle cx="50" cy="50" r="6" fill="#fff" style={{ filter: 'drop-shadow(0 0 4px #fff)' }} />

      <defs>
        <linearGradient id="lotus-grad" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient id="inner-grad" x1="50" y1="35" x2="50" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
