import { EntityChanges, download } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import { Social } from "substreams-sink-socials";

import { Telegram, TelegramConfigSchema } from "./src/telegram";

import pkg from "./package.json";

logger.defaultMeta = { service: pkg.name };
export { logger };

// default telegram options
export const DEFAULT_TELEGRAM_API_TOKEN_ENV = 'TELEGRAM_API_TOKEN';

// Custom user options interface
interface ActionOptions extends RunOptions {
    config: string,
    telegramApiTokenEnvvar: string,
    telegramApiToken: string,
}

export async function action(manifest: string, moduleName: string, options: ActionOptions) {
    // Download substreams
    const spkg = await download(manifest);

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
    const substreams = run(spkg, moduleName, options);

    substreams.on("anyMessage", async (messages: EntityChanges) => {
        await social.distributeMessages(messages, (chatId, message, config) => {
            telegramBot.sendMessage(chatId, message, config);
        });
    });

    substreams.start(options.delayBeforeStart);
}
