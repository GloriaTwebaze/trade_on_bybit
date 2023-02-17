import { Context, Markup, Telegraf } from "telegraf";
import { symbolName } from "typescript";
import { Configs } from "../config";
import { BybitService } from "../exchange";
import { bybitService } from "../utils/bybitInit";
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
  Context.reply(
    "welcome to Gloe's trade_bot, what do you want to do today?",
    Markup.inlineKeyboard([
      Markup.button.callback("check balance", "getbalance"),
      Markup.button.callback("Buy", "placelimitorder"),
      Markup.button.callback("Sell", "exitposition"),
      Markup.button.callback("close order", "cancellimitorder"),
    ])
  );

  bot.action("getbalance", async (ctx) => {
    const { USDT }: any = await bybitService.getBalance({ coin: "USDT" });
    if (USDT) {
      let message = `*\USDT\*`;
      message += `\n Equity: \`${USDT["equity"]}\``;
      message += `\n Available balance: \`${USDT["available_balance"]}\``;
      message += `\n Used margin: \`${USDT["used_margin"]}\``;
      message += `\n order margin: \`${USDT["order_margin"]}\``;
      message += `\n position margin: \`${USDT["position_margin"]}\``;
      ctx.reply("Here is your balance");
      messageSender(message, false);
    }
  });

  bot.action("placelimitorder", async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback("Buy 2 BTC", "buy"),
      Markup.button.callback("Cancel order", "exit"),
    ]);
    ctx.reply("confirm order", keyboard);
    bot.action("buy", async (ctx) => {
      const price: any = Number(await bybitService.getPrice("BTCUSDT"));
      let message = "";
      const { result }: any = await bybitService.placeOrder({
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
        ctx.reply("Bought some coins 🤑 for you");
        messageSender(message, false);
      }
    });
    bot.action("exit", async (ctx) => {
      ctx.leaveChat();
      messageSender("chat exited", false);
    });
  });
  bot.action("exitposition", async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback("Sell 2 BTC", "sell"),
      Markup.button.callback("Cancel order", "exit"),
    ]);
    ctx.reply("confirm order", keyboard);
    bot.action("sell", async (ctx) => {
      let message = `*\Limit order placed\*`;
      const price: any = Number(await bybitService.getPrice("BTCUSDT"));
      const { ret_msg, result, ret_code }: any = await bybitService.placeOrder({
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
        message = `*\Exited buy position\*`;
        messageSender(message);
      } else {
        message = "current position is zero, place more position to exit";
        messageSender(message);
      }
    });
    bot.action("exit", async(ctx)=>{
      ctx.leaveChat()
      messageSender("chat exited",false)
    })
  });

  bot.action("cancellimitorder", async(ctx)=>{
    const result = await bybitService.closeOrder({ symbol: "BTCUSDT" });
  if (result === true) {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback("Close order", "cancelorder"),
    ]);
    ctx.reply("please confirm", keyboard);
  }
  bot.action("cancelorder", async (ctx) => {
    // Call the close order function here
    const closeResult = await bybitService.closeOrder({ symbol: "BTCUSDT" });
    if (closeResult === true) {
      ctx.reply("Order has been cancelled.");
    } else {
      ctx.reply("Failed to cancel the order.");
    }
  });
  messageSender("", false);
  })
});
// display balance details
bot.command("getbalance", async (Context) => {
  const { USDT }: any = await bybitService.getBalance({ coin: "USDT" });
  let message = `*\USDT\*`;
  message += `\n Equity: \`${USDT["equity"]}\``;
  message += `\n Available balance: \`${USDT["available_balance"]}\``;
  message += `\n Used margin: \`${USDT["used_margin"]}\``;
  message += `\n order margin: \`${USDT["order_margin"]}\``;
  message += `\n position margin: \`${USDT["position_margin"]}\``;
  messageSender(message, false);
});
//placed order

bot.command("placelimitorder", async (ctx) => {
  const price: any = Number(await bybitService.getPrice("BTCUSDT"));
  let message = "";
  const { result }: any = await bybitService.placeOrder({
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
  const price: any = Number(await bybitService.getPrice("BTCUSDT"));
  const { ret_msg, result, ret_code }: any = await bybitService.placeOrder({
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
bot.command("cancellimitorder", async (ctx) => {
  const result = await bybitService.closeOrder({ symbol: "BTCUSDT" });
  if (result === true) {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback("Close order", "cancelorder"),
    ]);
    ctx.reply("please confirm", keyboard);
  }
  bot.action("cancelorder", async (ctx) => {
    // Call the close order function here
    const closeResult = await bybitService.closeOrder({ symbol: "BTCUSDT" });
    if (closeResult === true) {
      ctx.reply("Order has been cancelled.");
    } else {
      ctx.reply("Failed to cancel the order.");
    }
  });
  messageSender("", false);
});

// chasing the order
bot.command("chaselimitorder", async () => {
  const resp = await bybitService.chaseOrder({
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
