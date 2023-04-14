#!/usr/bin/env node

import { cli } from "substreams-sink";
import { action, DEFAULT_TELEGRAM_API_TOKEN_ENV } from "../index.js"
import pkg from "../package.json";

const program = cli.program(pkg);
const command = cli.run(program, pkg);

command.requiredOption('-c --chat-id <string>', 'Telegram chat ID')
command.option('--telegram-api-token <string>', 'API token for the Telegram bot')
command.option('--telegram-api-token-envvar <string>', 'Environnement variable name of the API token for the Telegram bot', DEFAULT_TELEGRAM_API_TOKEN_ENV)

command.action(action);
program.parse();
