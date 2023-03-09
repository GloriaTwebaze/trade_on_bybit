import { Request, Response } from "express";
import { Configs } from "../config";
import { BybitService } from "../exchange/bybit";

const bybitService = new BybitService({
  key: Configs.API_KEY,
  secret: Configs.SECRET_API,
  baseUrl: Configs.MAIN_URL,
  testnet: true,
});

async function placeOrder(req: Request, res: Response) {
  try {
    if (req.body) {
      let {
        symbol,
        side,
        order_type,
        qty,
        time_in_force,
        price,
        reduce_only,
        close_on_trigger,
        position_idx,
      } = req.body;
      const currentPrice: any = await bybitService.getPrice(symbol);
      price = side === "buy" ? Number(currentPrice) - 0.05 : Number(currentPrice) + 0.05;
      qty = parseFloat((qty / currentPrice).toFixed(3));
      const trade:any = await bybitService.placeOrder({
        symbol,
        side,
        order_type,
        qty,
        time_in_force,
        price,
        reduce_only,
        close_on_trigger,
        position_idx: 0,
      });
      if(trade){
        await bybitService.chaseOrder({
          orderId: trade?.order_id,
          symbol: trade?.symbol,
          trailBybps: 0.05,
          maxRetries: 4,
          side: trade?.side
        })
      }
      

      res.send(trade);
    } else {
      res.status(400).json({ message: "there is no body found" });
    }
  } catch (err) {
    console.log("An error occured while placing an order", err);
    res
      .status(401)
      .json({ message: "An error occured while placing your order" });
  }
}
export { placeOrder };
