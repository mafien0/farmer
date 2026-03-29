import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { jump } from "../../../mineflayer/actions.js";

export const data = new SlashCommandBuilder()
	.setName("jump")
	.setDescription("Makes bot jump")
	.addBooleanOption((option) =>
		option
			.setName("continuously")
			.setDescription("Run action continuously or not")
			.setRequired(true)
	);

export async function execute(interaction) {
	const continuously = interaction.options.getBoolean("continuously");
	if (jump(continuously)) {
		await interaction.reply({
			content: "Jumping",
			flags: MessageFlags.Ephemeral,
		});
	} else {
		await interaction.reply({
			content: "Something went wromg",
			flags: MessageFlags.Ephemeral,
		});
	}
}
