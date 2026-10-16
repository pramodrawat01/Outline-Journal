const pad = (n) => String(n).padStart(2, '0');
const diff = (a, b) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());

export const addDays = (str, n) => {
  const d = new Date(`${str}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};

export const totalDays = (c) => diff(c.startDate, c.endDate) + 1;

export const dayNumber = (c) =>
  Math.min(totalDays(c), Math.max(0, diff(c.startDate, todayStr()) + 1));

export const getStatus = (c) => {
  const t = todayStr();
  if (t < c.startDate) return 'upcoming';
  if (t > c.endDate) return 'completed';
  return 'ongoing';
};

export const fmtDate = (str) =>
  new Date(`${str}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// ---- diary-style covers ----
// solid cloth colour + page pattern, bound spine on the left, stitched edge, faint grain
export const COVERS = {
  emerald: { base: '#0f3f35', accent: 'rgba(110,231,183,0.16)', pattern: 'ruled' },
  ocean: { base: '#12385a', accent: 'rgba(147,197,253,0.16)', pattern: 'dots' },
  sunset: { base: '#6a3524', accent: 'rgba(253,186,116,0.15)', pattern: 'grid' },
  violet: { base: '#3b2c68', accent: 'rgba(196,181,253,0.16)', pattern: 'diagonal' },
  slate: { base: '#2c3441', accent: 'rgba(203,213,225,0.14)', pattern: 'plain' },
};

const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const flat = (color) => `linear-gradient(${color}, ${color})`;

const patternLayers = (kind, c) => {
  switch (kind) {
    case 'ruled':
      return [{ image: `repeating-linear-gradient(180deg, transparent 0 23px, ${c} 23px 24px)` }];
    case 'dots':
      return [{ image: `radial-gradient(${c} 1.2px, transparent 1.6px)`, size: '18px 18px' }];
    case 'grid':
      return [
        { image: `linear-gradient(${c} 1px, transparent 1px)`, size: '22px 22px' },
        { image: `linear-gradient(90deg, ${c} 1px, transparent 1px)`, size: '22px 22px' },
      ];
    case 'diagonal':
      return [{ image: `repeating-linear-gradient(135deg, transparent 0 10px, ${c} 10px 11px)` }];
    default:
      return [];
  }
};

export const diaryCoverStyle = (key) => {
  const def = COVERS[key] || COVERS.emerald;

  // first layer is on top
  const layers = [
    {
      image: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.38) 0 6px, transparent 6px 11px)',
      size: '2px 100%',
      position: '15px 0',
      repeat: 'no-repeat',
    }, // stitching
    { image: flat('rgba(255,255,255,0.14)'), size: '1px 100%', position: '10px 0', repeat: 'no-repeat' }, // spine edge
    { image: flat('rgba(0,0,0,0.3)'), size: '10px 100%', position: '0 0', repeat: 'no-repeat' }, // spine
    ...patternLayers(def.pattern, def.accent),
    { image: GRAIN, size: '140px 140px', position: '0 0', repeat: 'repeat' },
  ];

  return {
    backgroundColor: def.base,
    backgroundImage: layers.map((l) => l.image).join(', '),
    backgroundSize: layers.map((l) => l.size || 'auto').join(', '),
    backgroundPosition: layers.map((l) => l.position || '0 0').join(', '),
    backgroundRepeat: layers.map((l) => l.repeat || 'repeat').join(', '),
  };
};

// flat colour for the small round pickers (the full cover is too busy at that size)
export const swatchStyle = (key) => ({ backgroundColor: (COVERS[key] || COVERS.emerald).base });


export const fmtShort = (str) => {
  const [, m, d] = str.split('-');
  return `${d}.${m}`;
};

export const dayOf = (c, str) => diff(c.startDate, str) + 1;


// challenges: one simple gradient in the app's green theme
export const coverStyle = () => ({
  backgroundImage:
    'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(6,78,59,0.22) 45%, #141414 100%)',
});