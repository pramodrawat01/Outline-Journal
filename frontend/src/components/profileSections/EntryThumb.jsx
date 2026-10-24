// import { COVERS, coverStyle } from '../../utils/challengeUtils';

// const KEYS = Object.keys(COVERS);
// const coverFor = (id = '') => KEYS[parseInt(id.slice(-2), 16) % KEYS.length] || KEYS[0];

// export default function EntryThumb({ id, cover, icon }) {
//   return (
//     <div
//       className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 text-3xl sm:flex"
//       style={coverStyle(cover || coverFor(id))}
//     >
//       {icon}
//     </div>
//   );
// }

// import { coverStyle, diaryCoverStyle } from '../../utils/challengeUtils';

// export default function EntryThumb({ cover, icon }) {
//   return (
//     <div
//       className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 text-3xl sm:flex"
//       style={cover ? diaryCoverStyle(cover) : coverStyle()}
//     >
//       {icon}
//     </div>
//   );
// }


import { coverStyle, diaryCoverStyle } from '../../utils/challengeUtils';
import { imgT } from '../../utils/publicUtils';

const BOX = 'hidden h-24 w-24 shrink-0 rounded-xl border border-white/10 sm:block';

export default function EntryThumb({ cover, icon, image }) {
  if (image) {
    return (
      <img
        src={imgT(image, 'c_fill,w_240,h_240')}
        alt=""
        loading="lazy"
        className={`${BOX} object-cover`}
      />
    );
  }

  return (
    <div
      className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 text-3xl sm:flex"
      style={cover ? diaryCoverStyle(cover) : coverStyle()}
    >
      {icon}
    </div>
  );
}