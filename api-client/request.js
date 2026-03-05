import { client } from "./client.js";

function setValue(field, value) {
	if (!field) throw new Error("No field specified");
	// if (!value) throw new Error("No value specified");
	console.log(`Updating interface data. ${field} : ${value}`);

	client
		.patch("/status", {
			field,
			value,
		})
		.catch((error) => {
			console.error(
				`Failed to update field ${field} with value ${value}: ${error.message}`,
			);
		});
}

// Status updates
export const setStatus = (status) => setValue("status", status);
export const setName = (name) => setValue("name", name);
export const setHealth = (health) => setValue("health", health);
export const setHunger = (hunger) => setValue("hunger", hunger);
export const setPing = (ping) => setValue("ping", ping);
export const setCoords = (coords) => setValue("coords", coords);
export const setDimension = (dimension) => setValue("dimension", dimension);

export const updateBotStatus = (bot) => {
	setStatus("Online");
	setName(bot.username);
	if (bot.health) setHealth(bot.health);
	if (bot.food) setHunger(bot.food);
	if (bot.player?.ping !== undefined) setPing(bot.player.ping);
	if (bot.entity?.position) {
		const pos = bot.entity.position;
		setCoords(`${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`);
	}
	if (bot.game?.dimension) setDimension(bot.game.dimension);
};
