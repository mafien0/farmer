import winston from "winston";
import { format } from "winston";
import { fileExists } from "@/util.js";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logsDir = new URL("../logs", import.meta.url).pathname;

if (!fileExists(logsDir)) {
	Deno.mkdirSync(logsDir, { recursive: true });
}

const createCustomFormat = (prefix) =>
	format.printf(({ level, message }) => {
		const levelStr = {
			error: "[error]",
			warn: "[warn]",
			debug: "[debug]",
		}[level] || "";
		return `${prefix}${levelStr ? ` ${levelStr}` : ""} ${message}`;
	});

export const discordLogger = winston.createLogger({
	format: format.combine(format.timestamp(), createCustomFormat("[Discord]")),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logsDir}/${timestamp}.log` }),
	],
});

export const mineflayerLogger = winston.createLogger({
	format: format.combine(
		format.timestamp(),
		createCustomFormat("[Mineflayer]"),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logsDir}/${timestamp}.log` }),
	],
});

export const commonLogger = winston.createLogger({
	format: format.combine(format.timestamp(), createCustomFormat("[Common]")),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logsDir}/${timestamp}.log` }),
	],
});
