import axiosInstance from '../lib/axios';

export const getChallenges = () =>
  axiosInstance.get('/challenges').then((r) => r.data.challenges);

export const createChallenge = (payload) =>
  axiosInstance.post('/challenges', payload).then((r) => r.data.challenge);

export const deleteChallenge = (id) => axiosInstance.delete(`/challenges/${id}`);

export const getChallengeJournals = (id) =>
  axiosInstance.get(`/challenges/${id}/journals`).then((r) => r.data);

export const getJournal = (id, date) =>
  axiosInstance.get(`/challenges/${id}/journals/${date}`).then((r) => r.data);

export const saveJournal = (id, date, payload) =>
  axiosInstance.put(`/challenges/${id}/journals/${date}`, payload).then((r) => r.data.journal);