require('dotenv').config();
require('express-async-errors');

//extra security package
const helmet = require('helmet')
const cors = require('cors');
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const morgan = require('morgan');

const express = require('express');
const app = express();

//connect DB
const connectDB = require('./db/connect')

//protect routes
const authenticateUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//extra packages
app.use(morgan('combined'))
app.use(express.json());
app.use(helmet())
app.use(xss())
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(cors({
  origin: 'http://localhost:3000'
}));

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)
app.get('/',(req,res)=>{
  res.send('jobs api')
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
