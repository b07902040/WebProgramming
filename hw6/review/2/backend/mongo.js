import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";

dotenv.config();

function connectMongo() {
  console.log("try");
  mongoose.connect("mongodb+srv://WPhw6:WebProgrammingHW6@cluster0.oks1y.mongodb.net/DB_TEST?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('mongo connected!');
  });

  const testobj = {name: "joe", subject: "EE", score: "99"};
  db.collection("create-card").insertOne(testobj, function (err, res) {
    if (err) throw err;
    console.log("1 documnet inserted");
  })
}
 

const mongo = {
  connect: connectMongo,
};

export default mongo;
