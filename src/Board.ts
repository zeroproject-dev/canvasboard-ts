import Config from './config';
import LinePoints from './types/LinePoint';
import Point from './types/Point';

export default class Board {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	canvasWidth: number;
	canvasHeight: number;
	isDrawing: boolean;
	lines: LinePoints[] = [];
	currentLine: Point[] = [];
	config: Config;

	constructor(config: Config) {
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		this.isDrawing = false;

		this.config = config;

		this.config.onDownloadClick(this.saveImage.bind(this));
		this.config.onClearClick(this.clearBoard.bind(this));
	}

	onResize() {
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
	}

	reDraw() {
		this.lines.forEach(({ color, brushSize, lines }) => {
			this.ctx.beginPath();
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = brushSize;
			for (let line of lines) {
				this.ctx.lineTo(line.x, line.y);
				this.ctx.stroke();
			}
			this.ctx.closePath();
		});
	}

	startDraw() {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.config.color;
		this.ctx.lineWidth = this.config.brushSize;
		this.ctx.lineCap = 'round';

		this.isDrawing = true;
	}

	drawLine({ x, y }: Point) {
		if (!this.isDrawing) return;

		this.currentLine.push({ x, y });

		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	stopDraw() {
		this.ctx.closePath();
		const line = new LinePoints(this.config.color, this.config.brushSize);
		line.lines = this.currentLine;
		this.lines.push(line);
		this.currentLine = [];

		this.isDrawing = false;
	}

	undo() {
		if (this.lines.length === 0) return;

		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.lines.pop();
		this.reDraw();
	}

	saveImage() {
		this.config.downloadButton.setAttribute('download', 'image.png');
		this.config.downloadButton.setAttribute(
			'href',
			this.canvas.toDataURL('image/png')
		);
	}

	clearBoard() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.lines = [];
		this.currentLine = [];
	}
}
