import { Context, Telegraf } from "telegraf";
import { Configs } from "../config";
import { BybitService } from "../exchange";
import { normalizeMessage } from "../utils/telgram";

const bot = new Telegraf(Configs.BOT_TOKEN);

bot.start((Context) => {
  Context.reply("welcome to bybit_08_bot");
});
bot.command("getBalance", async (Context) => {
  const botKeys = {
    key: Configs.API_KEY,
    baseUrl: Configs.MAIN_URL,
    secret: Configs.SECRET_API,
    testnet: true,
  };
  const byserve = new BybitService(botKeys);
  const { USDT }: any = await byserve.getBalance({ coin: "USDT" });
  let message = `*\USDT\*`;
  message += `\n Equity: \`${USDT["equity"]}\``;
  message += `\n Available balance: \`${USDT["available_balance"]}\``;
  message += `\n Used margin: \`${USDT["used_margin"]}\``;
  message += `\n order margin: \`${USDT["order_margin"]}\``;
  message += `\n position margin: \`${USDT["position_margin"]}\``;
  messageSender(message, false);
});
bot.command("placeLimitOrder", async (ctx) => {
  const botKeys = {
    key: Configs.API_KEY,
    baseUrl: Configs.MAIN_URL,
    secret: Configs.SECRET_API,
    testnet: true,
  };
  const byserve = new BybitService(botKeys);
  const price: any = Number(await byserve.getPrice("BTCUSDT"));
  console.log(typeof(price), "...............");
  const qty = 2;
  const resp = await byserve.placeOrder({
    symbol: "BTCUSDT",
    side: "Buy",
    order_type: "Limit",
    qty,
    time_in_force: "GoodTillCancel",
    price,
    reduce_only: false,
    close_on_trigger: false,
    position_idx: 0,
  });
  let message = `*\Limit order placed\*`;
  message += `${resp?.symbol}`;
  message += `\n user Id: \`${resp?.user_id}\``;
  message += `\n Symbol: \`${resp?.symbol}\``;
  message += `\n Side: \`${resp?.side}\``;
  message += `\n Price: \`${resp?.price}\``;
  message += `\n Quantity: \`${resp?.qty}\``;
  messageSender(message, false);
});

const messageSender = async (msg: string, deleteMsg: boolean) => {
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
