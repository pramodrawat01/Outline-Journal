// const textOf = (node) => {
//   if (!node) return '';
//   if (typeof node.text === 'string') return node.text;
//   return Array.isArray(node.content) ? node.content.map(textOf).join(' ') : '';
// };

// export const makeExcerpt = (content) =>
//   textOf(content).replace(/\s+/g, ' ').trim().slice(0, 160);



const textOf = (node) => {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  return Array.isArray(node.content) ? node.content.map(textOf).join(' ') : '';
};

const plainText = (content) => textOf(content).replace(/\s+/g, ' ').trim();

export const makeExcerpt = (content) => plainText(content).slice(0, 160);

export const readTimeOf = (content) =>
  Math.max(1, Math.round(plainText(content).split(' ').filter(Boolean).length / 200));