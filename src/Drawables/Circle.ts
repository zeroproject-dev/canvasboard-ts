import Board from '../Board';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';

export class Circle implements Drawable {
	properties: DrawableProperties;
	worldCenterX: number;
	worldCenterY: number;
	radiusX: number;
	radiusY: number;

	constructor(properties: DrawableProperties) {
		this.properties = properties;

		this.worldCenterX = 0;
		this.worldCenterY = 0;
		this.radiusX = 0;
		this.radiusY = 0;
	}

	startDraw(evt: MouseEvent | TouchEvent): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.initialX = x;
		this.properties.initialY = y;
	}

	draw(evt: MouseEvent | TouchEvent): void {
		Board.clearCanvas();
		Board.reDraw();
		Board.ctx.beginPath();

		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		let currentRadiusX = (x - (this.properties.initialX as number)) / 2;
		let currentRadiusY = (y - (this.properties.initialY as number)) / 2;

		if (Board.isPerfectShape) {
			const radius = Math.min(
				currentRadiusX < 0 ? Math.abs(currentRadiusX) : currentRadiusX,
				currentRadiusY < 0 ? Math.abs(currentRadiusY) : currentRadiusY
			);

			const radiusXSign = currentRadiusX < 0 ? -1 : 1;
			const radiusYSign = currentRadiusY < 0 ? -1 : 1;

			currentRadiusX = radius * radiusXSign;
			currentRadiusY = radius * radiusYSign;
		}

		let centerX = (this.properties.initialX as number) + currentRadiusX;
		let centerY = (this.properties.initialY as number) + currentRadiusY;

		currentRadiusX = Math.abs(currentRadiusX);
		currentRadiusY = Math.abs(currentRadiusY);

		this.worldCenterX = Board.canvasConfig.toWorldX(centerX);
		this.worldCenterY = Board.canvasConfig.toWorldY(centerY);
		this.radiusX = currentRadiusX / Board.canvasConfig.scale;
		this.radiusY = currentRadiusY / Board.canvasConfig.scale;

		Board.ctx.ellipse(
			centerX,
			centerY,
			currentRadiusX,
			currentRadiusY,
			0,
			0,
			2 * Math.PI
		);

		Board.ctx.stroke();
		Board.ctx.closePath();
	}

	reDraw(): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth =
			(this.properties.lineWidth as number) * Board.canvasConfig.scale;

		Board.ctx.ellipse(
			Board.canvasConfig.toScreenX(this.worldCenterX),
			Board.canvasConfig.toScreenY(this.worldCenterY),
			this.radiusX * Board.canvasConfig.scale,
			this.radiusY * Board.canvasConfig.scale,
			0,
			0,
			2 * Math.PI
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
		return this.radiusX === 0 && this.radiusY === 0;
	}
}
