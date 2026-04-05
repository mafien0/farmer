import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { useItem } from "@/mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("use-item")
	.setDescription("Makes bot use currently holding item")
	.addBooleanOption((option) =>
		option
			.setName("continuously")
			.setDescription("Use item continuously or not. Default to false")
	);

export async function execute(interaction) {
	const continuously = interaction.options.getBoolean("continuously") ?? false;
	if (useItem(continuously)) {
		await interaction.reply({
			content: "Using the item",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Couldn't use the item",
			flags: MessageFlags.Ephemeral,
		});
	}
}
