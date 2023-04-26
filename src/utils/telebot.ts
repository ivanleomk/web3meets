import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY as string);

export const sendTelegramMessage = async (message: string) => {
  const res = await bot.sendMessage(process.env.GROUP_ID as string, message, {
    parse_mode: "MarkdownV2",
  });
  return res;
};
