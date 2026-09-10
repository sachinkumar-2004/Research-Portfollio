import React from 'react';

export function LinkedinIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function ResearchGateIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528H0V0h19.54zM8.508 17.52h2.244v-5.268h1.836l2.124 5.268h2.46l-2.424-5.832c1.308-.492 2.16-1.692 2.16-3.156 0-2.076-1.572-3.444-3.864-3.444H8.508v12.432zm2.244-7.236v-3.24h2.208c1.176 0 1.956.66 1.956 1.62 0 .972-.78 1.62-1.956 1.62h-2.208z" />
    </svg>
  );
}

export default {
  LinkedinIcon,
  ResearchGateIcon,
};
