import {
  APIResponseWithTime,
  LinearCancelOrderRequest,
  LinearClient,
  LinearOrder,
  LinearPositionIdx,
  NewLinearOrder,
  RestClientOptions,
  SymbolIntervalFromLimitParam,
} from "bybit-api";
import { sleep } from "../utils/sleep";

export class BybitService {
  private linear: LinearClient;

  constructor(options: {
    key: string;
    secret: string;
    testnet: boolean;
    baseUrl: string;
  }) {
    this.linear = new LinearClient(options);
  }

  async placeOrder(params: {
    symbol: string;
    side: any;
    order_type: any;
    qty: number;
    time_in_force: any;
    price: number;
    reduce_only: boolean;
    close_on_trigger: boolean;
    position_idx: LinearPositionIdx;
  }): Promise<LinearOrder | null> {
    console.log(params.price);
    let { result, ret_code, ret_msg } = await this.linear.placeActiveOrder(
      params
    );
    if (ret_code === 0) {
      console.log(result);
      return result;
    } else {
      console.log(ret_code, ret_msg);
      throw new Error(ret_msg);
    }
    return null;
  }

  getPrice = async (symbol: string): Promise<number | null> => {
    const { result, ret_code, ret_msg } = await this.linear.getTickers({
      symbol,
    });
    let _result = result.find(
      (item: { symbol: string }) => item.symbol === symbol
    );
    if (ret_code === 0) {
      return _result.last_price;
    }
    console.log(result);
    if (ret_code === 0 && _result[0]) {
      return _result[0]?.last_price;
    } else {
      throw new Error(ret_msg);
    }
    return null;
  };

  async getMarkPriceKlineData(params: SymbolIntervalFromLimitParam) {
    const res = await this.linear.getMarkPriceKline(params);
    return res;
  }

  async getBestPrice(symbol: string) {
    const res = await this.linear.getOrderBook({ symbol });
    const bestAsk = res.result[0].price;
    const bestBid = res.result[0].price;
    return { res, bestAsk, bestBid };
  }

  async getLastTradedPrice(symbol: string) {
    const res = await this.linear.getTickers({ symbol });
    const lastTradedPrice = res.result?.[0]?.last_price;
    return { res, lastTradedPrice };
  }

  async closeOrder(params: { symbol: string }): Promise<boolean> {
    console.log(params);
    let { ret_code, ret_msg } = await this.linear.cancelAllActiveOrders({
      symbol: "BTCUSDT",
    });
    if (ret_code === 0) {
      console.log("Order Canceled");
      return true;
    } else {
      console.log(ret_code, ret_msg);
      return false;
    }
  }
  async getKlines(params: {
    symbol: string;
    interval: string;
    from: number;
    limit: number;
  }) {
    const { ret_code, ret_msg } = await this.linear.getKline(params);
    if (ret_code === 0) {
      const results = await this.linear.getKline(params);
      return results;
    } else {
      console.error(ret_msg);
    }
  }
  async getBalance(params:{coin:string}){
    const {ret_code, ret_msg, result} = await this.linear.getWalletBalance(params)
    if(ret_code ===0){
        // const bal = await this.linear.getWalletBalance(params)
        return result
    }else{
        console.error(ret_msg)
    }
  }


  async chaseOrder(params:{
    orderId: string,
    symbol: string,
    trailBybps:number,
    maxRetries: number,
    side: string
  }){
    let count = 0;
    let{maxRetries,orderId,symbol,trailBybps} = params
    if(!orderId){
        console.error("no order to chase")
    }
    maxRetries = maxRetries ?? 100
    while(true){
        await sleep(30000)
        console.log('chasing order')
       let price = await this.getPrice(symbol) 

       if (price === null){
        console.error("could not get the price")
       }else{
        trailBybps = trailBybps ?? 0.01
        price = params.side === "Buy" ? price - 0.05 : price + 0.05;
        let {ret_code,result,ret_msg}= await this.linear.replaceActiveOrder({
            order_id: orderId,
            p_r_price: parseFloat((price).toFixed(2)),
            symbol: symbol
        })
        // let currentDate:string = await currentTime()
        if(ret_code ===0){
            orderId = result.order_id
            const msg = 'order replaced successfully'
            console.log(msg)
            
        }else if(ret_msg?.includes('too late to replace')){
            console.log("order already in position")
            break
        }else{
            continue
        }
        if(count> maxRetries){
            console.log("maximum retries have been reached")
        }

       }
    }
  }
}
