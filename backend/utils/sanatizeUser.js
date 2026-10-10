export const sanitize = (user) => {
  const { password, ...rest } = user.toObject ? user.toObject() : user;
  return rest;
};
// then: res.json({ user: sanitize(user) });