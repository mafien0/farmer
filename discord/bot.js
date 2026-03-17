import { Client, Events, GatewayIntentBits } from "discord.js";
import { registerCommands, createCommandHandler } from "./commandsHandler.js";
import { sendBotMsg } from "../mineflayer/bot.js";
import { messageUpdate } from "./updateService.js";

import config from "../config.json" with { type: "json" };
const channelIDs = config.discord.channels;

export function createBot() {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
		],
	});

	client.once(Events.ClientReady, async (c) => {
		console.log(`Discord bot logged in as ${c.user.tag}`);

		const token = process.env.DISCORD_TOKEN;
		if (token) {
			await registerCommands(c.user.id, token);
		}
	});

	// Discord -> minecraft chat
	client.on("messageCreate", (msg) => {
		if (msg.channel.id === channelIDs.chat && !msg.author.bot) {
			// Delete the message
			msg.delete().catch(console.error);

			// Send it to minecraft
			sendBotMsg(msg.content);

			// Log
			console.log(
				`Send msg to minecraft: [${msg.author.username}] ${msg.content}`,
			);
			messageUpdate(`${msg.author.username} send: \n${msg.content}`);
		}
	});

	createCommandHandler(client).catch(console.error);

	return client;
}
