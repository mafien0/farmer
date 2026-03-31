import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { stop } from "@/mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("stop")
	.setDescription("Stops all the bot actions");

export async function execute(interaction) {
	if (stop()) {
		await interaction.reply({
			content: "Succesfully stoped all the actions",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Something went wrong",
			flags: MessageFlags.Ephemeral,
		});
	}
}
