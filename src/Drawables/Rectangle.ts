import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export class Rectangle implements Drawable {
	properties: DrawableProperties;
	initialRealX: number;
	initialRealY: number;
	width: number;
	height: number;
	displayWidth: number;
	displayHeight: number;

	constructor(properties: DrawableProperties) {
		this.properties = properties;
		this.initialRealX = 0;
		this.initialRealY = 0;
		this.displayHeight = 0;
		this.displayWidth = 0;
		this.width = 0;
		this.height = 0;
	}

	startDraw(evt: MouseEvent | TouchEvent): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		if (evt instanceof MouseEvent) {
			this.properties.initialX = evt.pageX;
			this.properties.initialY = evt.pageY;
			this.initialRealX = Board.canvasConfig.toWorldX(evt.pageX);
			this.initialRealY = Board.canvasConfig.toWorldY(evt.pageY);
		} else if (evt instanceof TouchEvent) {
			this.properties.initialX = evt.touches[0].pageX;
			this.properties.initialY = evt.touches[0].pageY;
			this.initialRealX = Board.canvasConfig.toWorldX(evt.touches[0].pageX);
			this.initialRealY = Board.canvasConfig.toWorldY(evt.touches[0].pageY);
		}
	}

	draw(evt: MouseEvent | TouchEvent): void {
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();

		if (evt instanceof MouseEvent) {
			this.displayWidth = evt.pageX - (this.properties.initialX as number);
			this.displayHeight = evt.pageY - (this.properties.initialY as number);
		} else if (evt instanceof TouchEvent) {
			this.displayWidth =
				evt.touches[0].pageX - (this.properties.initialX as number);
			this.displayHeight =
				evt.touches[0].pageY - (this.properties.initialY as number);
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
