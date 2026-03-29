import { discordLogger as logger } from "../logger.js";
import { EmbedBuilder, resolveColor } from "discord.js";
import { config } from "../configHandler.js";

function getColors() {
	return config.discord.embed.colors;
}

// Embed generator
function generateEmbed(header, content, color = null) {
	if (!header) {
		logger.error("in generateEmbed(): Header cannot be empty");
		return;
	}
	if (!content) {
		logger.error("in generateEmbed(): Content cannot be empty");
		return;
	}
	if (!color) color = getColors().white || "#ffffff";

	return new EmbedBuilder()
		.setTitle(header)
		.setDescription(content)
		.setColor(resolveColor(color));
}

// Different types of embeds
export const createMessage = (header, content) =>
	generateEmbed(header, content, getColors().white || "#ffffff");
export const createError = (header, content) =>
	generateEmbed(header, content, getColors().red || "#ff0000");
export const createSuccess = (header, content) =>
	generateEmbed(header, content, getColors().green || "#00ff00");
export const createWarning = (header, content) =>
	generateEmbed(header, content, getColors().yellow || "#ffff00");

// Status embed
export function createStatusEmbed(status) {
	if (!status) {
		logger.error("in createStatusEmbed(): `status` cannot be empty");
		return;
	}
	const color = status.status.toLowerCase() === "online"
		? getColors().green
		: getColors().gray;
	const time = Math.floor(Date.now() / 1000);

	return new EmbedBuilder().setTitle(status.name).setColor(color)
		.setDescription(`
\`\`\`
Health | ${status.health}
Hunger | ${status.hunger}
Ping   | ${status.ping}
\n${status.dimension}\n${status.coords}
${"-".repeat(30)}
${status.info}
\`\`\`
updated <t:${time}:R>
`);
}
