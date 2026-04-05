import { createSheduleListEmbed } from "@/discord/embeds.js";
import { scheduleUpdate } from "../discord/updateService.js";
import { mineflayerLogger as logger } from "../logger.js";
import * as Actions from "./actions.js";
import { disconnect, isConnected } from "./bot.js";

export class Schedule {
	constructor(delay, actionName, type, message) {
		this.id = Schedule.generateID();
		this.delay = delay; // In ms
		this.actionName = actionName;
		this.type = type; // Can be `active` or `inactive`
		this.action = this.generateAction();
		this.timer = isConnected() ? this.generateTimer() : null;
		this.active = true;

		// Used for chat action
		this.message = message;

		// Add as an active schedule
		Schedule.activeSchedules.set(this.id, this);

		logger.info(
			`Created a schedule with id: ${this.id}; delay: ${delay}; type: ${type}; action: ${actionName}`,
		);
		return true;
	}

	// Map of [ID ; Schedule instance]
	static activeSchedules = new Map();

	static generateID() {
		// Generate random 3 digit number
		const id = Math.floor(Math.random() * 900) + 100;
		logger.info(`Generating ID: ${id}`);
		// Lookup if schedule with this id doesn't exists
		if (!this.activeSchedules.has(id)) {
			return id;
		} else {
			// Repeat
			logger.info("This id already exists, re-trying...");
			return this.generateID();
		}
	}

	clearTimer() {
		if (this.type === "interval") clearInterval(this.timer);
		else clearTimeout(this.timer);
		this.timer = null;
	}

	// Schedule config
	disable() {
		logger.info(`Disabling schedule, schedule id: ${this.id}`);
		if (this.timer) this.clearTimer();
		this.active = false;
		return true;
	}
	enable() {
		logger.info(`Enabling schedule, schedule id: ${this.id}`);
		if (this.timer) this.clearTimer();
		this.timer = this.generateTimer();
		this.active = true;
		return true;
	}
	remove() {
		logger.info(`Removing schedule, schedule id: ${this.id}`);
		if (this.timer) this.clearTimer();
		Schedule.activeSchedules.delete(this.id);
		return true;
	}

	// Timer generation
	createInterval() {
		logger.info("Creating interval timer");
		return setInterval(() => {
			// Log
			logger.info(`interval schedule ran, id: ${this.id}`);
			scheduleUpdate(
				`Interval schedule ran\nID: ${this.id}, Action: ${this.actionName}`,
			);

			// Run
			try {
				this.action();
			} catch {
				logger.warn(`Couldn't run the action, id: ${this.id}`);
			}
		}, this.delay);
	}
	createTimeout() {
		logger.info("Creating timeout timer");
		return setTimeout(() => {
			// Log
			logger.info(`One-time schedule ran, id: ${this.id}`);
			scheduleUpdate(
				`One-time schedule ran\nID: ${this.id}, Action: ${this.actionName}`,
			);

			// Run
			try {
				this.action();
			} catch {
				logger.warn(`Couldn't run the action, id: ${this.id}`);
			}
			this.remove(); // Kill yourself after action completion
		}, this.delay);
	}

	generateTimer() {
		if (this.type === "interval") return this.createInterval();
		else return this.createTimeout();
	}

	generateAction() {
		const handlers = {
			chat: () => Actions.chat(this.message),
			attack: () => Actions.attack(),
			dig: () => Actions.dig(),
			useItem: () => Actions.useItem(),
			useBlock: () => Actions.useBlock(),
			disconnect: () => disconnect(),
		};

		return handlers[this.actionName];
	}

	static list() {
		return createSheduleListEmbed(Schedule.activeSchedules);
	}

	static exists(id) {
		return Schedule.activeSchedules.has(id);
	}

	// Schedule config
	static remove(id) {
		const schedule = Schedule.activeSchedules.get(id);
		if (schedule) {
			return schedule.remove() ? true : false;
		}
		return false;
	}
	static disable(id) {
		const schedule = Schedule.activeSchedules.get(id);
		if (schedule) {
			return schedule.disable() ? true : false;
		}
		return false;
	}
	static enable(id) {
		const schedule = Schedule.activeSchedules.get(id);
		if (schedule) {
			return schedule.enable() ? true : false;
		}
		return false;
	}

	// Bulk configure
	static disableAll() {
		logger.info("Disabling all schedules");
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.disable();
		});
		return true;
	}
	static enableAll() {
		logger.info("Enabling all schedules");
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.enable();
		});
		return true;
	}
	static removeAll() {
		logger.info("Removing all schedules");
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.remove();
		});
		return true;
	}

	// Clears timers for all schedules
	static clearAll() {
		logger.info("Clearing all schedules");
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.clearTimer();
		});
		return true;
	}

	// Starts timers for all enabled schedules
	static startAll() {
		logger.info("Starting all schedules");
		Schedule.activeSchedules.forEach((schedule) => {
			if (schedule.active) schedule.enable();
		});
		return true;
	}
}
