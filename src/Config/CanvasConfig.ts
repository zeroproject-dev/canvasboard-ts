import Board from '../Board';

export default class CanvasConfig {
	offsetX: number;
	offsetY: number;
	cursorX: number;
	cursorY: number;
	prevCursorX: number;
	prevCursorY: number;
	scale: number;

	private static _instance: CanvasConfig;

	constructor() {
		this.offsetX = 0;
		this.offsetY = 0;
		this.cursorX = 0;
		this.cursorY = 0;
		this.prevCursorX = 0;
		this.prevCursorY = 0;
		this.scale = 1;
	}

	public static get getInstance() {
		return this._instance || (this._instance = new this());
	}

	toScreenX(x: number) {
		return (x + this.offsetX) * this.scale;
	}

	toScreenY(y: number) {
		return (y + this.offsetY) * this.scale;
	}

	toWorldX(x: number) {
		return x / this.scale - this.offsetX;
	}

	toWorldY(y: number) {
		return y / this.scale - this.offsetY;
	}

	getWidth() {
		return Board.canvas.clientWidth / this.scale;
	}

	getHeight() {
		return Board.canvas.clientHeight / this.scale;
	}
}
