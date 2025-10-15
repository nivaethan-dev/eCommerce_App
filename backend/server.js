import fs from 'fs';
import https from 'https';
import 'dotenv/config'; // automatically loads .env
import connect from './config/dbConnection.js';
import app from './app.js';

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connect(); // Connect to DB first
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${server.address().port}`);
  });
};

startServer();