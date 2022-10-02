import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import HandDrawing from './HandDrawing';
import { Rectangle } from './Rectangle';

export class DrawableFactory {
	static create(type: DrawableType, properties: DrawableProperties): Drawable {
		switch (type) {
			case DrawableType.HandDrawing:
				return new HandDrawing(properties);
			case DrawableType.Rectangle:
				return new Rectangle(properties);

			default:
				return new HandDrawing(properties);
		}
	}
}

export const enum DrawableType {
	HandDrawing,
	Rectangle,
}
