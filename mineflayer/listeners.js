import { updateBotStatus } from "../interface/status.js";
import { parseChat } from "../interface/chat.js";

export function attachListeners(bot) {
	let statusInterval;

	bot.once("spawn", () => {
		statusInterval = setInterval(() => updateBotStatus(bot), 10000);
	});

	bot.once("end", () => {
		clearInterval(statusInterval);
	});

	bot.on("message", (jsonMsg) => {
		parseChat(jsonMsg);
	});
}
