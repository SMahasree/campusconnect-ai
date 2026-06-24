import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec } from '../swagger/swaggerOptions.js';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(buildSwaggerSpec()));

export default router;

