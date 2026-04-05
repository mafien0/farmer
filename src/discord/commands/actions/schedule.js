import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("schedules")
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
			.addIntegerOption("Schedule ID")
	)
	.addSubcommand((sub) =>
		sub
			.setName("disable")
			.setDescription("Disable a Schedule")
			.addIntegerOption("Schedule ID")
	)
	.addSubcommand((sub) =>
		sub
			.setName("enable")
			.setDescription("Enable a Schedules")
			.addIntegerOption("Schedule ID")
	)

export async function execute(interaction) {
}
