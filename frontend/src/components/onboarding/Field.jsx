export const inputCls =
  'w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60';

export default function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
}