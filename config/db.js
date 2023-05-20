const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL;

const connectDB = () => {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', () => {
    console.log('Database connected');
  });
};

module.exports = connectDB;
