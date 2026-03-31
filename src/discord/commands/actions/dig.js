import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { dig } from "@/mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("dig")
	.setDescription("Makes bot dig a block he's currently looking at");

export async function execute(interaction) {
	if (dig()) {
		await interaction.reply({
			content: "Using the block",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Couldn't use the block",
			flags: MessageFlags.Ephemeral,
		});
	}
}
