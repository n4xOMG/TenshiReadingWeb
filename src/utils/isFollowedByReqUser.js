export const isFollowedByReqUser = (reqUserId, book) => {
  for (let user of book.favoured) {
    if (reqUserId === user.id) {
      return true;
    }
  }
  return false;
};
