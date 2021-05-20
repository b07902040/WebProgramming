import mongo from './mongo';
import express from 'express';
import cors from 'cors';
import routes from './routes';

// gotta load in MONGO_URL before `mongo.connect()`
require('dotenv-defaults').config();

const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:4000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.use(express.json());
app.use('/', routes);

mongo.connect();

const server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});
