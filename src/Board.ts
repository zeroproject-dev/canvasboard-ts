import BoardEvents from './BoardEvents';
import CanvasConfig from './Config/CanvasConfig';
import Config from './Config/Config';
import HandDrawing from './HandDrawing';
import Drawable from './types/Drawable';
import Point from './types/Point';

export default class Board extends BoardEvents {
	public static canvas: HTMLCanvasElement;
	public static ctx: CanvasRenderingContext2D;

	isDrawing: boolean;
	isDragging: boolean;
	history: Drawable[] = [];
	currentDraw: Drawable;

	config: Config;

	private canvasConfig: CanvasConfig;

	constructor() {
		super();

		Board.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		Board.ctx = Board.canvas.getContext('2d') as CanvasRenderingContext2D;
		Board.canvas.width = document.body.clientWidth;
		Board.canvas.height = document.body.clientHeight;

		this.isDrawing = false;
		this.isDragging = false;

		this.config = Config.getInstance;

		this.config.onDownloadClick(this.saveImage.bind(this));
		this.config.onClearClick(this.clearBoard.bind(this));

		this.canvasConfig = CanvasConfig.getInstance;

		this.currentDraw = new HandDrawing(
			this.config.color,
			this.config.brushSize
		);
	}

	initilizeEvents() {
		this.onResizeEvent(this.onResize.bind(this));
		this.onMouseDownEvent(this.onMouseDown.bind(this));
		this.onMouseMoveEvent(this.onMouseMove.bind(this));
		this.onMouseUpEvent(this.onMouseUp.bind(this));
		this.onMouseLeaveEvent(this.onMouseUp.bind(this));
		this.onContextMenuEvent(this.onContextMenu.bind(this));
		this.onWheelEvent(this.onMouseWheel.bind(this));
		this.onKeydownEvent(this.onKeyDown.bind(this));
	}

	onContextMenu(evt: MouseEvent) {
		evt.preventDefault();
	}

	onResize() {
		Board.canvas.width = document.body.clientWidth;
		Board.canvas.height = document.body.clientHeight;
		this.reDraw();
	}

	reDraw() {
		this.clearCanvas();

		this.history.forEach((draw) => {
			Board.ctx.beginPath();
			Board.ctx.strokeStyle = draw.strokeColor;
			Board.ctx.lineWidth = draw.lineWidth;

			draw.reDraw(this.canvasConfig);

			Board.ctx.closePath();
		});
	}

	onMouseDown(evt: MouseEvent) {
		evt.preventDefault();
		this.isDrawing = evt.button == 0;
		this.isDragging = evt.button == 1;

		this.canvasConfig.cursorX = evt.pageX;
		this.canvasConfig.cursorY = evt.pageY;
		this.canvasConfig.prevCursorX = evt.pageX;
		this.canvasConfig.prevCursorY = evt.pageY;

		this.currentDraw = new HandDrawing(
			this.config.color,
			this.config.brushSize
		);

		this.currentDraw.startDraw();
	}

	onMouseMove(event: MouseEvent) {
		this.canvasConfig.cursorX = event.pageX;
		this.canvasConfig.cursorY = event.pageY;

		if (this.isDrawing) {
			this.currentDraw.draw(this.canvasConfig, event);
		}

		if (this.isDragging) {
			this.canvasConfig.offsetX +=
				(this.canvasConfig.cursorX - this.canvasConfig.prevCursorX) /
				this.canvasConfig.scale;
			this.canvasConfig.offsetY +=
				(this.canvasConfig.cursorY - this.canvasConfig.prevCursorY) /
				this.canvasConfig.scale;
			console.log(this.canvasConfig.offsetX, this.canvasConfig.offsetY);
			console.log(this.history);
			this.reDraw();
		}

		this.canvasConfig.prevCursorX = this.canvasConfig.cursorX;
		this.canvasConfig.prevCursorY = this.canvasConfig.cursorY;
	}

	onMouseUp() {
		Board.ctx.closePath();
		this.history.push(this.currentDraw);
		this.currentDraw.endDraw();

		this.isDrawing = false;
		this.isDragging = false;
	}

	onMouseWheel(evt: WheelEvent) {
		if (this.isDrawing) {
			this.currentDraw.cancelDraw();
			this.currentDraw = new HandDrawing(
				this.config.color,
				this.config.brushSize
			);
			this.isDrawing = false;
			this.isDragging = false;
		}

		const deltaY = evt.deltaY;
		const scaleAmount = -deltaY / 500;
		this.canvasConfig.scale = this.canvasConfig.scale * (1 + scaleAmount);

		var distX = evt.pageX / Board.canvas.clientWidth;
		var distY = evt.pageY / Board.canvas.clientHeight;

		const unitsZoomedX = this.canvasConfig.getWidth() * scaleAmount;
		const unitsZoomedY = this.canvasConfig.getHeight() * scaleAmount;

		const unitsAddLeft = unitsZoomedX * distX;
		const unitsAddTop = unitsZoomedY * distY;

		this.canvasConfig.offsetX -= unitsAddLeft;
		this.canvasConfig.offsetY -= unitsAddTop;

		this.reDraw();
	}

	onKeyDown(evt: KeyboardEvent) {
		if (evt.ctrlKey && (evt.key === '\u001a' || evt.key === 'z')) {
			this.undo();
		}
	}

	undo() {
		if (this.history.length === 0) return;

		this.clearCanvas();
		this.history.pop();
		this.reDraw();
	}

	saveImage() {
		this.config.downloadButton.setAttribute('download', 'image.png');
		this.config.downloadButton.setAttribute(
			'href',
			Board.canvas.toDataURL('image/png')
		);
	}

	clearBoard() {
		this.clearCanvas();
		this.currentDraw = new HandDrawing(
			this.config.color,
			this.config.brushSize
		);
		this.history = [];
	}

	clearCanvas(point: Point | null = null) {
		if (point === null)
			Board.ctx.clearRect(
				0,
				0,
				document.body.clientWidth,
				document.body.clientHeight
			);
		else Board.ctx.clearRect(point.prevX, point.prevY, point.x, point.y);
	}
}
