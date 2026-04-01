import { ChannelType } from "discord.js";
import { discordLogger as logger } from "@/logger.js";
import { registerCommands } from "@/discord/commandsHandler.js";
import { updateChannel, updateGuildID } from "@/configHandler.js";
import { config } from "@/configHandler.js";

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

export async function serverInit(client, newGuild) {
	if (Deno.env.get("DISCORD_GUILD_ID")) {
		updateGuildID(Deno.env.get("DISCORD_GUILD_ID"));
	}
	const guildID = config.discord.guild;
	const guild = await client.guilds.fetch(newGuild.id).catch(() => null);

	// Check for unconfigured guilds
	if (guildID !== newGuild.id) {
		logger.warn(`Bot connected to a server, but this is wrong one. guild: ${guildID}; new guild: ${newGuild.id}`);
		if (guild.systemChannel) {
			await guild.systemChannel
				.send(
					"This bot is not configured for this server. Please remove it. **ITS NOT GOING TO WORK THERE**.\nIf you are the bot owner, please check your config under `discord.guild` or `DISCORD_GUILD_ID` env variable.",
				)
				// If cannot send a message, just ignore that
				.catch(() => {});
		}
		guild.leave();
		return;
	}

	// Register commands
	const token = Deno.env.get("DISCORD_TOKEN");
	if (token) {
		// No need to await
		registerCommands(client.user.id, token);
	}

	try {
		// Init channel category
		const category = await createCategory(guild, "farmer");

		// Init channel and write their ID's into config
		updateChannel("chat", await createChannel(guild, category, "chat"));
		updateChannel("status", await createChannel(guild, category, "status"));
		updateChannel("updates", await createChannel(guild, category, "updates"));
	} catch {
		console.warn(
			`Tried to create channels in ${guild.name}, but cannot(probably lack of permissions)`,
		);
	}
}
