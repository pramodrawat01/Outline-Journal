import { getCloudinary } from '../config/cloudinary.js';

const optimized = (url) => url.replace('/upload/', '/upload/f_auto,q_auto/');

export const uploadImage = async (req, res) => {
  try {
    const cloudinary = getCloudinary();
    if (!cloudinary) {
      return res.status(503).json({ message: 'Image uploads are not set up on the server yet' });
    }
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `outline/${req.user._id}`,
          resource_type: 'image',
          transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
        },
        (err, out) => (err ? reject(err) : resolve(out))
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({
      url: optimized(result.secure_url),
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not upload the image' });
  }
};