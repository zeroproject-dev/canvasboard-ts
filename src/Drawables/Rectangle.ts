import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export class Rectangle implements Drawable {
	properties: DrawableProperties;
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
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.initialX = x;
		this.properties.initialY = y;
		this.initialRealX = Board.canvasConfig.toWorldX(x);
		this.initialRealY = Board.canvasConfig.toWorldY(y);
	}

	draw(evt: MouseEvent | TouchEvent): void {
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();

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

		this.width = displayWidth / Board.canvasConfig.scale;
		this.height = displayHeight / Board.canvasConfig.scale;

		Board.ctx.rect(
			this.properties.initialX as number,
			this.properties.initialY as number,
			displayWidth,
			displayHeight
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

	isEmpty(): boolean {
		return this.width === 0 && this.height === 0;
	}
}
