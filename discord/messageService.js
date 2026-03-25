import { discordLogger as logger } from "../logger.js";
import config from "../config.json" with { type: "json" };
let channelIDs = config.discord.channels;

export function updateChannelIDs() {
	channelIDs = config.discord.channels;
}

// Hold a reference to the Discord client, set from index.js
let client = null;

// Channels will be filled on bot login
const CHANNELS = {
	chat: null,
	status: null,
	updates: null,
};

// Get discord client generated in `../index.js`
// Called after client login
export function setDiscordClient(discordClient) {
	if (!discordClient) {
		logger.error("in setDiscordClient(): No message provided");
		return;
	}

	client = discordClient;
}

// Util function to get channel by its id
async function getChannelById(id) {
	if (!id) {
		logger.error("In getChannelById(): No id provided");
		return;
	}
	if (!client) {
		logger.error("in getChannelById(): Client is initialized");
		return;
	}

	try {
		// Fetch channel
		const channel = await client.channels.fetch(id);

		// Validate if channel exists and is it text channel
		if (!channel) {
			logger.error(`In getChannelById(): Channel not found for ID: ${id}`);
			return;
		}
		if (!channel.isTextBased()) {
			logger.error(`In getChannelById(): Channel ${id} is not text-based`);
			return;
		}

		// Return it
		return channel;
	} catch (error) {
		logger.error(
			`in getChannelByID(): Failed to fetch channel ${id}: ${error.message}`,
		);
		return;
	}
}

// Initialize channels for CHANNELS object
// Called after client login
export async function initChannels() {
	try {
		CHANNELS.chat = await getChannelById(channelIDs.chat);
		CHANNELS.status = await getChannelById(channelIDs.status);
		CHANNELS.updates = await getChannelById(channelIDs.updates);
		logger.info("All Discord channels initialized successfully");
	} catch (error) {
		logger.error(
			`in initChannels(): Failed to initialize channels: ${error.message}`,
		);
		return;
	}
}

// Send messages function
export async function sendMsg(msg, channelType = "chat") {
	if (!msg) {
		logger.error("in sendMsg(): Tried to send a message, but to msg provided");
		return;
	}

	// If channels not yet initialized
	if (!CHANNELS[channelType] && channelType !== "status") {
		setTimeout(() => sendMsg(msg, channelType), 1000);
	}

	try {
		logger.info(`Sending message to "${channelType}" channel`);
		return await CHANNELS[channelType].send(msg);
	} catch (error) {
		logger.error(
			`in sendMsg(): Failed to send message to "${channelType}" channel: ${error.message}`,
		);
		return;
	}
}
export const sendEmbedMsg = async (msg, channelType = "chat") =>
	sendMsg({ embeds: [msg] }, channelType);

// Wipe messaged util function
export async function wipeMessages(channelType = "status", limit = 100) {
	const channel = CHANNELS[channelType];
	const messages = await channel.messages.fetch({ limit });

	// Split by age
	// < 14d old
	const recent = messages.filter(
		(m) => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000,
	);
	// > 14d old
	const old = messages.filter(
		(m) => Date.now() - m.createdTimestamp >= 14 * 24 * 60 * 60 * 1000,
	);

	// Bulk delete recent messages
	if (recent.size > 0) await channel.bulkDelete(recent);

	// Delete old messages one-by-one
	for (const [, msg] of old) {
		await msg.delete().catch(logger.error);
		// With .5 second delay to prevent rate limiting
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
}
