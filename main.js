import "@std/dotenv/load";
import "./configHandler.js";
import { discordLogger } from "./logger.js";
import { createBot } from "./discord/bot.js";
import { setDiscordClient, initChannels } from "./discord/messageService.js";
import { createStatusMsg } from "./discord/statusService.js";

if (import.meta.main) {
	// Connect discord bot
	const discord = createBot();
	const token = Deno.env.get("DISCORD_TOKEN");

	if (!token) {
		throw new Error("DISCORD_TOKEN environment variable is required");
	}

	discordLogger.info("Connecting to Discord");
	discord.login(token).then(() => {
		discordLogger.info("bot is up");
		setDiscordClient(discord);
		initChannels().then(() => {
			createStatusMsg();
		});
	});
}
