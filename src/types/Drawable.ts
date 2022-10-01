import CanvasConfig from '../Config/CanvasConfig';
import { DrawableProperties } from './DrawableProperties';

export default interface Drawable {
	properties: DrawableProperties;

	startDraw(): void;
	draw(canvasConfig: CanvasConfig, event: MouseEvent | TouchEvent): void;
	reDraw(canvasConfig: CanvasConfig): void;
	cancelDraw(): void;
	endDraw(): void;
}
