import { SlashCommandBuilder } from "discord.js";
import {
	updateIP,
	updateUsername,
	updateVersion,
	updateBaseReconnectTimeout,
	updateMaxReconnectAttempts,
} from "../../../configHandler.js";
import { reconnect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("config")
	.setDescription("Bot configuration")
	.addStringOption((option) =>
		option
			.setName("field")
			.setDescription("Config value to change")
			.setRequired(true)
			.addChoices(
				{ name: "Server ip", value: "ip" },
				{ name: "Username", value: "username" },
				{ name: "Version", value: "version" },
				{ name: "Base reconnect timeout", value: "baseReconnectTimeout" },
				{ name: "Max reconnect attempts", value: "maxReconnectAttempts" },
			),
	)
	.addStringOption((option) =>
		option
			.setName("value")
			.setDescription("Value to change the field to")
			.setRequired(true),
	)
	.addBooleanOption((option) =>
		option
			.setName("reconnect")
			.setDescription(
				"Should bot reconnect after config changes? Defaults to false",
			)
			.setRequired(false),
	);

export async function execute(interaction) {
	const field = interaction.options.getString("field");
	const value = interaction.options.getString("value");
	const shouldReconnect = interaction.options.getBoolean("reconnect") ?? false;

	const handlers = {
		ip: () => updateIP(value),
		username: () => updateUsername(value),
		version: () => updateVersion(value),
		baseReconnectTimeout: () => updateBaseReconnectTimeout(value),
		maxReconnectAttempts: () => updateMaxReconnectAttempts(value),
	};

	const handler = handlers[field];
	if (handler) handler();

	if (shouldReconnect) {
		reconnect();
	}

	await interaction.reply({
		content: `Updated "${field}" with "${value}"`,
		ephemeral: true,
	});
}
