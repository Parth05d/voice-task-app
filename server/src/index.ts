import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import taskRoutes from './routes/tasks';
import voiceRoutes from './routes/voice';
import analyticsRoutes from './routes/analytics';
import notificationRoutes from './routes/notifications';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});
