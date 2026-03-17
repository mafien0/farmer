import "dotenv/config";

import { mineflayerLogger, discordLogger } from "./logger.js";

import { createBot } from "./discord/bot.js";
import { setDiscordClient, initChannels } from "./discord/messageService.js";
import { createStatusMsg } from "./discord/statusService.js";

import { connect } from "./mineflayer/bot.js";

// Connect discord bot
const discord = createBot();
const token = process.env.DISCORD_TOKEN;

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

// Initialize bot
setTimeout(async () => {
	mineflayerLogger.info("Connecting");
	const mineflayer = await connect();
}, 5000);
