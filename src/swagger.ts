import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition:{
    openapi: '3.0.0',
    info: {
      title: 'Flowbit API',
      version: '1.0.0',
      description: 'Ticket Management System APIs'
    },
    servers:[
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes/api/*.ts']
}

export const swaggerSpec = swaggerJsDoc(options);