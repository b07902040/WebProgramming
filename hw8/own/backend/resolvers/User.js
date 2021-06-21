const User = {
  message(parent, args, { db }, info) {
    return Promise.all(
      parent.message.map( (mID) =>
        db.MessageModel.findById(mid)),
    );
  },
};

export default User;