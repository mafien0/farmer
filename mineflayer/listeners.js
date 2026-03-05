import * as request from "../api-client/request.js";

export function attachListeners(bot) {
	bot.on("login", () => {
		request.setStatus("Online");
	});
}
