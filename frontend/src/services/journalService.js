import axiosInstance from '../lib/axios';

// export const getPersonalJournals = () =>
//   axiosInstance.get('/journals').then((r) => r.data.journals);
export const getPersonalJournals = (all = false) =>
  axiosInstance
    .get('/journals', { params: all ? { all: 1 } : {} })
    .then((r) => r.data.journals);

export const getPersonalJournal = (id) =>
  axiosInstance.get(`/journals/${id}`).then((r) => r.data.journal);

export const createPersonalJournal = (payload) =>
  axiosInstance.post('/journals', payload).then((r) => r.data.journal);

export const updatePersonalJournal = (id, payload) =>
  axiosInstance.put(`/journals/${id}`, payload).then((r) => r.data.journal);

export const deletePersonalJournal = (id) => axiosInstance.delete(`/journals/${id}`);