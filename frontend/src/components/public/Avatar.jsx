import { initials } from '../../utils/publicUtils';

export default function Avatar({ name, size = 'h-9 w-9 text-xs' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-white font-semibold text-black ${size}`}
    >
      {initials(name)}
    </div>
  );
}