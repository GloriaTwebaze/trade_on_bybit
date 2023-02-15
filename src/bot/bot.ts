import { Context, Telegraf } from "telegraf";
import { symbolName } from "typescript";
import { Configs } from "../config";
import { BybitService } from "../exchange";
import { normalizeMessage } from "../utils/telgram";

const bot = new Telegraf(Configs.BOT_TOKEN);
const botKeys = {
  key: Configs.API_KEY,
  baseUrl: Configs.MAIN_URL,
  secret: Configs.SECRET_API,
  testnet: true,
};
//initialize the bot
bot.start((Context) => {
  Context.reply("welcome to Gloe's trade_bot");
});
// display balance details
bot.command("getbalance", async (Context) => {
  const bybitGetBal = new BybitService(botKeys);
  const { USDT }: any = await bybitGetBal.getBalance({ coin: "USDT" });
  let message = `*\USDT\*`;
  message += `\n Equity: \`${USDT["equity"]}\``;
  message += `\n Available balance: \`${USDT["available_balance"]}\``;
  message += `\n Used margin: \`${USDT["used_margin"]}\``;
  message += `\n order margin: \`${USDT["order_margin"]}\``;
  message += `\n position margin: \`${USDT["position_margin"]}\``;
  messageSender(message, false);
});
//placed order

const bybitPlace = new BybitService(botKeys);
bot.command("placelimitorder", async (ctx) => {
  const price: any = Number(await bybitPlace.getPrice("BTCUSDT"));
  let message = "";
  const command = ctx.update.message.text;
  console.log(command);
  const { result }: any = await bybitPlace.placeOrder({
    symbol: "BTCUSDT",
    side: "Buy",
    order_type: "Limit",
    qty: 2,
    time_in_force: "GoodTillCancel",
    price,
    reduce_only: false,
    close_on_trigger: false,
    position_idx: 0,
  });
  if (result) {
    message += `${result?.symbol}`;
    message += `\n user Id: \`${result?.user_id}\``;
    message += `\n order Id: \`${result?.order_id}\``;
    message += `\n Symbol: \`${result?.symbol}\``;
    message += `\n Side: \`${result?.side}\``;
    message += `\n Price: \`${result?.price}\``;
    message += `\n Quantity: \`${result?.qty}\``;
    messageSender(message, false);
  }
});

bot.command("exitposition", async (ctx: any) => {
  let message = `*\Limit order placed\*`;
  const price: any = Number(await bybitPlace.getPrice("BTCUSDT"));
  const { ret_msg, result, ret_code }: any = await bybitPlace.placeOrder({
    symbol: "BTCUSDT",
    side: "Sell",
    order_type: "Limit",
    qty: 2,
    time_in_force: "GoodTillCancel",
    price,
    reduce_only: true,
    close_on_trigger: false,
    position_idx: 0,
  });
  console.log(result, ret_msg, ret_code);
  if (ret_code === 0) {
    message = `*\Exiting order position\*`;
    messageSender(message);
  } else {
    message = "current position is zero, place more position to exit";
    messageSender(message);
  }
});
//cancelled order
bot.command("cancellimitorder", async () => {
  const bybitCancel = new BybitService(botKeys);
  const result = await bybitCancel.closeOrder({ symbol: "BTCUSDT" });
  let msg = `*\Limit order ${"BTCUSDT"} cancelled successfully\*`;
  messageSender(msg, false);
});

// chasing the order
bot.command("chaselimitorder", async () => {
  const bybitChase = new BybitService(botKeys);
  const resp = await bybitChase.chaseOrder({
    maxRetries: 1,
    orderId: "",
    symbol: "BTCUSDT",
    trailBybps: 15,
    side: "",
  });
  let msg = `*\Chasing order...\*`;

  messageSender(msg, false);
});

const messageSender = async (msg: string, deleteMsg?: false) => {
  try {
    for (const id of Configs.AUTHORISED_USERS) {
      await bot?.telegram
        .sendMessage(id, normalizeMessage(msg), {
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        })
        .then(({ message_id }) => {
          if (deleteMsg) {
            setTimeout(() => {
              bot.telegram.deleteMessage(id, message_id),
                Configs.MESSAGE_INTERVAL!;
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  } catch (error: any) {
    console.log(error);
  }
};

export { bot, messageSender };
