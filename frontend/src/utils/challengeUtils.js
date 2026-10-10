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

export const COVERS = {
  emerald: ['#10b981', '#064e3b'],
  ocean: ['#38bdf8', '#1e3a8a'],
  sunset: ['#fb923c', '#881337'],
  violet: ['#a78bfa', '#4c1d95'],
  slate: ['#94a3b8', '#1e293b'],
};

export const coverStyle = (key) => {
  const [a, b] = COVERS[key] || COVERS.emerald;
  return { backgroundImage: `linear-gradient(135deg, ${a}66, ${b}99 65%, #0d0d0d)` };
};


export const fmtShort = (str) => {
  const [, m, d] = str.split('-');
  return `${d}.${m}`;
};

export const dayOf = (c, str) => diff(c.startDate, str) + 1;