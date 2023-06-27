import { fetchSubstream } from "@substreams/core";
import { run, logger, cli } from "substreams-sink";
import { Social } from "substreams-sink-socials";

import { Telegram, TelegramConfigSchema } from "./src/telegram.js";

import pkg from "./package.json" assert { type: "json" };

logger.setName(pkg.name);
export { logger };

// default telegram options
export const DEFAULT_TELEGRAM_API_TOKEN_ENV = 'TELEGRAM_API_TOKEN';

// Custom user options interface
interface ActionOptions extends cli.RunOptions {
    config: string,
    telegramApiTokenEnvvar: string,
    telegramApiToken: string,
}

export async function action(options: ActionOptions) {
    // Download substreams
    const spkg = await fetchSubstream(options.manifest!);

    // Get command options
    const { config, telegramApiTokenEnvvar, telegramApiToken } = options;

    // Social setup
    let social: Social = new Social(config, TelegramConfigSchema, 1500);

    // Telegram options
    const telegram_api_token = telegramApiToken ?? process.env[telegramApiTokenEnvvar];

    if (!telegram_api_token) {
        logger.error('[telegram_api_token] is required');
        process.exit(1);
    }

    // Initialize Telegram bot
    const telegramBot = new Telegram(telegram_api_token);

    // Run substreams
    const substreams = run(spkg, options);

    substreams.on("anyMessage", async (messages) => {
        await social.distributeMessages(messages as any, (chatId, message, config) => {
            telegramBot.sendMessage(chatId, message, config);
        });
    });

    substreams.start(options.delayBeforeStart);
}
