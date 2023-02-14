import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const SwaggerOptions = {

    swaggerDefinition: {
        info: {
            title: "Buy and Sell API on Buybit and Uniswap",
            description: "A user is able to place and order for ethier buy or sell on Bybit",
            contact: {
                name: "Ngeni Labs",
            },
            servers: ["http://localhost:3000"],
        },
    },
    apis: ["../routes.ts"],
}

const swaggerDoc = swaggerJSDoc();

//get kline and balance

export { swaggerDoc };
