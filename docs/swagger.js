const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinic / Appointment API',
      version: '1.0.0',
      description: 'Patients, Doctors, Appointments'
    },
    servers: [{ url: 'http://localhost:5000' }]
  },
  apis: [] // add YAML files later for full spec
};

module.exports = swaggerJsdoc(options);
