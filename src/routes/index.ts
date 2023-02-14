import { Application } from "express"
import { placeOrderRouter } from "./api"

export const ConfigureRoutes = (app: Application) => {
    app.use([placeOrderRouter])
    app.get('/ping', (req, res) => {
        res.send("Hellow World")
    })
}