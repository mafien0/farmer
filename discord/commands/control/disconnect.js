import { SlashCommandBuilder } from "discord.js";
import { disconnect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("disconnect")
	.setDescription("Makes bot leave currently playing server");

export async function execute(interaction) {
	if (disconnect()) {
		await interaction.reply("Disconecting...");
	} else {
		await interaction.reply("Something went wrong");
	}
}
