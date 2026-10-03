import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './core/middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import homeRoutes from './modules/home/home.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import testimonialsRoutes from './modules/testimonials/testimonials.routes.js';
import clientsRoutes from './modules/clients/clients.routes.js';
import journeyRoutes from './modules/journey/journey.routes.js';
import certificationsRoutes from './modules/certifications/certifications.routes.js';
import goalsRoutes from './modules/goals/goals.routes.js';
import teamRoutes from './modules/team/team.routes.js';
import servicesRoutes from './modules/services/services.routes.js';
import countriesRoutes from './modules/countries/countries.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import inquiriesRoutes from './modules/inquiries/inquiries.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import networkRoutes from './modules/network/network.routes.js';
import rawMaterialsRoutes from './modules/raw-materials/raw-materials.routes.js';
import mediaRoutes from './modules/media/media.routes.js';

const app = express();

// CORS configuration allowing production frontend and localhost
const allowedOrigins = [
  'https://bismillahplastic.com',
  'https://www.bismillahplastic.com',
  'https://admin.bismillahplastic.com',
  'https://maple-ag.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => o && origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/raw-materials', rawMaterialsRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
