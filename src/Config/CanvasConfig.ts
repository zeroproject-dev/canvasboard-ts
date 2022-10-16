import Board from '../Board';

export class CanvasConfig {
	static offsetX: number = 0;
	static offsetY: number = 0;
	static cursorX: number = 0;
	static cursorY: number = 0;
	static prevCursorX: number = 0;
	static prevCursorY: number = 0;
	static scale: number = 1;

	static prevTouches: Touch[] | null[] = [null, null];

	static toScreenX(x: number) {
		return (x + this.offsetX) * this.scale;
	}

	static toScreenY(y: number) {
		return (y + this.offsetY) * this.scale;
	}

	static toWorldX(x: number) {
		return x / this.scale - this.offsetX;
	}

	static toWorldY(y: number) {
		return y / this.scale - this.offsetY;
	}

	static getWidth() {
		return Board.canvas.clientWidth / this.scale;
	}

	static getHeight() {
		return Board.canvas.clientHeight / this.scale;
	}
}
