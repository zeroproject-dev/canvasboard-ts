import Point from './types/Point';

export default class Board {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	canvasWidth: number;
	canvasHeight: number;
	isDrawing: boolean;
	lines: Point[][] = [];
	currentLine: Point[] = [];

	constructor() {
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		this.isDrawing = false;
	}

	onResize() {
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
	}

	reDraw() {
		// this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.lines.forEach((currlines) => {
			this.ctx.beginPath();
			for (let line of currlines) {
				this.ctx.lineTo(line.x, line.y);
				this.ctx.stroke();
			}
			this.ctx.closePath();
		});

		console.log('reDraw');
		console.log(this.lines);
	}

	startDraw({ x, y }: Point = { x: 0, y: 0 }) {
		this.ctx.beginPath();
		this.currentLine.push({ x, y });

		this.isDrawing = true;
		console.log('startDraw');
	}

	drawLine({ x, y }: Point) {
		if (!this.isDrawing) return;

		this.currentLine.push({ x, y });

		this.ctx.lineTo(x, y);
		this.ctx.stroke();

		console.log('drawLine');
	}

	stopDraw() {
		this.ctx.closePath();
		this.lines.push(this.currentLine);
		this.currentLine = [];

		this.isDrawing = false;

		console.log('stopDraw');
	}

	undo() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.lines.pop();
		this.reDraw();
	}
}
