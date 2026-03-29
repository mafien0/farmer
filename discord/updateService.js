import { discordLogger as logger } from "../logger.js";
import { sendEmbedMsg } from "./messageService.js";
import {
	createError,
	createMessage,
	createSuccess,
	createWarning,
} from "./embeds.js";

function sendUpdateMsg(message) {
	if (!message) {
		logger.error("in sendUpdateMsg(): `message` cannot be empty");
		return;
	}
	sendEmbedMsg(message, "updates");
}

export const connectUpdate = () => {
	sendUpdateMsg(createSuccess("Connected", "Succesfully connected"));
	logger.info("Connect update");
};

export const disconnectUpdate = (info) => {
	sendUpdateMsg(createError("Disconnected", info));
	logger.info(`Disconnect Update: ${info}`);
};

export const reconnectUpdate = (info) => {
	sendUpdateMsg(createWarning("Reconnect", info));
	logger.info(`Reconnect update: ${info}`);
};

export const kickUpdate = (info) => {
	sendUpdateMsg(createError("Kicked", info));
	logger.info(`Kick update: ${info}`);
};

export const banUpdate = (info) => {
	sendUpdateMsg(createError("Banned", info));
	logger.info(`Ban update: ${info}`);
};

export const deathUpdate = (info) => {
	sendUpdateMsg(createError("Death", info));
	logger.info(`Death update: ${info}`);
};

export const actionUpdate = (info) => {
	sendUpdateMsg(createMessage("Action", info));
	logger.info(`Action update: ${info}`);
};

export const messageUpdate = (info) => {
	sendUpdateMsg(createMessage("Message", info));
	logger.info(`Message update: ${info}`);
};
