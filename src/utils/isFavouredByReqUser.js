export const isFavouredByReqUser = (reqUserId, data) => {
  if (!Array.isArray(data.favoured)) {
    return false;
  }
  for (let user of data.favoured) {
    if (reqUserId === user.id) {
      return true;
    }
  }
  return false;
};
