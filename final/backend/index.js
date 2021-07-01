const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const mongo = require('./mongo');
const app = express();
const PORT = process.env.PORT || 5050;

/* -------------------------------------------------------------------------- */
/*                               MONGOOSE MODELS                              */
/* -------------------------------------------------------------------------- */
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  eventname: { type: String, required: true },
  password: { type: String },
});

const eventSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  dates: [{
    year: { type: String },
    month: { type: String },
    day: { type: String },
    week: { type: String },
    time_s: { type: String },
    time_end: { type: String },
  }],
  result: [{
    username: { type: String },
    dateIsValid: [{ type: Boolean }],
  }],
  docs: { type: String },
  isHidden: { type: Boolean },
  creater: { type: String },
  //data_index_num: [{ type: Number }],
});

const UserModel = mongoose.model('User', userSchema);
const EventModel = mongoose.model('Event', eventSchema);

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

/* -------------------------------------------------------------------------- */
/*                            SERVER INITIALIZATION                           */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);

const wss = new WebSocket.Server({server});

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(client) {
  client.id = uuid.v4();
  client.sendEvent = (e) => client.send(JSON.stringify(e));
  client.on('message', async function incoming(message) {
    message = JSON.parse(message)
    const { type } = message;
    console.log("get " + type);
    switch (type) {
      // on open chat box

      case 'UserLogin': {
        const {
          data: {
            username,
            password,
            eventName,
            eventCode, 
          },
        } = message;
        const existEvent = await EventModel.findOne({name: eventName});
        if ( !existEvent ) {
          client.sendEvent({
            type: 'EventNotFound',
          });
          break;
        }
        const existEventCode = await EventModel.findOne({name: eventName, code: eventCode});
        if ( !existEventCode ) {
          client.sendEvent({
            type: 'EventCodeError',
          });
          break;
        }
        console.log("-------");
        var checkPassword = await UserModel.find({
          username: username, 
          eventname: eventName,
        });
        if ( Object.size(checkPassword) !== 0 ) {
          if ( checkPassword[0].password !== password && checkPassword[0].password !== undefined ) {
            console.log(checkPassword[0].password);
            client.sendEvent({
              type: 'PasswordError',
            });
            break;
          }
          else {
            client.sendEvent({
              type: 'Check-OK-Login',
            });
            break;
          }
        }
        else {
          const newUser = new UserModel({
            username: username,
            eventname: eventName,
            password: password,
          });
          await newUser.save();
          console.log("Create user success.");
          client.sendEvent({
            type: 'Check-OK-Login',
          });
        }
        break;
      }

      case 'Check-to-Create': {
        const {
          data: {
            username,
            password,
            eventName,
            eventCode, 
          },
        } = message;
        const existEventCode = await EventModel.findOne({name: eventName, code: eventCode});
        if ( existEventCode ) {
          client.sendEvent({
            type: 'EventHad',
          });
        }
        else {
          client.sendEvent({
            type: 'Check-OK-Create',
          });
        }
        break;
      }

      case 'CreateEvent-and-User': {
        const {
          data: { 
            eventName,
            eventCode,
            userName,
            password,
            dates,
            docs,
            isHidden,
            creater
          },
        } = message; 
        const exist = false;
        if ( !exist ) {
          const result = [];
          const newEvent = new EventModel({ 
            name: eventName,
            code: eventCode,
            dates: dates,
            result: result,
            docs: docs,
            isHidden: isHidden,
            creater: creater,
          });
          await newEvent.save();
          console.log("Create event success.");
          const newUser = new UserModel({
            username: userName,
            eventname: eventName,
            password: password,
          });
          await newUser.save();
          console.log("Create user success.");
          client.sendEvent({
            type: 'CreateEventSuccess',
          });
        }
        break;
      }

      case 'RequestEvent': {
        const {
          data: { eventName, eventCode },
        } = message;
        var flag = true;
        const exist = await EventModel.findOne({name: eventName, code: eventCode});
        if ( exist ) {
          client.sendEvent({
            type: 'allEvent',
            data: {
              name: exist.name,
              code: exist.code,
              dates: exist.dates,
              result: exist.result,
              docs: exist.docs,
              isHidden: exist.isHidden,
              creater: exist.creater,
            },
          });
          console.log('Sent event to client');
        }
        break;
      }

      case 'UploadResult': {
        const {
          data: { 
            name,
            code,
            result 
          },
        } = message;
        
        await EventModel.updateOne(
          { "name": name, "code": code },
          {$push:{ "result": result }
        });

        console.log('Save selected date success');

        const exist = await EventModel.findOne({name: name, code: code});
        if ( exist ) {
          client.sendEvent({
            type: 'updateEvent',
            data: {
              name: exist.name,
              code: exist.code,
              dates: exist.dates,
              result: exist.result,
              docs: exist.docs,
              isHidden: exist.isHidden,
              creater: exist.creater,
            },
          });
          console.log('Sent updated event to client');
        }

        break;
      }

      case 'ResetResult': {
        const {
          data: { 
            name,
            code,
            username, 
          },
        } = message;

        const exist = await EventModel.findOne({name: name, code: code});
        if ( exist ) {
          client.sendEvent({
            type: 'resetEvent',
            data: {
              name: exist.name,
              code: exist.code,
              dates: exist.dates,
              result: exist.result,
              docs: exist.docs,
              isHidden: exist.isHidden,
              creater: exist.creater,
            },
          });
          console.log('Sent raw event to client');
        }

        await EventModel.updateOne(
          { "name": name, "code": code },
          {$pull:{ result: { username: username } },
        });

        console.log('Reset selected date success');

        break;
      }

      default: { break;}

    }

    // disconnected
    client.once('close', () => {
      
    });
  });
});

mongo.connect();

server.listen(PORT, () => {
  console.log('Server listening at http://localhost:5050');
});
