import axiosInstance from '../lib/axios';

export const getDiaries = () => axiosInstance.get('/diaries').then((r) => r.data.diaries);

// returns { diary, entries }
export const getDiary = (id) => axiosInstance.get(`/diaries/${id}`).then((r) => r.data);

export const createDiary = (payload) =>
  axiosInstance.post('/diaries', payload).then((r) => r.data.diary);

export const updateDiary = (id, payload) =>
  axiosInstance.put(`/diaries/${id}`, payload).then((r) => r.data.diary);

export const deleteDiary = (id) => axiosInstance.delete(`/diaries/${id}`);