import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import upload from './config/upload';
import './database';

const app = express();
app.use(express.json());
app.use('/files', express.static(upload.directory));

app.use(routes);

app.listen(3000, () => {
  console.log('🚀 Server is running...');
});
