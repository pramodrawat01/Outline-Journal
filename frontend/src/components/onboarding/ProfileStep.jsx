import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { checkUsername } from '../../services/profileService';
import Field, { inputCls } from './Field';
import Segmented from './Segmented';

export default function ProfileStep({ form, update, usernameStatus, setUsernameStatus }) {
  const { user } = useAuth();

  // debounced username availability check
  useEffect(() => {
    const u = form.username;
    if (!u) return setUsernameStatus({ state: 'idle', message: '' });
    if (u === user.username) return setUsernameStatus({ state: 'ok', message: '' });
    if (u.length < 3) {
      return setUsernameStatus({ state: 'invalid', message: 'At least 3 characters' });
    }

    setUsernameStatus({ state: 'checking', message: 'Checking…' });
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await checkUsername(u);
        if (cancelled) return;
        setUsernameStatus(
          res.available
            ? { state: 'ok', message: 'Username is available' }
            : { state: 'taken', message: res.reason }
        );
      } catch {
        if (!cancelled) setUsernameStatus({ state: 'invalid', message: 'Could not check username' });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.username]);

  const statusColor =
    usernameStatus.state === 'ok' ? 'text-emerald-400' : usernameStatus.state === 'checking' ? 'text-white/40' : 'text-red-400';

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <input
            className={inputCls}
            value={form.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            placeholder="Aarav Mehta"
            maxLength={60}
          />
        </Field>
        <Field label="Username">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">@</span>
            <input
              className={`${inputCls} pl-8`}
              value={form.username}
              onChange={(e) =>
                update({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) })
              }
              placeholder="aaravmehta"
            />
          </div>
          {usernameStatus.message && <p className={`text-xs ${statusColor}`}>{usernameStatus.message}</p>}
        </Field>
      </div>

      <Field label="Profession" hint="This helps people understand what shapes your perspective.">
        <input
          className={inputCls}
          value={form.profession}
          onChange={(e) => update({ profession: e.target.value })}
          placeholder="Product designer"
          maxLength={80}
        />
      </Field>

      <Field label="Short bio" hint={`Keep it short and personal. ${form.bio.length}/280`}>
        <textarea
          className={`${inputCls} h-28 resize-none`}
          value={form.bio}
          onChange={(e) => update({ bio: e.target.value })}
          placeholder="What are you working toward?"
          maxLength={280}
        />
      </Field>

      <Field label="Profile visibility" hint="Public profiles can be discovered by other writers.">
        <Segmented
          value={form.visibility}
          onChange={(visibility) => update({ visibility })}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
        />
      </Field>
    </div>
  );
}