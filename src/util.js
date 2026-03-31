export function fileExists(path) {
	try {
		Deno.statSync(path);
		return true;
	} catch {
		return false;
	}
}
