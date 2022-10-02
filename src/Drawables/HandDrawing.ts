import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import Point from '../types/Point';

export default class HandDrawing implements Drawable {
	line: Point[];
	properties: DrawableProperties;

	constructor(properties: DrawableProperties) {
		this.line = [];

		this.properties = properties;
	}

	cancelDraw(): void {
		this.line = [];
	}

	startDraw(): void {
		Board.ctx.beginPath();
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;
		Board.ctx.lineCap = 'round';
	}

	draw(evt: MouseEvent | TouchEvent): void {
		let point = {} as Point;
		if (evt instanceof MouseEvent) {
			point = {
				prevX: Board.canvasConfig.toWorldX(Board.canvasConfig.prevCursorX),
				prevY: Board.canvasConfig.toWorldY(Board.canvasConfig.prevCursorY),
				x: Board.canvasConfig.toWorldX(evt.pageX),
				y: Board.canvasConfig.toWorldY(evt.pageY),
			};

			Board.ctx.moveTo(
				Board.canvasConfig.prevCursorX,
				Board.canvasConfig.prevCursorY
			);
			Board.ctx.lineTo(Board.canvasConfig.cursorX, Board.canvasConfig.cursorY);
		} else if (evt instanceof TouchEvent) {
			if (
				Board.canvasConfig.prevTouches[0] === null ||
				Board.canvasConfig.prevTouches[1] === null
			)
				return;

			point = {
				prevX: Board.canvasConfig.toWorldX(
					Board.canvasConfig.prevTouches[0].pageX
				),
				prevY: Board.canvasConfig.toWorldY(
					Board.canvasConfig.prevTouches[0].pageY
				),
				x: Board.canvasConfig.toWorldX(evt.touches[0].pageX),
				y: Board.canvasConfig.toWorldY(evt.touches[0].pageY),
			};

			Board.ctx.moveTo(
				Board.canvasConfig.prevTouches[0].pageX,
				Board.canvasConfig.prevTouches[0].pageY
			);
			Board.ctx.lineTo(evt.touches[0].pageX, evt.touches[0].pageY);
		}

		this.line.push(point);
		Board.ctx.stroke();
	}

	reDraw(): void {
		Board.ctx.beginPath();
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		this.line.forEach((point) => {
			Board.ctx.moveTo(
				Board.canvasConfig.toScreenX(point.prevX),
				Board.canvasConfig.toScreenY(point.prevY)
			);
			Board.ctx.lineTo(
				Board.canvasConfig.toScreenX(point.x),
				Board.canvasConfig.toScreenY(point.y)
			);
			Board.ctx.stroke();
		});
		Board.ctx.closePath();
	}

	endDraw(): void {
		Board.ctx.closePath();
	}
}
