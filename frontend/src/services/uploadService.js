import axiosInstance from '../lib/axios';

// returns { url, width, height }
export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return axiosInstance.post('/uploads/image', form).then((r) => r.data);
};