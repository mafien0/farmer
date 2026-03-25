import { mineflayerLogger as logger } from "../logger.js";
import mineflayer from "mineflayer";
import { attachListeners } from "./listeners.js";

import { disconnectUpdate, reconnectUpdate } from "../discord/updateService.js";

import config from "../config.json" with { type: "json" };
const mfconfig = config.mineflayer;

const BASE_RECONNECT_TIMEOUT = mfconfig.base_reconnect_timeout || 5000;
const MAX_RECONNECT_ATTEMPTS = mfconfig.max_reconnect_attempts || 5;
let reconnectAttempts = 0;
let reconnectDelay = BASE_RECONNECT_TIMEOUT;

// Will be assigned/re-assigned on connect
export let bot;
export let shouldReconnect = true;
let reconnectTimeout;

export async function connect() {
	logger.info("Connecting...");
	try {
		bot = mineflayer.createBot({
			host: mfconfig.host || "localhost",
			port: mfconfig.port || 25565,
			username: mfconfig.username || "bot",
			version: mfconfig.version || "1.21.11",
			physicsEnabled: true,
		});
		attachListeners(bot);

		bot.on("spawn", () => {
			// reset counters to their default state
			if (reconnectTimeout) clearTimeout(reconnectTimeout);
			reconnectAttempts = 0;
			reconnectDelay = BASE_RECONNECT_TIMEOUT;
			shouldReconnect = true;
		});
	} catch (error) {
		logger.error(`Failed to create bot: ${error.message}`);
		scheduleReconnect();
	}
}

// Used in a discord command
export function disconnect() {
	logger.info("Quiting...");
	shouldReconnect = false;
	bot.quit();
	disconnectUpdate("Manual disconnect");
	return true;
}

// Used in a discord command
export function reconnect() {
	logger.info("Reconnecting...");
	// Try to end the bot
	// It will automaticly reconnect because of `on("end")` listener
	try {
		bot.quit("reconnect");
	} catch {}
	return true;
}

export async function scheduleReconnect() {
	if (reconnectTimeout) clearTimeout(reconnectTimeout);
	if (!shouldReconnect) return;

	reconnectAttempts += 1;
	if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
		logger.error("Max reconnect attempts reached, exiting...");
		process.exit(1);
	}

	// Assign current reconnect delay
	const delay = reconnectDelay;

	// Calculate next reconnect delay
	reconnectDelay = Math.min(reconnectDelay * 2, 60000);

	reconnectUpdate(
		`Reconnecting in ${delay / 1000} seconds... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
	);

	reconnectTimeout = setTimeout(() => {
		if (shouldReconnect) connect();
	}, delay);
}

export function sendBotMsg(msg) {
	bot.chat(msg);
}
