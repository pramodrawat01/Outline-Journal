
import axiosInstance from "../lib/axios";

export const checkUsername = (u) =>
  axiosInstance.get('/profile/username-check', { params: { u } }).then((r) => r.data);

export const saveOnboarding = (payload) =>
  axiosInstance.patch('/profile/onboarding', payload).then((r) => r.data);