const mongoose = require('mongoose')

mongoose.connection.once('open',() => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

const connectDB = (url) => {
  return mongoose.connect(url)
}

module.exports = connectDB