import { discordLogger as logger } from "../logger.js";
import { createStatusEmbed } from "./embeds.js";
import { sendEmbedMsg, wipeMessages } from "./messageService.js";

let statusMsg;

const status = {
	status: "offline",
	name: null,
	health: null,
	hunger: null,
	ping: null,
	coords: null,
	dimension: null,
	info: "No info specified",
};

function fetchStatus(bot) {
	if (!bot) {
		logger.error("in fetchStatus(): `bot` cannot be empty");
		return;
	}

	status.status = "Online";
	status.name = bot.username;
	status.health = bot.health;
	status.hunger = bot.food;
	status.ping = bot.player.ping;
	status.dimension = bot.game.dimension;

	// Position
	if (bot.entity?.position) {
		const pos = bot.entity.position;
		status.coords = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${
			pos.z.toFixed(1)
		}`;
	}
}

export async function createStatusMsg() {
	// Delete all old messages in the channel
	try {
		await wipeMessages("status");
	} catch (error) {
		logger.warn(
			`in createStatusMsg(): Failed to wipe messages in status channel: ${error.message}`,
		);
	}

	// Send a new one
	try {
		const embed = createStatusEmbed(status);
		const msg = await sendEmbedMsg(embed, "status");
		statusMsg = msg;

		logger.info(`Sent initial status message ${msg.id}`);
		return msg;
	} catch (error) {
		logger.error(`Failed to create status message: ${error.message}`);
		return;
	}
}

export async function updateStatus(bot) {
	// Fetch bot status if bot is provided
	if (bot) {
		fetchStatus(bot);
	} else {
		// Bot is offline
		status.status = "Offline";
	}

	// If there is no status message, create a new one
	if (!statusMsg) {
		await createStatusMsg();
		return;
	}
	try {
		const channel = statusMsg.channel;
		await channel.messages.fetch(statusMsg.id);
	} catch (error) {
		logger.warn(
			`Status message ${statusMsg.id} not found, creating new one: ${error.message}`,
		);
		await createStatusMsg();
		return;
	}

	// If there is, try to update it
	try {
		const embed = createStatusEmbed(status);
		await statusMsg.edit({ embeds: [embed] });
	} catch (error) {
		// Unknown Message
		if (error.code === 10008) {
			logger.warn(
				`Status message ${statusMsg.id} no longer exists, creating new one`,
			);
			await createStatusMsg();
		} else {
			logger.error(`Failed to update status message: ${error.message}`);
		}
	}
}
