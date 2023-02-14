import { SymbolIntervalFromLimitParam } from "bybit-api";
import { Request, Response } from "express";
import { Configs } from "../config";
import { BybitService } from "../exchange/bybit";

const bybitServices = new BybitService({
  key: Configs.API_KEY,
  secret: Configs.SECRET_API,
  baseUrl: Configs.MAIN_URL,
  testnet: true,
});

async function getTheKline(req:Request, res:Response) {
  try{const params = {
    symbol: "BTCUSDT",
    interval: "1M",
    from: 1676295195,
    limit: 100,
  };
if(req.body){
    let {symbol, interval, from} = req.body
    const results = await bybitServices.getKlines(params);
    res.send(results)
}else{
    res.status(404).json({message:"error retrieving data"})
}}catch(err){
    console.log(err, "error retrieving kline")
}
  
 
}
export { getTheKline };
