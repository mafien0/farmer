import { SlashCommandBuilder } from "discord.js";
import { disconnect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("disconnect")
	.setDescription("Makes bot leave currently playing server");

export async function execute(interaction) {
	if (disconnect()) {
		await interaction.reply({ content: "Disconnected", ephemeral: true });
	} else {
		await interaction.reply({
			content: "Something went wrong",
			ephemeral: true,
		});
	}
}
