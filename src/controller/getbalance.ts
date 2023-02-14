import { SymbolIntervalFromLimitParam } from "bybit-api";
import { Request, Response } from "express";
import { Configs } from "../config";
import { BybitService } from "../exchange/bybit";

const bybitBal = new BybitService({
  key: Configs.API_KEY,
  secret: Configs.SECRET_API,
  baseUrl: Configs.MAIN_URL,
  testnet: true,
});

async function getMyBalance(req: Request, res: Response) {
  const coin = req.body;
  if (coin) {
    const bal = await bybitBal.getBalance(coin);
    console.log("eeeeeeeeee", bal);
    res.status(200).json({
        status: true,
        bal: bal
      });
  } else {
    res.status(400).json({ message: "error getting data" });
  }

}

export { getMyBalance };
