import Board from '../Board';
import { CanvasConfig } from '../Config/CanvasConfig';
import { Config } from '../Config/Config';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import { DrawableType } from './DrawableFactory';

export class Rectangle implements Drawable {
	properties: DrawableProperties;
	type: string = DrawableType.Rectangle;
	isErased: boolean = false;

	initialRealX: number;
	initialRealY: number;
	width: number;
	height: number;

	constructor(properties: DrawableProperties) {
		this.properties = properties;
		this.initialRealX = 0;
		this.initialRealY = 0;
		this.width = 0;
		this.height = 0;
	}

	startDraw(evt: MouseEvent | TouchEvent): void {
		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.fill = Config.fill;

		this.properties.initialX = x;
		this.properties.initialY = y;
		this.initialRealX = CanvasConfig.toWorldX(x);
		this.initialRealY = CanvasConfig.toWorldY(y);
	}

	draw(evt: MouseEvent | TouchEvent): void {
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.fillStyle = this.properties.fillColor as string;
		Board.ctx.lineWidth = (this.properties.lineWidth as number) * Config.scale;

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		let displayWidth = x - (this.properties.initialX as number);
		let displayHeight = y - (this.properties.initialY as number);

		if (Board.isPerfectShape) {
			const size = Math.min(Math.abs(displayWidth), Math.abs(displayHeight));

			let heightSign = displayHeight < 0 ? -1 : 1;
			let widthSign = displayWidth < 0 ? -1 : 1;

			displayWidth = size * widthSign;
			displayHeight = size * heightSign;
		}

		this.width = displayWidth / Config.scale;
		this.height = displayHeight / Config.scale;

		if (this.properties.fill) {
			Board.ctx.fillRect(
				this.properties.initialX as number,
				this.properties.initialY as number,
				displayWidth,
				displayHeight
			);
		} else {
			Board.ctx.rect(
				this.properties.initialX as number,
				this.properties.initialY as number,
				displayWidth,
				displayHeight
			);
		}

		Board.ctx.stroke();
		Board.ctx.closePath();
	}

	reDraw(): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth = (this.properties.lineWidth as number) * Config.scale;
		if (this.properties.fill) {
			Board.ctx.fillRect(
				CanvasConfig.toScreenX(this.initialRealX),
				CanvasConfig.toScreenY(this.initialRealY),
				this.width * Config.scale,
				this.height * Config.scale
			);
		} else {
			Board.ctx.rect(
				CanvasConfig.toScreenX(this.initialRealX),
				CanvasConfig.toScreenY(this.initialRealY),
				this.width * Config.scale,
				this.height * Config.scale
			);
		}
		Board.ctx.stroke();
	}

	cancelDraw(): void {
		Board.clearCanvas();
		Board.reDraw();
	}

	endDraw(): void {
		Board.ctx.closePath();
	}

	isEmpty(): boolean {
		return this.width === 0 && this.height === 0;
	}

	isCursorOnShape(evt: MouseEvent | TouchEvent): boolean {
		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		const realX = CanvasConfig.toWorldX(x);
		const realY = CanvasConfig.toWorldY(y);

		const x1 = this.initialRealX;
		const y1 = this.initialRealY;

		const x2 = this.initialRealX + this.width;
		const y2 = this.initialRealY + this.height;

		return realX >= x1 && realX <= x2 && realY >= y1 && realY <= y2;
	}
}
