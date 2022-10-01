import Board from '../Board';
import CanvasConfig from '../Config/CanvasConfig';
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
		Board.ctx.lineWidth = this.properties.lineWidth as number;
		Board.ctx.lineCap = 'round';
	}

	draw(canvasConfig: CanvasConfig, evt: MouseEvent | TouchEvent): void {
		let point = {} as Point;
		if (evt instanceof MouseEvent) {
			point = {
				prevX: canvasConfig.toWorldX(canvasConfig.prevCursorX),
				prevY: canvasConfig.toWorldY(canvasConfig.prevCursorY),
				x: canvasConfig.toWorldX(evt.pageX),
				y: canvasConfig.toWorldY(evt.pageY),
			};

			Board.ctx.moveTo(canvasConfig.prevCursorX, canvasConfig.prevCursorY);
			Board.ctx.lineTo(canvasConfig.cursorX, canvasConfig.cursorY);
		} else if (evt instanceof TouchEvent) {
			if (
				canvasConfig.prevTouches[0] === null ||
				canvasConfig.prevTouches[1] === null
			)
				return;

			point = {
				prevX: canvasConfig.toWorldX(canvasConfig.prevTouches[0].pageX),
				prevY: canvasConfig.toWorldY(canvasConfig.prevTouches[0].pageY),
				x: canvasConfig.toWorldX(evt.touches[0].pageX),
				y: canvasConfig.toWorldY(evt.touches[0].pageY),
			};

			Board.ctx.moveTo(
				canvasConfig.prevTouches[0].pageX,
				canvasConfig.prevTouches[0].pageY
			);
			Board.ctx.lineTo(evt.touches[0].pageX, evt.touches[0].pageY);
		}

		this.line.push(point);
		Board.ctx.stroke();
	}

	reDraw(canvasConfig: CanvasConfig): void {
		this.line.forEach((point) => {
			Board.ctx.moveTo(
				canvasConfig.toScreenX(point.prevX),
				canvasConfig.toScreenY(point.prevY)
			);
			Board.ctx.lineTo(
				canvasConfig.toScreenX(point.x),
				canvasConfig.toScreenY(point.y)
			);
			Board.ctx.stroke();
		});
	}

	endDraw(): void {
		Board.ctx.closePath();
	}
}
