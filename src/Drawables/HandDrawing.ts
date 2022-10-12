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

	startDraw(evt: MouseEvent | TouchEvent): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;
		Board.ctx.lineCap = 'round';
		Board.ctx.lineJoin = 'round';

		Board.ctx.beginPath();

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.initialX = x;
		this.properties.initialY = y;
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
		this.line = this.normalizeArray(this.line);
		Board.ctx.closePath();
	}

	isEmpty(): boolean {
		return this.line.length === 0;
	}

	normalizeArray(arr: Array<Array<number>>): Array<Array<number>> {
		const normalizedArray = [];
		if (arr.length < 3) return arr;

		normalizedArray.push([this.line[0][0], this.line[0][1]]);

		for (let i = 1; i < this.line.length - 1; i++) {
			if (
				this.line[i][0] === this.line[i + 1][0] ||
				this.line[i][1] === this.line[i + 1][1]
			)
				continue;

			normalizedArray.push([this.line[i][0], this.line[i][1]]);
		}

		normalizedArray.push([
			this.line[this.line.length - 1][0],
			this.line[this.line.length - 1][1],
		]);

		return normalizedArray;
	}
}
