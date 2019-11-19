const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// NOTE: Middlewares
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello serveriltä', app: 'Natours' });
});

// app.post('/', (req, res) => {
// 	res.send('You can post to this endpoint!');
// });

// NOTE: Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
