import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { attack } from "@/mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("attack")
	.setDescription("Makes bot punch a mob he's currently looking at");

export async function execute(interaction) {
	if (attack()) {
		await interaction.reply({
			content: "Punching the thing",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Couldn't punch the thing",
			flags: MessageFlags.Ephemeral,
		});
	}
}
