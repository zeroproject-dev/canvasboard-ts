import Board from '../Board';
import { Config } from './Config';

export class CanvasConfig {
	static cursorX: number = 0;
	static cursorY: number = 0;
	static prevCursorX: number = 0;
	static prevCursorY: number = 0;

	static prevTouches: Touch[] | null[] = [null, null];

	static toScreenX(x: number) {
		return (x + Config.offsetX) * Config.scale;
	}

	static toScreenY(y: number) {
		return (y + Config.offsetY) * Config.scale;
	}

	static toWorldX(x: number) {
		return x / Config.scale - Config.offsetX;
	}

	static toWorldY(y: number) {
		return y / Config.scale - Config.offsetY;
	}

	static getWidth() {
		return Board.canvas.clientWidth / Config.scale;
	}

	static getHeight() {
		return Board.canvas.clientHeight / Config.scale;
	}
}
