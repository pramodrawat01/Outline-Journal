import Field from './Field';
import Segmented from './Segmented';

const GOALS = [1, 3, 5, 7];

export default function PreferencesStep({ form, update }) {
  return (
    <div className="space-y-6">
      <Field label="New entries are…" hint="You can change this on each entry before publishing.">
        <Segmented
          value={form.defaultEntryVisibility}
          onChange={(defaultEntryVisibility) => update({ defaultEntryVisibility })}
          options={[
            { value: 'private', label: 'Private by default' },
            { value: 'public', label: 'Public by default' },
          ]}
        />
      </Field>

      <Field label="Weekly writing goal" hint="Days per week you'd like to write. It powers your streak.">
        <div className="flex gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ weeklyGoal: g })}
              className={`h-11 w-14 rounded-xl border text-sm transition ${
                form.weeklyGoal === g
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}