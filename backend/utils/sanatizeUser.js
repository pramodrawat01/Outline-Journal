// export const sanitize = (user) => {
//   const { password, ...rest } = user.toObject ? user.toObject() : user;
//   return rest;
// };
// // then: res.json({ user: sanitize(user) });

export const sanitize = (user) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};