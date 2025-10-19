import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce Gamer API',
            version: '1.0.0',
            description:
                'API para la gestión de productos, usuarios y carritos de compra del E-commerce Gamer.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/domain/entities/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);