import { download } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import { Telegram } from "./src/telegram";

import pkg from "./package.json";

logger.defaultMeta = { service: pkg.name };
export { logger };

// default telegram options
export const DEFAULT_TELEGRAM_API_TOKEN_ENV = 'TELEGRAM_API_TOKEN';

// Custom user options interface
interface ActionOptions extends RunOptions {
    telegramApiTokenEnvvar: string,
    telegramApiToken: string,
}

export async function action(manifest: string, moduleName: string, options: ActionOptions) {
    // Download substreams
    const spkg = await download(manifest);

    // Get command options
    const { telegramApiTokenEnvvar, telegramApiToken } = options;

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

    substreams.on("anyMessage", async (message: any) => {

        await telegramBot.sendMessage('@substreams_socials_sink_test', message);
        logger.info(JSON.stringify({ message: message }));

    });

    substreams.start(options.delayBeforeStart);
}
