const ChatBox = {
  message(parent, args, { db }, info) {
    return Promise.all(
      parent.message.map( (mID) =>
        db.MessageModel.findById(mID)),
    );
  },
};

export default ChatBox;