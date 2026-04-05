import * as Actions from "./actions.js";
import { mineflayerLogger as logger } from "../logger.js";

class Schedule {
	constructor(delay, actionName, type, message) {
		this.id = Schedule.generateID();
		this.delay = delay;
		this.actionName = actionName;
		this.type = type;
		this.action = this.generateAction();
		this.timer = this.generateTimer();

		// Used for chat action
		this.message = message;

		// Add as an active schedule
		Schedule.activeSchedules.set(this.id, this);

		logger.info(
			`Created a schedule with id: ${this.id}; delay: ${delay}; type: ${type}; action: ${actionName}`,
		);
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

	close() {
		Schedule.activeSchedules.delete(this.id);
	}

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
		};

		return handlers[this.actionName];
	}
}

export function createSchedule(delay, actionName, type, message) {
	const schedule = new Schedule(delay, actionName, type, message);
	return schedule.id ? true : false;
}
