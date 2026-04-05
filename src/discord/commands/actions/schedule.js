import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { createSchedule } from "@/mineflayer/schedules.js";

function createSubcommand(name, description, extraOptions = null) {
	return (subcommand) => {
		let sub = subcommand
			.setName(name)
			.setDescription(description)
			.addIntegerOption((option) =>
				option
					.setName("delay")
					.setDescription("Action delay")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("unit")
					.setDescription("In which unit")
					.addChoices(
						{ name: "Ticks", value: "ticks" },
						{ name: "Seconds", value: "seconds" },
						{ name: "Minutes", value: "minutes" },
						{ name: "Hours", value: "hours" },
					)
					.setRequired(true)
			);

		if (extraOptions) {
			sub = extraOptions(sub);
		}

		return sub.addBooleanOption((option) =>
			option
				.setName("repeat")
				.setDescription("Should action be repeated. Defaults to false")
				.setRequired(false)
		);
	};
}

export const data = new SlashCommandBuilder()
	.setName("schedule")
	.setDescription("Schedule an action")

	// Chat sub command
	.addSubcommand(
		createSubcommand(
			"chat",
			"Send a chat message after the timeout",
			(sub) =>
				sub.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("Message to send")
						.setRequired(true)
				),
		),
	)

	// Subcommands without options
	.addSubcommand(
		createSubcommand("attack", "Punches a mob after the timeout"),
	)
	.addSubcommand(
		createSubcommand("dig", "Digs a block after the timeout"),
	)
	.addSubcommand(
		createSubcommand("use-block", "Uses a block after the timeout"),
	)
	.addSubcommand(
		createSubcommand("use-item", "Uses an item after the timeout"),
	);

export function execute(interaction) {
	const time = interaction.options.getInteger("delay");
	const unit = interaction.options.getString("unit");
	const repeat = interaction.options.getBoolean("repeat") ?? false;
	let subcommand = interaction.options.getSubcommand();

	// Calculate delay
	const units = {
		ticks: 50,
		seconds: 1000,
		minutes: 1000 * 60,
		hours: 1000 * 60 * 60,
	};
	const delay = time * units[unit];

	// Rename subcommand to use camelCase
	if (subcommand === "use-block") subcommand = "useBlock";
	if (subcommand === "use-item") subcommand = "useItem";

	// Get the chat message if action is chat
	let message = null;
	if (subcommand === "chat") {
		message = interaction.options.getString("message");
	}

	const type = repeat ? "interval" : "timeout";

	// Create a schedule
	// `message` is not used unless action = chat
	createSchedule(delay, subcommand, type, message);
}
