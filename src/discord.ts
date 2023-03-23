import { Client, Message, ClientOptions } from "discord.js";

export class Discord {
    private readonly client: Client;
    private readonly token: string;

    constructor(token: string) {
        const clientOptions: ClientOptions = {
            intents: "DirectMessages"
        };

        this.client = new Client(clientOptions);
        this.token = token;
    }

    public async initDiscord() {
        await this.client.login(this.token);
    }

    public async sendMessage(channelId: string, message: string) {
        const channel = await this.client.channels.fetch(channelId);
    }
}