import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export default class HandDrawing implements Drawable {
	line: Array<Array<number>>;
	prevX: number = 0;
	prevY: number = 0;

	properties: DrawableProperties;

	constructor(properties: DrawableProperties) {
		this.line = [];

		this.properties = properties;
	}

	cancelDraw(): void {
		this.line = [];
	}

	startDraw(): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;
		Board.ctx.lineCap = 'round';
		Board.ctx.lineJoin = 'round';

		Board.ctx.beginPath();

		this.properties.initialX = Board.canvasConfig.cursorX;
		this.properties.initialY = Board.canvasConfig.cursorY;
	}

	draw(evt: MouseEvent | TouchEvent): void {
		let coords = [0, 0];

		if (evt instanceof MouseEvent) {
			coords = [
				Board.canvasConfig.toWorldX(evt.pageX),
				Board.canvasConfig.toWorldY(evt.pageY),
			];

			Board.ctx.lineTo(Board.canvasConfig.cursorX, Board.canvasConfig.cursorY);
		} else if (evt instanceof TouchEvent) {
			if (
				Board.canvasConfig.prevTouches[0] === null ||
				Board.canvasConfig.prevTouches[1] === null
			)
				return;

			coords = [
				Board.canvasConfig.toWorldX(evt.touches[0].pageX),
				Board.canvasConfig.toWorldY(evt.touches[0].pageY),
			];

			Board.ctx.lineTo(evt.touches[0].pageX, evt.touches[0].pageY);
		}

		this.line.push(coords);
		Board.ctx.stroke();
	}

	reDraw(): void {
		for (let i = 0; i < this.line.length; i++) {
			Board.ctx.lineTo(
				Board.canvasConfig.toScreenX(this.line[i][0]),
				Board.canvasConfig.toScreenY(this.line[i][1])
			);
		}
		Board.ctx.stroke();
	}

	endDraw(): void {
		Board.ctx.closePath();
	}
}
