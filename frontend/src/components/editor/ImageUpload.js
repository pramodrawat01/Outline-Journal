import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { uploadImage } from '../../services/uploadService';

const MAX_BYTES = 8 * 1024 * 1024;
const isImage = (f) => /^image\/(jpeg|png|webp|gif)$/.test(f.type);

export const ImageUpload = Extension.create({
  name: 'imageUpload',

  addStorage() {
    return { uploading: 0, error: '', upload: null };
  },

  onCreate() {
    const editor = this.editor;
    const storage = this.storage;

    // an empty transaction wakes the toolbar so it re-reads this status
    const refresh = () => {
      if (!editor.isDestroyed) editor.view.dispatch(editor.state.tr);
    };

    storage.upload = async (files, pos) => {
      const images = Array.from(files).filter(isImage);
      if (images.length === 0) {
        storage.error = 'Only JPG, PNG, WebP or GIF images can be added.';
        refresh();
        return;
      }

      let at = pos;
      for (const file of images) {
        if (file.size > MAX_BYTES) {
          storage.error = 'Images must be 8 MB or smaller.';
          refresh();
          continue;
        }

        storage.uploading += 1;
        storage.error = '';
        refresh();

        try {
          const { url } = await uploadImage(file);
          if (editor.isDestroyed) return;

          const chain = editor.chain().focus();
          if (typeof at === 'number') {
            chain.insertContentAt(at, { type: 'image', attrs: { src: url } });
          } else {
            chain.setImage({ src: url });
          }
          chain.run();
          at = undefined;
        } catch (err) {
          storage.error = err.response?.data?.message || 'Could not upload the image.';
        } finally {
          storage.uploading -= 1;
          refresh();
        }
      }
    };
  },

  addProseMirrorPlugins() {
    const storage = this.storage;

    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const files = Array.from(event.clipboardData?.files || []).filter(isImage);
            // leave normal text pastes alone; only handle pasted images (screenshots, copied images)
            if (files.length === 0 || event.clipboardData.getData('text/plain')) return false;
            event.preventDefault();
            storage.upload?.(files);
            return true;
          },
          handleDrop(view, event) {
            const files = Array.from(event.dataTransfer?.files || []).filter(isImage);
            if (files.length === 0) return false;
            event.preventDefault();
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
            storage.upload?.(files, pos);
            return true;
          },
        },
      }),
    ];
  },
});