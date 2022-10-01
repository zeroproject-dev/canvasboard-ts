import Drawable from '../types/Drawable';
import { DrawableProperties } from '../types/DrawableProperties';
import HandDrawing from './HandDrawing';

export class DrawableFactory {
	static create(type: DrawableType, properties: DrawableProperties): Drawable {
		switch (type) {
			case DrawableType.HandDrawing:
				return new HandDrawing(properties);

			default:
				return new HandDrawing(properties);
		}
	}
}

export const enum DrawableType {
	HandDrawing,
}
