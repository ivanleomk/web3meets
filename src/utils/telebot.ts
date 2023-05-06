import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY as string);

export const sendTelegramMessage = async (
  message: string,
  group_id: string
) => {
  console.log(message, group_id);
  const res = await bot.sendMessage(group_id, message, {
    parse_mode: "MarkdownV2",
  });
  return res;
};
