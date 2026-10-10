import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

export const getExtensions = (placeholder = 'Start writing...') => [
  StarterKit.configure({ codeBlock: false }),
  Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full' } }),
  Placeholder.configure({ placeholder }),
  CodeBlockLowlight.configure({ lowlight }),
];  