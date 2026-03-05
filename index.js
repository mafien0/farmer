import "dotenv/config";
import { createRouter } from "./api/routes.js";

import { connect } from "./mineflayer/bot.js";
import { attachListeners } from "./mineflayer/listeners.js";

// Create api
const app = createRouter();
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API is running on ${port}`);
});

// Initialize bot
const bot = await connect();
attachListeners(bot);
