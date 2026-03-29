import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { sneak } from "../../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("sneak")
	.setDescription("Makes bot start/stop sneaking")
	.addBooleanOption((option) =>
		option.setName("action").setDescription(
			"Start or stop sneaking, defaults to true",
		).setRequired(false)
	);

export async function execute(interaction) {
	const action = interaction.options.getBoolean("action") ?? true;

	if (sneak(action)) {
		if (action) {
			await interaction.reply({
				content: "Started sneaking",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Stopped sneaking",
				flags: MessageFlags.Ephemeral,
			});
		}
	} else {
		await interaction.reply({
			content: "Something went wrong",
			flags: MessageFlags.Ephemeral,
		});
	}
}
