import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import matchRoutes from './routes/matchingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reputationRoutes from './routes/reputationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';

import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec } from './swagger/swaggerOptions.js';


import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Resolve current directory for serving uploads.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g., curl/postman)
    if (!origin) return cb(null, true);

    const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // If CORS_ORIGIN is wildcarded, allow all
    if (allowed.includes('*')) return cb(null, true);

    return cb(allowed.includes(origin) ? null : new Error('Not allowed by CORS'), allowed.includes(origin));
  },
  credentials: true
}));
app.use(morgan('dev'));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

// Swagger UI (OpenAPI docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(buildSwaggerSpec()));

// Route docs are auto-generated from JSDoc in routes/controllers.
// If you want a full static openapi.json, run the generator and commit the output.



app.use('/api/auth', authRoutes);

app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/verifications', verificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

