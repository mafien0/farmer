import { bot } from "./bot.js";

export function stop() {
	bot.clearControlStates();
	bot.deactivateItem();
	return true;
}

export function useItem(continuously) {
	bot.activateItem();
	if (!continuously) {
		setTimeout(() => bot.deactivateItem(), 3000);
	}
	return true;
}

export function useBlock() {
	const block = bot.blockAtCursor(5);
	if (!block) return false;

	bot.activateBlock(block);
	return true;
}

export function attack() {
	const entity = bot.entityAtCursor(5);
	if (!entity) return false;
	bot.attack(entity);
	return true;
}

export function dig() {
	const block = bot.blockAtCursor(5);
	if (!block) return false;
	bot.dig(block);
	return true;
}

export function jump(continuously) {
	bot.setControlState("jump", true);
	if (!continuously) {
		setTimeout(() => bot.setControlState("jump", false), 50);
	}
	return true;
}

export function move(direction, continuously) {
	if (!direction) return false;

	bot.setControlState(direction, true);
	if (!continuously) {
		setTimeout(() => bot.setControlState(direction, false), 1000);
	}
	return true;
}

export function sneak(isSneaking) {
	bot.setControlState("sneak", isSneaking);
	return true;
}
