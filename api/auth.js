export function apiKeyMiddleware(req, res, next) {
	const clientKey = req.header("x-api-key");
	const serverKey = process.env.API_KEY;

	if (!serverKey) {
		console.error("API_KEY is not set on the server");
		return res.status(500).json({ error: "Server misconfiguration" });
	}

	if (!clientKey || clientKey !== serverKey) {
		console.log("Got an API req but client in unathorized");
		return res.status(401).json({ error: "Unauthorized" });
	}

	next();
}
