import { Substreams, download, unpack } from "substreams";
import { RabbitMq } from "./src/rabbitmq";
import { Telegram } from "./src/telegram";
import { timeout } from "./src/utils";

// default substreams options
export const MESSAGE_TYPE_NAME = 'pinax.substreams.sink.winston.v1.LoggerOperations';
export const DEFAULT_SUBSTREAMS_API_TOKEN_ENV = 'SUBSTREAMS_API_TOKEN';
export const DEFAULT_OUTPUT_MODULE = 'log_out';
export const DEFAULT_SUBSTREAMS_ENDPOINT = 'https://mainnet.eth.streamingfast.io:443';

// default user options
export const DEFAULT_USERNAME = 'guest';
export const DEFAULT_PASSWORD = 'guest';
export const DEFAULT_ADDRESS = 'localhost';
export const DEFAULT_PORT = 5672;

// default telegram options
export const DEFAULT_TELEGRAM_API_TOKEN_ENV = 'TELEGRAM_API_TOKEN';

export async function run(spkg: string, options: {
    // substreams options
    outputModule?: string,
    startBlock?: string,
    stopBlock?: string,
    substreamsEndpoint?: string,
    substreamsApiTokenEnvvar?: string,
    substreamsApiToken?: string,
    delayBeforeStart?: string,
    // user options
    username?: string,
    password?: string,
    address?: string,
    port?: string,
    // telegram options
    telegramApiTokenEnvvar?: string,
    telegramApiToken?: string,
} = {}) {
    // Substreams options
    const outputModule = options.outputModule ?? DEFAULT_OUTPUT_MODULE
    const substreamsEndpoint = options.substreamsEndpoint ?? DEFAULT_SUBSTREAMS_ENDPOINT
    const substreams_api_token_envvar = options.substreamsApiTokenEnvvar ?? DEFAULT_SUBSTREAMS_API_TOKEN_ENV
    const substreams_api_token = options.substreamsApiToken ?? process.env[substreams_api_token_envvar]

    // Telegram options
    const telegram_api_token_envvar = options.telegramApiTokenEnvvar ?? DEFAULT_TELEGRAM_API_TOKEN_ENV
    const telegram_api_token = options.telegramApiToken ?? process.env[telegram_api_token_envvar]

    // user options
    const username = options.username ?? DEFAULT_USERNAME;
    const password = options.password ?? DEFAULT_PASSWORD;
    const port = Number(options.port ?? DEFAULT_PORT);
    const address = options.address ?? DEFAULT_ADDRESS;

    // Required
    if (!outputModule) throw new Error('[output-module] is required')
    if (!substreams_api_token) throw new Error('[substreams-api-token] is required')
    if (!telegram_api_token) throw new Error('[telegram_api_token] is required')

    // Delay before start
    if (options.delayBeforeStart) await timeout(Number(options.delayBeforeStart) * 1000);

    // Download Substream from URL or IPFS
    const binary = await download(spkg);

    // Initialize Substreams
    const substreams = new Substreams(binary, outputModule, {
        host: substreamsEndpoint,
        startBlockNum: options.startBlock,
        stopBlockNum: options.stopBlock,
        authorization: substreams_api_token,
    });

    // Initialize RabbitMQ
    const rabbitMq = new RabbitMq(username, password, address, port);
    await rabbitMq.initQueue();

    // Initialize Telegram bot
    const telegramBot = new Telegram(telegram_api_token);

    // Find Protobuf message types from registry
    const { registry } = unpack(binary);
    const SocialsMessages = registry.findMessage(MESSAGE_TYPE_NAME);
    if (!SocialsMessages) throw new Error(`Could not find [${MESSAGE_TYPE_NAME}] message type`);

    substreams.on("mapOutput", async (output: any) => {
        if (!output.data.value.typeUrl.match(MESSAGE_TYPE_NAME)) return;
        const decoded = SocialsMessages.fromBinary(output.data.value.value);

        // Send messages to queue
        for (const socialsMessage of decoded.operations) {
            rabbitMq.sendToQueue(socialsMessage);
        }

        // Consumes messages from queue
        await rabbitMq.consumeQueue(async (socialsMessage: string) => {
            // Use an array of chatId
            await telegramBot.sendMessage('@substreams_socials_sink_test', socialsMessage);
        });

    });

    // start streaming Substream
    await substreams.start();
}
