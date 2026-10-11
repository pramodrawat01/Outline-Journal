import axiosInstance from '../lib/axios';

export const getMyBlogs = () => axiosInstance.get('/blogs').then((r) => r.data.blogs);

export const getMyBlog = (id) => axiosInstance.get(`/blogs/${id}`).then((r) => r.data.blog);

export const createBlog = (payload) => axiosInstance.post('/blogs', payload).then((r) => r.data.blog);

export const deleteBlog = (id) => axiosInstance.delete(`/blogs/${id}`);

export const updateBlog = (id, payload) =>
  axiosInstance.put(`/blogs/${id}`, payload).then((r) => r.data.blog);