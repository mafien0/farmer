import { ChannelType } from "discord.js";
import { discordLogger as logger } from "../logger.js";
import config from "../config.json" with { type: "json" };

async function createCategory(guild, name) {
	const category = await guild.channels.create({
		name: name,
		type: ChannelType.GuildCategory,
	});
	return category.id;
}

async function createChannel(guild, parentID, name) {
	const channel = await guild.channels.create({
		name: name,
		type: ChannelType.GuildText,
		parent: parentID,
	});
	return channel.id;
}

export async function serverInit(newGuild) {
	const guildID = config.discord.guild ?? process.env.DISCORD_GUILD_ID;
	const guild = await client.guilds.fetch(newGuild.id).catch(() => null);

	// Check for unconfigured guilds
	if (guildID !== newGuild.id) {
		logger.info("Bot connected to a server, but this is wrong one.");
		if (guild.systemChannel) {
			await guild.systemChannel
				.send(
					"This bot is not configured for this server. Please remove it. **ITS NOT GOING TO WORK THERE**.\nIf you are the bot owner, please check you config under `discord.guild`.",
				)
				.catch(() => {});
		}
		guild.leave();
		return;
	}

	const channelConfig = config.discord.channels;

	// Init channel category
	const category = await createCategory(guild, "farmer");

	// Init channel and write their ID's into config
	channelConfig.chat = await createChannel(guild, category, "chat");
	channelConfig.status = await createChannel(guild, category, "status");
	channelConfig.updates = await createChannel(guild, category, "updates");
}
