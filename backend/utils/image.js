// returns '' (no cover), the cleaned URL, or null when the URL isn't one of ours
export const cleanCover = (url) => {
  const s = String(url ?? '').trim();
  if (!s) return '';
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloud) return null;
  return s.startsWith(`https://res.cloudinary.com/${cloud}/`) && s.length < 500 ? s : null;
};