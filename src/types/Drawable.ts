import { DrawableProperties } from './DrawableProperties';

export default interface Drawable {
	properties: DrawableProperties;

	startDraw(event: MouseEvent | TouchEvent): void;
	draw(event: MouseEvent | TouchEvent): void;
	reDraw(): void;
	cancelDraw(): void;
	endDraw(event: MouseEvent | TouchEvent | null): void;
	isEmpty(): boolean;
}
