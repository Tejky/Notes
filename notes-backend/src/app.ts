import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import notesRouter from './routes/notes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/notes', notesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URI || '');

export default app;
