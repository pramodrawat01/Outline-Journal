import axiosInstance from '../lib/axios';

export const getAuthor = (username) =>
  axiosInstance.get(`/public/users/${encodeURIComponent(username)}`).then((r) => r.data);

export const getAuthorItems = (username, type) =>
  axiosInstance
    .get(`/public/users/${encodeURIComponent(username)}/items`, { params: { type } })
    .then((r) => r.data.items);


export const getFeed = (params) =>
  axiosInstance.get('/public/feed', { params }).then((r) => r.data);

export const getPublicBlog = (id) => axiosInstance.get(`/public/blogs/${id}`).then((r) => r.data);

export const getPublicJournal = (id) => axiosInstance.get(`/public/journals/${id}`).then((r) => r.data);

export const getPublicDiary = (id) => axiosInstance.get(`/public/diaries/${id}`).then((r) => r.data);

export const getPublicDiaryEntry = (id, entryId) =>
  axiosInstance.get(`/public/diaries/${id}/entries/${entryId}`).then((r) => r.data);