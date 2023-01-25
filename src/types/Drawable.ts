import { DrawableProperties } from './DrawableProperties';

export default interface Drawable {
	properties: DrawableProperties;
	type: string;
	isErased: boolean;

	startDraw(event: MouseEvent | TouchEvent): void;
	draw(event: MouseEvent | TouchEvent): void;
	reDraw(): void;
	cancelDraw(): void;
	endDraw(event: MouseEvent | TouchEvent | null): void;
	isEmpty(): boolean;
	isCursorOnShape(event: MouseEvent | TouchEvent): boolean;
}
