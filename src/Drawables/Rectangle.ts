import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export class Rectangle implements Drawable {
	properties: DrawableProperties;
	initialX: number;
	initialY: number;
	initialRealX: number;
	initialRealY: number;
	width: number;
	height: number;
	displayWidth: number;
	displayHeight: number;
	scale: number;

	constructor(properties: DrawableProperties) {
		this.properties = properties;
		this.initialX = 0;
		this.initialY = 0;
		this.initialRealX = 0;
		this.initialRealY = 0;
		this.displayHeight = 0;
		this.displayWidth = 0;
		this.width = 0;
		this.height = 0;
		this.scale = 1;
	}

	startDraw(evt: MouseEvent | TouchEvent): void {
		Board.ctx.beginPath();
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		this.scale = Board.canvasConfig.scale;

		if (evt instanceof MouseEvent) {
			this.initialX = evt.pageX;
			this.initialY = evt.pageY;
			this.initialRealX = Board.canvasConfig.toWorldX(evt.pageX);
			this.initialRealY = Board.canvasConfig.toWorldY(evt.pageY);
		} else if (evt instanceof TouchEvent) {
			this.initialX = evt.touches[0].pageX;
			this.initialY = evt.touches[0].pageY;
			this.initialRealX = Board.canvasConfig.toWorldX(evt.touches[0].pageX);
			this.initialRealY = Board.canvasConfig.toWorldY(evt.touches[0].pageY);
		}
	}

	draw(evt: MouseEvent | TouchEvent): void {
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();

		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		if (evt instanceof MouseEvent) {
			this.displayWidth = evt.pageX - this.initialX;
			this.displayHeight = evt.pageY - this.initialY;
		} else if (evt instanceof TouchEvent) {
			this.displayWidth = evt.touches[0].pageX - this.initialX;
			this.displayHeight = evt.touches[0].pageY - this.initialY;
		}

		this.width = this.displayWidth / Board.canvasConfig.scale;
		this.height = this.displayHeight / Board.canvasConfig.scale;

		Board.ctx.rect(
			Board.canvasConfig.toScreenX(this.initialRealX),
			Board.canvasConfig.toScreenY(this.initialRealY),
			this.displayWidth,
			this.displayHeight
		);

		Board.ctx.stroke();
		Board.ctx.closePath();
	}

	reDraw(): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;
		Board.ctx.rect(
			Board.canvasConfig.toScreenX(this.initialRealX),
			Board.canvasConfig.toScreenY(this.initialRealY),
			this.width * Board.canvasConfig.scale,
			this.height * Board.canvasConfig.scale
		);
		Board.ctx.stroke();
	}

	cancelDraw(): void {
		Board.clearCanvas();
		Board.reDraw();
	}

	endDraw(): void {
		Board.ctx.closePath();
	}
}
