import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export default class HandDrawing implements Drawable {
	line: Array<Array<number>>;

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

		if (Board.isPerfectShape) {
			Board.clearCanvas();
			Board.reDraw();
			Board.ctx.beginPath();

			Board.ctx.moveTo(
				this.properties.initialX as number,
				this.properties.initialY as number
			);

			Board.ctx.lineTo(x, y);

			Board.ctx.closePath();
		} else {
			const coords = [
				Board.canvasConfig.toWorldX(x),
				Board.canvasConfig.toWorldY(y),
			];
			Board.ctx.lineTo(x, y);
			this.line.push(coords);
		}

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

	endDraw(evt: MouseEvent | TouchEvent): void {
		if (Board.isPerfectShape) {
			const x =
				evt instanceof MouseEvent ? evt.pageX : evt.changedTouches[0].pageX;
			const y =
				evt instanceof MouseEvent ? evt.pageY : evt.changedTouches[0].pageY;

			this.line = [];

			const coords = [
				Board.canvasConfig.toWorldX(x),
				Board.canvasConfig.toWorldY(y),
			];

			this.line.push([
				Board.canvasConfig.toWorldX(this.properties.initialX as number),
				Board.canvasConfig.toWorldY(this.properties.initialY as number),
			]);
			this.line.push(coords);
		}

		if (this.line.length > 2) {
			this.line = this.normalizeArray(this.line);
		}

		Board.ctx.closePath();
	}

	isEmpty(): boolean {
		return this.line.length === 0;
	}

	normalizeArray(arr: Array<Array<number>>): Array<Array<number>> {
		let normalizedArray: Array<Array<number>> = [];

		normalizedArray = arr.filter((item, index) => {
			if (index === 0) {
				return true;
			}
			if (index === arr.length - 1) {
				return false;
			}

			const prevItem = arr[index - 1];

			return !(prevItem[0] === item[0] || prevItem[1] === item[1]);
		});

		normalizedArray.push([arr[arr.length - 1][0], arr[arr.length - 1][1]]);
		return normalizedArray;
	}
}
