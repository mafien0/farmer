import { discordLogger as logger } from "../logger.js";
import { REST, Routes, MessageFlags } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
	const commands = [];
	const commandsPath = path.join(__dirname, "commands");

	// Recursive directory scanning
	function scanDirectory(dir) {
		const items = fs.readdirSync(dir, { withFileTypes: true });

		for (const item of items) {
			const filePath = path.join(dir, item.name);

			if (item.isDirectory()) {
				scanDirectory(filePath);
			} else if (item.name.endsWith(".js")) {
				commands.push(filePath);
			}
		}
	}

	scanDirectory(commandsPath);

	const loadedCommands = [];
	for (const filePath of commands) {
		try {
			const command = await import(`file://${filePath}`);

			if ("data" in command && "execute" in command) {
				logger.info(`Loaded command: ${command.data.name}`);
				loadedCommands.push(command.data.toJSON());
			} else {
				logger.warn(
					`The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		} catch (error) {
			logger.error(`Failed to load command from ${filePath}:`, error);
		}
	}

	return loadedCommands;
}

export async function registerCommands(clientId, token) {
	const commands = await loadCommands();
	const rest = new REST().setToken(token);

	try {
		logger.info(`Started refreshing ${commands.length} app commands`);

		const guildID = process.env.DISCORD_GUILD_ID;
		if (!guildID) {
			throw new Error("DISCORD_GUILD_ID environment variable is required");
		}

		await rest.put(Routes.applicationGuildCommands(clientId, guildID), {
			body: commands,
		});

		logger.info(`Successfully reloaded ${commands.length} app commands`);
	} catch (error) {
		logger.error(`${error}`);
	}
}

export async function createCommandHandler(client) {
	const commands = new Map();
	const commandsPath = path.join(__dirname, "commands");

	// Recursive directory scanning
	async function scanDirectory(dir) {
		const items = fs.readdirSync(dir, { withFileTypes: true });

		for (const item of items) {
			const filePath = path.join(dir, item.name);

			if (item.isDirectory()) {
				await scanDirectory(filePath);
			} else if (item.name.endsWith(".js")) {
				try {
					const command = await import(`file://${filePath}`);

					if ("data" in command && "execute" in command) {
						commands.set(command.data.name, command);
					} else {
						logger.warn(
							`The command at ${filePath} is missing a required "data" or "execute" property.`,
						);
					}
				} catch (error) {
					logger.error(`Failed to load command from ${filePath}:`, error);
				}
			}
		}
	}

	await scanDirectory(commandsPath);

	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(
				`Error executing command ${interaction.commandName}:\n${error}`,
			);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	});

	logger.info(`Command handler ready with ${commands.size} commands`);
	return commands;
}
