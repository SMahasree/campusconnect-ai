import swaggerJSDoc from 'swagger-jsdoc';

// swaggerOptions is passed into swaggerJSDoc.
// We keep docs co-located with routes via JSDoc comments.
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Campus Lost & Found System API',
      version: '1.0.0',
      description: 'REST API for Lost & Found with JWT auth, claims, and matching suggestions.'
    },
    servers: [{ url: 'http://localhost:5000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

export function buildSwaggerSpec() {
  return swaggerJSDoc(swaggerOptions);
}

