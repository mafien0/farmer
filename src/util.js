export function fileExists(path) {
	try {
		Deno.statSync(path);
		return true;
	} catch {
		return false;
	}
}

export function formatDuration(ms) {
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	return `${hours}h`;
}
