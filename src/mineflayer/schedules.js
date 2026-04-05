class Schedule {
	constructor(delay, action, actionName, type) {
		this.id = generateID();
		this.delay = delay;
		this.action = action;
		this.actionName = actionName;
		this.type = type;
		this.timer = null;
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

	assignInterval() {
		this.timer = setInterval(() => this.action(), this.delay);
	}
	assignTimeout() {
		this.timer = setTimeout(() => this.action(), this.delay);
	}

	assignSchedule() {
		if (this.type === "interval") return setInterval();
		else return setTimeout();
	}
}
