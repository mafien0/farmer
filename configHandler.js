import { commonLogger as logger } from "./logger.js";
import fs from "fs";
import config from "./config.json" with { type: "json" };

export function createConfigFile() {
	// If no `default_config.json` - error
	if (!fs.existsSync("./default_config.json")) {
		throw new Error("default_config.json is missing");
	}
	// If no `config.json` - copy it from `default_config.json`
	if (!fs.existsSync("./config.json")) {
		logger.info("No config file is present, creating a new one");
		fs.cpSync("./default_config.json", "./config.json");
	}
}

export function writeConfig(UPDconfig) {
	try {
		fs.writeFileSync("config.json", JSON.stringify(UPDconfig, null, "\t"));
		logger.info("Writen config.json");
	} catch (error) {
		logger.error(
			`in writeConfig(): Failed to write config.json: ${error.message}`,
		);
	}
}

export function updateChannel(type, id) {
	config.discord.channels[type] = id;
	writeConfig(config);
}

export function updateGuildID(id) {
	config.discord.guild = id;
	writeConfig(config);
}

export function updateIP(ip) {
	// Find if port is present, if not - default to "25565"
	const idx = ip.indexOf(":");
	const host = idx !== -1 ? ip.slice(0, idx) : ip;
	const port = idx !== -1 ? ip.slice(idx + 1) : "25565";

	// Write the config
	config.mineflayer.host = host;
	config.mineflayer.port = port;
	writeConfig(config);
}

export function updateUsername(username) {
	config.mineflayer.username = username;
	writeConfig(config);
}

export function updateVersion(version) {
	config.mineflayer.version = version;
	writeConfig(config);
}

export function updateBaseReconnectTimeout(baseReconnectTimeout) {
	config.mineflayer.base_reconnect_timeout = baseReconnectTimeout;
	writeConfig(config);
}

export function updateMaxReconnectAttempts(maxReconnectAttempts) {
	config.mineflayer.max_reconnect_attempts = maxReconnectAttempts;
	writeConfig(config);
}
