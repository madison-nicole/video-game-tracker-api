/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './router';

// aws s3 communication setup
dotenv.config({ silent: true });

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // To parse the incoming requests with JSON payloads

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// this should go AFTER body parser
app.use('/api', apiRoutes);

// START THE SERVER

// =============================================================================

async function startServer() {
  try {
    // connect db

    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);
    const port = process.env.PORT || 9090;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
