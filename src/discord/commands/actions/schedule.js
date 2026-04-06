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
			.setName("remove-all")
			.setDescription("Remove all schedules")
	)
	.addSubcommand((sub) =>
		sub
			.setName("disable-all")
			.setDescription("Disable all schedules")
	)
	.addSubcommand((sub) =>
		sub
			.setName("enable-all")
			.setDescription("Enable all schedules")
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
					.setRequired(true)
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
					.setRequired(true)
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
					.setRequired(true)
			)
	);

export async function execute(interaction) {
	const subcommand = interaction.options.getSubcommand();

	// List
	if (subcommand === "list") {
		await interaction.reply({
			embeds: [Schedule.list()],
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	// Remove all
	if (subcommand === "remove-all") {
		if (Schedule.removeAll()) {
			await interaction.reply({
				content: "Successfully removed all schedules",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't remove all schedules",
				flags: MessageFlags.Ephemeral,
			});
		}
		return;
	}

	// Disable all
	if (subcommand === "disable-all") {
		if (Schedule.disableAll()) {
			await interaction.reply({
				content: "Successfully disabled all schedules",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't disable all schedules",
				flags: MessageFlags.Ephemeral,
			});
		}
		return;
	}

	// Enable all
	if (subcommand === "enable-all") {
		if (Schedule.enableAll()) {
			await interaction.reply({
				content: "Successfully enabled all schedules",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't enable all schedules",
				flags: MessageFlags.Ephemeral,
			});
		}
		return;
	}

	// Find a schedule by its id
	const id = interaction.options.getInteger("schedule-id");
	if (!Schedule.exists(id)) {
		await interaction.reply({
			content: "Couldn't find a schedule with that id",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	// Remove
	if (subcommand === "remove") {
		if (Schedule.remove(id)) {
			await interaction.reply({
				content: "Successfully removed a schedule",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't delete a schedule",
				flags: MessageFlags.Ephemeral,
			});
		}
	}

	// Disable
	if (subcommand === "disable") {
		if (Schedule.disable(id)) {
			await interaction.reply({
				content: "Successfully disabled a schedule",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't disable a schedule",
				flags: MessageFlags.Ephemeral,
			});
		}
	}

	// Enable
	if (subcommand === "enable") {
		if (Schedule.enable(id)) {
			await interaction.reply({
				content: "Successfully enabled a schedule",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "Couldn't enable a schedule",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}
