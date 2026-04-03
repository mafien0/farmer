import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("schedule")
	.setDescription("Schedule an action")
	.addIntegerOption((option) =>
		option
			.setName("duration")
			.setDescription("In which duration do the action")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("unit")
			.setDescription("In which unit")
			.addChoices(
				{ name: "Tick", value: "tick" },
				{ name: "Seconds", value: "seconds" },
				{ name: "Minutes", value: "minutes" },
				{ name: "Hours", value: "hours" },
			)
			.setRequired(true)
	)
	.addBooleanOption((option) =>
		option
			.setName("repeat")
			.setDescription("Should action be repeated")
			.setRequired(false)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("chat")
			.setDescription("Send a chat message after the timeout")
			.addStringOption((option) =>
				option
					.setName("message")
					.setDescription("Message to send")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("attack")
			.setDescription("Punches a mob after the timeout)")
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("dig")
			.setDescription("Digs a block after the timeout)")
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("use-block")
			.setDescription("Uses a block after the timeout")
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("use-item")
			.setDescription("Uses an item after the timeout")
	)

export async function execute(interaction) {
}
