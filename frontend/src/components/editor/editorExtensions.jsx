// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Placeholder from '@tiptap/extension-placeholder';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import { createLowlight, common } from 'lowlight';

// const lowlight = createLowlight(common);

// export const getExtensions = (placeholder = 'Start writing...') => [
//   StarterKit.configure({ codeBlock: false }),
//   Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full' } }),
//   Placeholder.configure({ placeholder }),
//   CodeBlockLowlight.configure({ lowlight }),
// ];  


import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { ImageUpload } from './ImageUpload';

const lowlight = createLowlight(common);

export const getExtensions = (placeholder = 'Start writing...') => [
  StarterKit.configure({ codeBlock: false, link: false }),
  Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full', loading: 'lazy' } }),
  Link.configure({
    openOnClick: false, // editing never navigates away; published posts use normal anchor clicks
    autolink: true,
    linkOnPaste: true,
    defaultProtocol: 'https',
    HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
  }),
  Placeholder.configure({ placeholder }),
  CodeBlockLowlight.configure({ lowlight }),
  ImageUpload,
];