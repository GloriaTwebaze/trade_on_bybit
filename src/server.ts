import express from 'express'
import cors from 'cors'
import { ConfigureRoutes } from './routes';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
ConfigureRoutes(app)
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});