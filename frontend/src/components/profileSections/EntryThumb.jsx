import { COVERS, coverStyle } from '../../utils/challengeUtils';

const KEYS = Object.keys(COVERS);
const coverFor = (id = '') => KEYS[parseInt(id.slice(-2), 16) % KEYS.length] || KEYS[0];

export default function EntryThumb({ id, cover, icon }) {
  return (
    <div
      className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 text-3xl sm:flex"
      style={coverStyle(cover || coverFor(id))}
    >
      {icon}
    </div>
  );
}