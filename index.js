import "dotenv/config";
import { createRouter } from "./api/routes.js";

import { connect } from "./mineflayer/bot.js";

// Create api
const api = createRouter();
const port = process.env.PORT || 3000;
api.listen(port, () => {
	console.log(`API is running on ${port}`);
});

// Initialize bot
const mineflayer = await connect();
