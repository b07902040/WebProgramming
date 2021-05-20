import mongo from './mongo';
import express from 'express';
import cors from 'cors';
import routes from './routes';


// gotta load in MONGO_URL before `mongo.connect()`
require('dotenv-defaults').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);
console.log("main.js");
mongo.connect();
console.log("after mongo");
const server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});
