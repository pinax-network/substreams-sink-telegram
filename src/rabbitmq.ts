import { logger } from "./logger";
import client, { Connection, Channel } from "amqplib";

const QUEUE_NAME: string = 'messages';

let connection: Connection;
let channel: Channel

export async function initQueue(username: string, password: string, address: string, port: number) {
    connection = await client.connect(`amqp://${username}:${password}@${address}:${port}`);

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
}

export function addToQueue(message: string) {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
}