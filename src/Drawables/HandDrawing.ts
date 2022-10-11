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
		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		const coords = [
			Board.canvasConfig.toWorldX(x),
			Board.canvasConfig.toWorldY(y),
		];

		Board.ctx.lineTo(x, y);

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
