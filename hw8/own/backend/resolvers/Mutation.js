import uuidv4 from 'uuid/v4';

const makeName = (name, to) => {
  return [name, to].sort().join('_');
};

const checkUser = async (db, name, S) => {
  return (await db.UserModel.findOne({"name": name}) === null);
};

const newUser = async (db, name) => {
  await db.UserModel.create({"name": name, "chatBoxes":[]})
  return;
};

const Mutation = {

  async createChatBox (parent, { name1, name2 }, { db, pubsub }, info)
  {
    if (!name1 || !name2)
      throw new Error("Missing chatBox name for CreateChatBox");
    if (!(await checkUser(db, name1, "createChatBox"))) {
      console.log("User does not exist for CreateChatBox: " + name1);
      await newUser(db, name1);
    }
    if (!(await checkUser(db, name2, "createChatBox"))) {
      console.log("User does not exist for CreateChatBox: " + name1);
      await newUser(db, name2);
    }
    const newChatBox = ({
      "name": makeName(name1, name2),
      "users": [await db.UserModel.findOne({"name": name1}), await db.UserModel.findOne({"name": name2})],
      "messages": [],
    });
    await db.ChatBoxModel.create(newChatBox);
    return newChatBox;
  },

  
};

export { Mutation as default };
