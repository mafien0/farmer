import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { disconnect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("disconnect")
	.setDescription("Makes bot leave currently playing server");

export async function execute(interaction) {
	if (disconnect()) {
		await interaction.reply({
			content: "Disconnected",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Something went wrong",
			flags: MessageFlags.Ephemeral,
		});
	}
}
