import Point from './Point';

export default class LinePoints {
	lines: Point[] = [];
	color: string;
	brushSize: number;

	constructor(color: string, brushSize: number) {
		this.lines = [];
		this.color = color;
		this.brushSize = brushSize;
	}
}
