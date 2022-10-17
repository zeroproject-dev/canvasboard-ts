import Board from '../Board';
import { CanvasConfig } from '../Config/CanvasConfig';
import { Config } from '../Config/Config';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import { DrawableType } from './DrawableFactory';

export default class HandDrawing implements Drawable {
	line: Array<Array<number>>;
	initialRealX: number;
	initialRealY: number;

	properties: DrawableProperties;
	type: string = DrawableType.HandDrawing;

	constructor(properties: DrawableProperties) {
		this.line = [];
		this.initialRealX = 0;
		this.initialRealY = 0;

		this.properties = properties;
	}

	cancelDraw(): void {
		this.line = [];
	}

	startDraw(evt: MouseEvent | TouchEvent): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth = (this.properties.lineWidth as number) * Config.scale;

		Board.ctx.beginPath();

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.initialX = x;
		this.properties.initialY = y;
		this.initialRealX = CanvasConfig.toWorldX(x);
		this.initialRealY = CanvasConfig.toWorldY(y);
	}

	draw(evt: MouseEvent | TouchEvent): void {
		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();

		if (Board.isPerfectShape) {
			Board.ctx.moveTo(
				this.properties.initialX as number,
				this.properties.initialY as number
			);

			Board.ctx.lineTo(x, y);
		} else {
			let initialCoords = [this.initialRealX, this.initialRealY];

			this.line.push([CanvasConfig.toWorldX(x), CanvasConfig.toWorldY(y)]);

			let currentPoint = this.line[0];

			for (let i = 1; i < this.line.length; i++) {
				let midPoint = this.midPoint(initialCoords, currentPoint);

				Board.ctx.quadraticCurveTo(
					CanvasConfig.toScreenX(initialCoords[0]),
					CanvasConfig.toScreenY(initialCoords[1]),
					CanvasConfig.toScreenX(midPoint[0]),
					CanvasConfig.toScreenY(midPoint[1])
				);

				initialCoords = this.line[i];
				currentPoint = this.line[i + 1];
			}
		}

		Board.ctx.stroke();
		Board.ctx.closePath();
	}

	midPoint(p1: number[], p2: number[]) {
		return [p1[0] + (p2[0] - p1[0]) / 2, p1[1] + (p2[1] - p1[1]) / 2];
	}

	reDraw(): void {
		if (this.line.length > 2) {
			Board.ctx.beginPath();

			let initialCoords = [this.initialRealX, this.initialRealY];

			let currentPoint = this.line[0];
			Board.ctx.moveTo(
				CanvasConfig.toScreenX(this.initialRealX),
				CanvasConfig.toScreenY(this.initialRealY)
			);

			for (let i = 1; i < this.line.length; i++) {
				let midPoint = this.midPoint(initialCoords, currentPoint);

				Board.ctx.quadraticCurveTo(
					CanvasConfig.toScreenX(initialCoords[0]),
					CanvasConfig.toScreenY(initialCoords[1]),
					CanvasConfig.toScreenX(midPoint[0]),
					CanvasConfig.toScreenY(midPoint[1])
				);

				initialCoords = this.line[i];
				currentPoint = this.line[i + 1];
			}

			Board.ctx.stroke();
			Board.ctx.closePath();
		} else {
			for (let i = 0; i < this.line.length; i++) {
				Board.ctx.lineTo(
					CanvasConfig.toScreenX(this.line[i][0]),
					CanvasConfig.toScreenY(this.line[i][1])
				);
			}

			Board.ctx.stroke();
		}
	}

	endDraw(evt: MouseEvent | TouchEvent): void {
		if (Board.isPerfectShape) {
			const x =
				evt instanceof MouseEvent ? evt.pageX : evt.changedTouches[0].pageX;
			const y =
				evt instanceof MouseEvent ? evt.pageY : evt.changedTouches[0].pageY;

			this.line = [];

			const coords = [CanvasConfig.toWorldX(x), CanvasConfig.toWorldY(y)];

			this.line.push([
				CanvasConfig.toWorldX(this.properties.initialX as number),
				CanvasConfig.toWorldY(this.properties.initialY as number),
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
