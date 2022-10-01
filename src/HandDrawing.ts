import Board from './Board';
import CanvasConfig from './Config/CanvasConfig';
import Drawable from './types/Drawable';
import Point from './types/Point';

export default class HandDrawing implements Drawable {
	line: Point[];
	strokeColor: string;
	lineWidth: number;
	fillColor: string;

	constructor(color: string, lineWidth: number) {
		this.line = [];
		this.strokeColor = color;
		this.lineWidth = lineWidth;
		this.fillColor = 'transparent';
	}

	startDraw(): void {
		Board.ctx.beginPath();
		Board.ctx.strokeStyle = this.strokeColor;
		Board.ctx.lineWidth = this.lineWidth;
		Board.ctx.lineCap = 'round';
	}

	draw(canvasConfig: CanvasConfig, evt: MouseEvent): void {
		const point: Point = {
			prevX: canvasConfig.toWorldX(canvasConfig.prevCursorX),
			prevY: canvasConfig.toWorldY(canvasConfig.prevCursorY),
			x: canvasConfig.toWorldX(evt.pageX),
			y: canvasConfig.toWorldY(evt.pageY),
		};

		this.line.push(point);
		Board.ctx.moveTo(canvasConfig.prevCursorX, canvasConfig.prevCursorY);
		Board.ctx.lineTo(canvasConfig.cursorX, canvasConfig.cursorY);
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
