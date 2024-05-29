import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactsById } from './services/contacts.js';
import mongoose from 'mongoose';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.contactId;
    if (!mongoose.isValidObjectId(contactId)) {
      return res.status(400).json({
        status: 400,
        message: `Invalid contact ID format: ${contactId}`,
      });
    }
    try {
      const contact = await getContactsById(contactId);
      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactId}! not found!`,
        });
      }
      res.status(200).json({
        status: res.statusCode,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
