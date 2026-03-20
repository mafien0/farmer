import { discordLogger as logger } from "../logger.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { registerCommands, createCommandHandler } from "./commandsHandler.js";
import { sendBotMsg } from "../mineflayer/bot.js";
import { messageUpdate } from "./updateService.js";
import { serverInit } from "./guildHandler.js";

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

	client.on("guildCreate", async (guild) => {
		logger.info(`Bot joined a new server ${guild.name}; ${guild.id}`);
		await serverInit(guild);
	});

	client.once(Events.ClientReady, async (client) => {
		logger.info(`bot logged in as ${client.user.tag}`);

		const token = process.env.DISCORD_TOKEN;
		if (token) {
			await registerCommands(client.user.id, token);
		}
	});

	// Discord -> minecraft chat
	client.on("messageCreate", (msg) => {
		if (msg.channel.id === channelIDs.chat && !msg.author.bot) {
			// Delete the message
			msg.delete().catch(logger.error);

			// Send it to minecraft
			sendBotMsg(msg.content);

			// Log
			logger.info("Received a message");
			messageUpdate(`${msg.author.username} send: ${msg.content}`);
		}
	});

	createCommandHandler(client).catch(logger.error);

	return client;
}
