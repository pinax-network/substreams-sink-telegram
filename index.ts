import { EntityChanges, download } from "substreams";
import { run, logger, RunOptions } from "substreams-sink";
import fs from "fs";
import YAML from "yaml";
import path from "path";
import PQueue from "p-queue";
import { ZodError } from "zod";

import { Telegram, TelegramConfig, TelegramConfigsSchema } from "./src/telegram";

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

    // Read config file
    let configs: any[] = [];
    const ext: string = path.extname(config);
    const rawConfigs = fs.readFileSync(config, 'utf-8');

    try {
        if (ext === '.json') {
            configs = TelegramConfigsSchema.parse(JSON.parse(rawConfigs));
        } else if (ext === '.yml' || ext === '.yaml') {
            configs = TelegramConfigsSchema.parse(YAML.parse(rawConfigs));
        }
    } catch (error) {
        if (error instanceof ZodError) {
            logger.error(JSON.stringify(error));
        } else {
            logger.error(error);
        }
        process.exit(1);
    }


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

    // Initialize PQueue
    const queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 1000 });

    substreams.on("anyMessage", async (message: EntityChanges) => {

        message.entityChanges.forEach(async (entityChange) => {

            configs.forEach(async (conf: TelegramConfig) => {

                if (entityChange.entity === conf.entity) {

                    let formattedMessage: string = conf.message;

                    entityChange.fields.forEach(async (field) => {
                        formattedMessage = formattedMessage.replaceAll(`{${field.name}}`, field.newValue?.typed.value as string); // TODO make a null check
                    });

                    conf.chat_ids.forEach(async (chatId: string) => {
                        await queue.add(() => telegramBot.sendMessage(chatId, formattedMessage, conf.parse_mode));
                    });
                }
            });
        });
    });

    substreams.start(options.delayBeforeStart);
}
