import { ChannelType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { updateChannel } from "@/configHandler.js";

export const data = new SlashCommandBuilder()
	.setName("set-channel")
	.setDescription("Set a channel bot sends message's to")
	.addStringOption((option) =>
		option
			.setName("channel-type")
			.setDescription("Type of the channel")
			.setRequired(true)
			.addChoices(
				{ name: "Chat", value: "chat" },
				{ name: "Status", value: "status" },
				{ name: "Updates", value: "updates" },
			)
	)
	.addChannelOption((option) =>
		option
			.setName("channel")
			.setDescription("Channel itself")
			.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
			.setRequired(true)
	);

export async function execute(interaction) {
	const channelType = interaction.options.getString("channel-type");
	const channel = interaction.options.getChannel("channel");

	await updateChannel(channelType, channel.id);

	await interaction.reply({
		content: `Set "${channel.name}" as "${channelType} channel"`,
		flags: MessageFlags.Ephemeral,
	});
}
