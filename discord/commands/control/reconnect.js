import { SlashCommandBuilder } from "discord.js";
import { reconnect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("reconnect")
	.setDescription("Makes bot dig a block he's currently looking at");

export async function execute(interaction) {
	if (reconnect()) {
		await interaction.reply({ content: "Reconnected", ephemeral: true });
	} else {
		await interaction.reply({
			content: "Something went wrong",
			ephemeral: true,
		});
	}
}
