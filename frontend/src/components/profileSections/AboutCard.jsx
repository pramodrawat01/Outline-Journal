const Row = ({ label, value }) => (
  <div className="grid grid-cols-[110px_1fr] gap-3 text-sm">
    <span className="text-white/40">{label}</span>
    <span className="font-medium text-white">{value || '—'}</span>
  </div>
);

export default function AboutCard({ user }) {
  const first = user.fullName?.split(' ')[0] || 'me';
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <h2 className="text-base font-semibold">About {first}</h2>
      <div className="mt-5 space-y-3">
        <Row label="Profession" value={user.profession} />
        <Row label="Currently reading" value={user.currentlyReading} />
        <Row label="Side project" value={user.sideProject} />
        <Row label="Exploring" value={user.exploring} />
      </div>
    </div>
  );
}