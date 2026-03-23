import { SlashCommandBuilder } from "discord.js";
import { connect } from "../../../mineflayer/bot.js";

export const data = new SlashCommandBuilder()
	.setName("connect")
	.setDescription("Makes bot connect to the server");

export async function execute(interaction) {
	if (connect()) {
		await interaction.reply("Conecting...");
	} else {
		await interaction.reply("Couldn't connect to the server, check the updates channel for more info");
	}
}
