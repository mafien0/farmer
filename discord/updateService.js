import { sendEmbedMsg } from "./messageService.js";
import {
	createMessage,
	createError,
	createSuccess,
	createWarning,
} from "./embeds.js";

function sendUpdateMsg(message) {
	if (!message) throw new Error("Message cannot be empty");
	sendEmbedMsg(message, "updates");
}

export const connectUpdate = () => {
	sendUpdateMsg(createSuccess("Connected", "Succesfully connected"));
};

export const disconnectUpdate = (info) => {
	sendUpdateMsg(createError("disconnect", info));
};

export const reconnectUpdate = (info) => {
	sendUpdateMsg(createWarning("Reconnect", info));
};

export const kickUpdate = (info) => {
	sendUpdateMsg(createError("Kicked", info));
};

export const banUpdate = (info) => {
	sendUpdateMsg(createError("Banned", info));
};

export const deathUpdate = (info) => {
	sendUpdateMsg(createError("Death", info));
};

export const actionUpdate = (info) => {
	sendUpdateMsg(createMessage("Action", info));
};
