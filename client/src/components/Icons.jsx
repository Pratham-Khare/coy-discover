// Small inline SVG icons, so we don't need an icon library.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const HomeIcon = () => (
  <svg {...base}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export const CardsIcon = () => (
  <svg {...base}>
    <rect x="6" y="3" width="12" height="16" rx="2" />
    <path d="M3 7v12a2 2 0 0 0 2 2h10" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base} strokeWidth={3}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const HeartIcon = ({ filled = true }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.3-9-8.6C1.6 8.2 3.6 4.5 7 4.5c2 0 3.4 1.1 4.1 2.3L12 8l.9-1.2c.7-1.2 2.1-2.3 4.1-2.3 3.4 0 5.4 3.7 4 6.9-2 4.3-9 8.6-9 8.6z" />
  </svg>
);
