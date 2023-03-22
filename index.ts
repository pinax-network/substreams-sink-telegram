import { Substreams, download, unpack } from "substreams";
import { timeout } from "./src/utils";

// default substreams options
export const MESSAGE_TYPE_NAME = 'pinax.substreams.sink.socials.v1.Messages'
export const DEFAULT_API_TOKEN_ENV = 'SUBSTREAMS_API_TOKEN'
export const DEFAULT_OUTPUT_MODULE = 'socials_out'
export const DEFAULT_SUBSTREAMS_ENDPOINT = 'https://mainnet.eth.streamingfast.io:443'

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
} = {}) {
    // substreams options
    const outputModule = options.outputModule ?? DEFAULT_OUTPUT_MODULE
    const substreamsEndpoint = options.substreamsEndpoint ?? DEFAULT_SUBSTREAMS_ENDPOINT
    const api_token_envvar = options.substreamsApiTokenEnvvar ?? DEFAULT_API_TOKEN_ENV
    const api_token = options.substreamsApiToken ?? process.env[api_token_envvar]

    // 
    if (!outputModule) throw new Error('[output-module] is required')
    if (!api_token) throw new Error('[substreams-api-token] is required')

    // delay before start
    if (options.delayBeforeStart) await timeout(Number(options.delayBeforeStart) * 1000);

    // Download Substream from URL or IPFS
    const binary = await download(spkg);

    // Initialize Substreams
    const substreams = new Substreams(binary, outputModule, {
        host: substreamsEndpoint,
        startBlockNum: options.startBlock,
        stopBlockNum: options.stopBlock,
        authorization: api_token,
    });

    // Find Protobuf message types from registry
    const { registry } = unpack(binary);
    const SocialsMessages = registry.findMessage(MESSAGE_TYPE_NAME);
    if (!SocialsMessages) throw new Error(`Could not find [${MESSAGE_TYPE_NAME}] message type`);

    substreams.on("mapOutput", (output: any) => {
        if (!output.data.value.typeUrl.match(MESSAGE_TYPE_NAME)) return;
        const decoded = SocialsMessages.fromBinary(output.data.value.value);
        for (const socialsMessages of decoded.messages) {
            console.log(socialsMessages);
        }
    });

    // start streaming Substream
    await substreams.start();
}
