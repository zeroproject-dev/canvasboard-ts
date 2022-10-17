import Board from '../Board';
import { CanvasConfig } from '../Config/CanvasConfig';
import { Config } from '../Config/Config';
import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import { DrawableType } from './DrawableFactory';

export class Circle implements Drawable {
	properties: DrawableProperties;
	type: string = DrawableType.Circle;

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
		const x = evt instanceof MouseEvent ? evt.pageX : evt.touches[0].pageX;
		const y = evt instanceof MouseEvent ? evt.pageY : evt.touches[0].pageY;

		this.properties.fill = Config.fill;

		this.properties.initialX = x;
		this.properties.initialY = y;
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

		let currentRadiusX = (x - (this.properties.initialX as number)) / 2;
		let currentRadiusY = (y - (this.properties.initialY as number)) / 2;

		if (Board.isPerfectShape) {
			const radius = Math.min(
				Math.abs(currentRadiusX),
				Math.abs(currentRadiusY)
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

		this.worldCenterX = CanvasConfig.toWorldX(centerX);
		this.worldCenterY = CanvasConfig.toWorldY(centerY);
		this.radiusX = currentRadiusX / Config.scale;
		this.radiusY = currentRadiusY / Config.scale;

		Board.ctx.ellipse(
			centerX,
			centerY,
			currentRadiusX,
			currentRadiusY,
			0,
			0,
			2 * Math.PI
		);

		if (this.properties.fill) Board.ctx.fill();
		else Board.ctx.stroke();
		Board.ctx.closePath();
	}

	reDraw(): void {
		Board.ctx.strokeStyle = this.properties.strokeColor as string;
		Board.ctx.lineWidth = (this.properties.lineWidth as number) * Config.scale;

		Board.ctx.ellipse(
			CanvasConfig.toScreenX(this.worldCenterX),
			CanvasConfig.toScreenY(this.worldCenterY),
			this.radiusX * Config.scale,
			this.radiusY * Config.scale,
			0,
			0,
			2 * Math.PI
		);

		if (this.properties.fill) Board.ctx.fill();
		else Board.ctx.stroke();
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
