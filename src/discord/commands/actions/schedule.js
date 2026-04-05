import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { Schedule } from "@/mineflayer/schedules.js";

export const data = new SlashCommandBuilder()
	.setName("schedule")
	.setDescription("Control schedules")
	.addSubcommand((sub) =>
		sub
			.setName("list")
			.setDescription("List all active Schedules")
	)
	.addSubcommand((sub) =>
		sub
			.setName("remove")
			.setDescription("Remove a Schedule")
			.addIntegerOption((option) =>
				option
					.setName("schedule-id")
					.setDescription("id of a schedule to update")
					.setMinValue(100)
					.setMaxValue(999)
			)
	)
	.addSubcommand((sub) =>
		sub
			.setName("disable")
			.setDescription("Disable a Schedule")
			.addIntegerOption((option) =>
				option
					.setName("schedule-id")
					.setDescription("id of a schedule to update")
					.setMinValue(100)
					.setMaxValue(999)
			)
	)
	.addSubcommand((sub) =>
		sub
			.setName("enable")
			.setDescription("Enable a Schedules")
			.addIntegerOption((option) =>
				option
					.setName("schedule-id")
					.setDescription("id of a schedule to update")
					.setMinValue(100)
					.setMaxValue(999)
			)
	);

export async function execute(interaction) {
	const subcommand = interaction.options.getSubcommand();

	if (subcommand === "list") {
		await interaction.reply({
			embeds: [Schedule.list()],
			flags: MessageFlags.Ephemeral,
		});
		return
	}

	const id = interaction.options.getInteger("schedule-id")
	if (!Schedule.exists(id)) {
		await interaction.reply({
			content: "Couldn't find a schedule with that id",
			flags: MessageFlags.Ephemeral,
		});
		return
	}

	if (subcommand === "remove") {
		if (Schedule.remove(id)) {
			await interaction.reply({
				content: "Succesfully removed a schedule",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't delete a schedule",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}
