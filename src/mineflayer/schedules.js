import * as Actions from "./actions.js";

class Schedule {
	constructor(delay, actionName, type, message) {
		this.id = generateID();
		this.delay = delay;
		this.actionName = actionName;
		this.type = type;
		this.timer = this.assignTimer();
		this.action = this.generateAction();

		// Used for chat action
		this.message = message;
	}

	// ID ; Schedule instance
	static activeSchedules = new Map();

	static generateID() {
		// Generate random 3 digit number
		const id = Math.floor(Math.random() * 900) + 100;
		// Lookup if schedule with this id exists
		if (!this.activeSchedules.has(num)) {
			return id;
		} else {
			// Repeat
			return this.generateID();
		}
	}

	close() {
		activeSchedules.delete(this.id);
	}

	createInterval() {
		return setInterval(() => this.action(), this.delay);
	}
	createTimeout() {
		return setTimeout(() => this.action(), this.delay);
	}

	assignTimer() {
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
