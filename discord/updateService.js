import { sendEmbedMsg } from "./messageService.js";
import {
	createMessage,
	createError,
	createSuccess,
	createWarning,
} from "./embeds.js";

const sendUpdateMsg = (message) => sendEmbedMsg(message, "updates");

export async function handleUpdates(updateType, info = "") {
	if (!updateType) throw new Error("No update type provided");

	switch (updateType) {
		case "kick":
			sendUpdateMsg(createError("Kick", info));
			break;

		case "connect":
			sendUpdateMsg(createSuccess("Connected", "Succesfully connected"));
			break;

		case "reconnect":
			sendUpdateMsg(createWarning("Reconnect", info));
			break;

		case "death":
			sendUpdateMsg(createError("Death", info));
			break;

		case "action":
			sendUpdateMsg(createMessage("Action", info));
			break;
	}
}
