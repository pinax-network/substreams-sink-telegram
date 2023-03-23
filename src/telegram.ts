import TelegramBot from "node-telegram-bot-api";

export class Telegram {
    private readonly bot: TelegramBot;

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    public async sendMessage(message: string) {
        await this.bot.sendMessage('@substreams_socials_sink_test', message);
    }
}