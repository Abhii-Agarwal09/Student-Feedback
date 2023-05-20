// Imports
require('dotenv').config();
// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/db.js';
// import { router as loginRouter } from './api/routes/loginRoutes.js';
// import { router as reviewRouter } from './api/routes/reviewRoutes.js';
// import { router as devRouter } from './api/routes/devRoutes.js';
// import { isLoggedIn } from './api/middleware/auth.js';
// import { originUrl } from './config/index.js';

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const loginRouter = require('./api/routes/loginRoutes.js');
const reviewRouter = require('./api/routes/reviewRoutes.js');
const devRouter = require('./api/routes/devRoutes.js');
const { isLoggedIn } = require('./api/middleware/auth.js');
const { originUrl } = require('./config/index.js');
// DB Config
connectDB();

const app = express();

const corsOptions = {
  origin: originUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Set-Cookie',
  ],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
};
// Middlewares
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/login', isLoggedIn, loginRouter);
app.use('/reviews', isLoggedIn, reviewRouter);
app.use('/dev', devRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Landing page',
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
