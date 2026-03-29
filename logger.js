import fs from "fs";
import winston from "winston";
import { fileExists } from "./util.js";
import { format } from "winston";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

if (!fileExists("logs")) {
	fs.mkdirSync("logs");
}

const createCustomFormat = (prefix) =>
	format.printf(({ level, message }) => {
		const levelStr =
			{
				error: "[error]",
				warn: "[warn]",
				debug: "[debug]",
			}[level] || "";
		return `${prefix}${levelStr ? ` ${levelStr}` : ""} ${message}`;
	});

export const discordLogger = winston.createLogger({
	format: format.combine(format.timestamp(), createCustomFormat("[Discord]")),
	transports: [new winston.transports.Console(), new winston.transports.File({ filename: `logs/${timestamp}.log` })],
});

export const mineflayerLogger = winston.createLogger({
	format: format.combine(format.timestamp(), createCustomFormat("[Mineflayer]")),
	transports: [new winston.transports.Console(), new winston.transports.File({ filename: `logs/${timestamp}.log` })],
});

export const commonLogger = winston.createLogger({
	format: format.combine(format.timestamp(), createCustomFormat("[Common]")),
	transports: [new winston.transports.Console(), new winston.transports.File({ filename: `logs/${timestamp}.log` })],
});
