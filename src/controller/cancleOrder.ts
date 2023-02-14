import { Request, Response } from "express";
import { Configs } from "../config";
import { BybitService } from "../exchange/bybit";

const bybitService = new BybitService({
  key: Configs.API_KEY,
  secret: Configs.SECRET_API,
  baseUrl: Configs.MAIN_URL,
  testnet: true,
});

async function cancleOrder(req: Request, res: Response) {
  try {
    const symbol = req.body;
    if (!symbol) {
      res.status(400).json({ message: "no record" });
    } else {
      const action = await bybitService.closeOrder(symbol);
      if (action) {
        res.status(200).json({ message: "order successfully cancelled" });
      } else {
        res.status(401).json({ message: "error cancelling the order" });
      }
    }
  } catch (err) {
    console.log("there was an cancelling the order", err);
    res.status(404).json({ message: "error cancelling the order" });
  }
}

export { cancleOrder };
