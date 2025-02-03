import express from 'express'
import cors from 'cors'
import MenuRoute from './routes/menuRoute'
import UserRoute from './routes/userRoutes'
import OrderRoute from './routes/orderRoute'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

require('dotenv').config();

const PORT: number = 8000
const app = express()
app.use(cors())
app.use(express.json())

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Ordering System API',
            version: '1.0.0',
            description: 'API documentation for the ordering system',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { // Nama skema keamanan
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Format token
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routers/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/menu', MenuRoute)
app.use('/user', UserRoute)
app.use(`/order`, OrderRoute)

app.use(express.static(path.join(__dirname, '..', 'public')))

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`) 
})