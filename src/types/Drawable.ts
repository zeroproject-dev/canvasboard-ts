import CanvasConfig from '../Config/CanvasConfig';

export default interface Drawable {
	strokeColor: string;
	lineWidth: number;
	fillColor: string;

	startDraw(): void;
	draw(canvasConfig: CanvasConfig, event: MouseEvent): void;
	reDraw(canvasConfig: CanvasConfig): void;
	cancelDraw(): void;
	endDraw(): void;
}
