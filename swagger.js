const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Read the OpenAPI specification file
const openApiSpecification = fs.readFileSync(path.join(__dirname, 'openapi.yml'), 'utf8');

// Configure Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Bootcamps API',
      version: '1.0.0',
      description: 'API documentation for Bootcamps',
    },
  },
  apis: ['./openapi.yml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;