import axios from "axios";

const url = process.env.INTERFACE_URL;
const port = process.env.INTERFACE_PORT;

const APIKey = process.env.INTERFACE_API_KEY;

export const client = axios.create({
	baseURL: `http://${url}:${port}`,
	headers: {
		"x-api-key": APIKey,
		"Content-type": "application/json",
	},
});
