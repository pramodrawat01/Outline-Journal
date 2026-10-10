import { FaCheck } from 'react-icons/fa';

const STEPS = ['Profile', 'Interests', 'Preferences'];

export default function Stepper({ current }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                  done || active ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/50'
                }`}
              >
                {done ? <FaCheck size={10} /> : n}
              </div>
              <span className={`text-sm ${active ? 'text-white' : 'text-white/40'}`}>{label}</span>
            </div>
            {n < STEPS.length && (
              <div className={`mx-4 h-px flex-1 ${done ? 'bg-emerald-500/60' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}