import { client } from "./client.js";

function sendMessage(message) {
	client.post("/message/send", {
		content: message,
	});
}

export function parseChat(message) {
	// Currently, just send it
	sendMessage(message.toString());
}
