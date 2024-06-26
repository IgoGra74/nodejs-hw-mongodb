import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      details: err.details,
    });
  }
  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'Mongoose error',
      data: {
        message: err.message,
      },
    });
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};

// app.use((err, req, res, next) => {
//   if (err.status === 400 && err.details) {
//     // Відправляємо деталі помилки разом з повідомленням
//     return res.status(400).json({
//       message: err.message,
//       details: err.details,
//     });
//   }

//   // Обробка інших помилок
//   res.status(err.status || 500).json({
//     message: err.message || 'Internal Server Error',
//   });
// });
