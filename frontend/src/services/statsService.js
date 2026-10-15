import axiosInstance from '../lib/axios';

export const getOverview = (today) =>
  axiosInstance.get('/stats/overview', { params: { today } }).then((r) => r.data);