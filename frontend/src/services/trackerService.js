import axiosInstance from '../lib/axios';

export const getTrackers = (today) =>
  axiosInstance.get('/trackers', { params: { today } }).then((r) => r.data.trackers);

// returns { tracker, days, summary }
export const getTracker = (id, today) =>
  axiosInstance.get(`/trackers/${id}`, { params: { today } }).then((r) => r.data);

export const createTracker = (payload, today) =>
  axiosInstance.post('/trackers', payload, { params: { today } }).then((r) => r.data.tracker);

export const updateTracker = (id, payload) =>
  axiosInstance.put(`/trackers/${id}`, payload).then((r) => r.data.tracker);

export const deleteTracker = (id) => axiosInstance.delete(`/trackers/${id}`);

// returns { day, summary }
export const saveTrackerDay = (id, date, payload, today) =>
  axiosInstance.put(`/trackers/${id}/days/${date}`, payload, { params: { today } }).then((r) => r.data);