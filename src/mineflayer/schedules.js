import { mineflayerLogger as logger } from "../logger.js";
import * as Actions from "./actions.js";
import { disconnect, isConnected } from "./bot.js";
import { createSheduleListEmbed } from "@/discord/embeds.js";

export class Schedule {
	constructor(delay, actionName, type, message) {
		this.id = Schedule.generateID();
		this.delay = delay;
		this.actionName = actionName;
		this.type = type;
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
		// Lookup if schedule with this id doesn't exists
		if (!this.activeSchedules.has(id)) {
			return id;
		} else {
			// Repeat
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
		if (this.timer) this.clearTimer();
		this.active = false;
		return true;
	}
	enable() {
		if (this.timer) this.clearTimer();
		this.timer = this.generateTimer();
		this.active = true;
		return true;
	}
	remove() {
		if (this.timer) this.clearTimer();
		Schedule.activeSchedules.delete(this.id);
		return true;
	}

	// Timer generation
	createInterval() {
		return setInterval(() => this.action(), this.delay);
	}
	createTimeout() {
		return setTimeout(() => this.action(), this.delay);
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
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.disable();
		});
		return true;
	}
	static enableAll() {
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.enable();
		});
		return true;
	}
	static removeAll() {
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.remove();
		});
		return true;
	}

	// Clears timers for all schedules
	static clearAll() {
		Schedule.activeSchedules.forEach((schedule) => {
			schedule.clearTimer();
		});
		return true;
	}

	// Starts timers for all enabled schedules
	static startAll() {
		Schedule.activeSchedules.forEach((schedule) => {
			if (schedule.active) schedule.enable();
		});
		return true;
	}
}
