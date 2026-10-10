const INTERESTS = [
  'Writing', 'Reading', 'Coding', 'Product design', 'Startups', 'Career',
  'Fitness', 'Running', 'Learning', 'Photography', 'Mindfulness', 'Travel',
  'Music', 'Finance',
];
const MAX = 8;

export default function InterestsStep({ form, update }) {
  const toggle = (i) => {
    const has = form.interests.includes(i);
    if (!has && form.interests.length >= MAX) return;
    update({ interests: has ? form.interests.filter((x) => x !== i) : [...form.interests, i] });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">What do you want to write about?</h3>
        <p className="mt-1 text-xs text-white/40">
          Pick up to {MAX}. These show on your profile and help readers find you. ({form.interests.length}/{MAX})
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i) => {
          const on = form.interests.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                on
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              {i}
            </button>
          );
        })}
      </div>
    </div>
  );
}