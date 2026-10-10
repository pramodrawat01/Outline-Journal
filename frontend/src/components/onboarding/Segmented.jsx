export default function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-[#0d0d0d] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            value === o.value ? 'bg-white text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}