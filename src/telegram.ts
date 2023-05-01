import TelegramBot, { ParseMode } from "node-telegram-bot-api";
import { logger } from "substreams-sink";
import { z } from "zod";

export const TelegramConfigSchema = z.object({
    parse_mode: z.enum(["MarkdownV2", "HTML"]).default("MarkdownV2"),
});

export type TelegramConfig = z.infer<typeof TelegramConfigSchema>;

export class Telegram {
    private readonly bot: TelegramBot;

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    public async sendMessage(chatId: string, message: string, config: TelegramConfig) {
        try {
            switch (config.parse_mode) {
                case 'MarkdownV2':
                    message = message.replace(/([|{}+#>!=\-.])/gm, '\\$1');
                    break;
                case 'HTML':
                    break;
                default:
                    break;
            }

            await this.bot.sendMessage(chatId, message, { parse_mode: config.parse_mode as ParseMode });
        } catch (error: any) {
            if (error.code === 'ETELEGRAM') {
                logger.error({ code: error.response.statusCode, message: error.response.body.description });
            } else {
                logger.error(error);
            }
        }
    }
}