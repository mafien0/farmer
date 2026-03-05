import mineflayer from "mineflayer";
import config from "../config.json" with { type: "json" };

export async function connect() {
	return mineflayer.createBot({
		host: config.bot.host || "localhost",
		port: config.bot.port || 25565,
		username: config.bot.username || "bot",
		version: config.bot.version || "1.21.11",
	});
}
