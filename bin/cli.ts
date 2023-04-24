#!/usr/bin/env node

import { cli, logger } from "substreams-sink";
import fs from "fs";

import { action, DEFAULT_TELEGRAM_API_TOKEN_ENV } from "../index.js"
import pkg from "../package.json";

const program = cli.program(pkg);
const command = cli.run(program, pkg);

command.requiredOption('-c --config <string>', 'Config file path')
command.option('--telegram-api-token <string>', 'API token for the Telegram bot')
command.option('--telegram-api-token-envvar <string>', 'Environnement variable name of the API token for the Telegram bot', DEFAULT_TELEGRAM_API_TOKEN_ENV)

command.action(action);
program.parse();

const options = command.opts();
if (options.config) {
    if (!fs.existsSync(options.config)) {
        logger.error(`file '${options.config}' does not exist`);
        process.exit(1);
    }
}