import TelegramBot, { ParseMode } from "node-telegram-bot-api";
import { logger } from "substreams-sink";
import { z } from "zod";

import { timeout } from "./utils";

const TelegramConfigSchema = z.object({
    entity: z.string(),
    parse_mode: z.enum(["MarkdownV2", "HTML"]).optional(),
    chat_ids: z.array(z.string()),
    message: z.string()
});

export const TelegramConfigsSchema = z.array(TelegramConfigSchema);
export type TelegramConfig = z.infer<typeof TelegramConfigSchema>;

export class Telegram {
    private readonly bot: TelegramBot;

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    public async sendMessage(chatId: string, message: string, parseMode: string = 'MarkdownV2') {
        try {
            switch (parseMode) {
                case 'MarkdownV2':
                    message = message.replace(/([|{}+#>!=\-.])/gm, '\\$1');
                    break;
                case 'HTML':
                    break;
                default:
                    break;
            }

            await this.bot.sendMessage(chatId, message, { parse_mode: parseMode as ParseMode });
        } catch (error: any) {
            if (error.code === 'ETELEGRAM') {
                switch (error.response.statusCode) {
                    case 429:
                        const retryAfter = error.response.body.parameters.retry_after;
                        logger.warn(`Too many requests retrying in ${retryAfter} seconds`);
                        await timeout(retryAfter * 1000);
                        await this.sendMessage(chatId, message);
                        break;
                    default:
                        logger.error({ code: error.response.statusCode, message: error.response.body.description });
                        break;
                }
            } else {
                logger.error('failed to send message');
            }

        }
    }
}