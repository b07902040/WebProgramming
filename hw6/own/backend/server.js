import http from 'http';
import express from 'express';
import dotenv from 'dotenv-defaults';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import Message from './models/message.js';

dotenv.config();

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  throw new Error("DB connection error: " + error);
})

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const wssConnect = ws => {
}

db.once('open', () => {
  console.log('MongoDB connected!')

  wss.on('connection', wssConnect)

  const PORT = process.env.port || 4000

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})

