import { updateBotStatus } from "../api-client/request.js";

export function attachListeners(bot) {
	bot.on("spawn", () => {
		setTimeout(() => {
			updateBotStatus(bot);
		}, 1000);
	});
}
