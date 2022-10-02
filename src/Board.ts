import BoardEvents from './BoardEvents';
import Config from './Config/Config';
import { DrawableFactory } from './Drawables/DrawableFactory';
import Drawable from './types/Drawable';
import Point from './types/Point';
import canvasConfig from './Config/CanvasConfig';

export default class Board extends BoardEvents {
	public static canvas: HTMLCanvasElement;
	public static ctx: CanvasRenderingContext2D;

	isDrawing: boolean;
	isDragging: boolean;
	static history: Drawable[] = [];
	currentDraw: Drawable | null = null;

	config: Config;

	static canvasConfig: canvasConfig;

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

		Board.canvasConfig = canvasConfig.getInstance;

		this.createDrawable();
	}

	initilizeEvents() {
		this.onResizeEvent(this.onResize.bind(this));

		this.onMouseDownEvent(this.onMouseDown.bind(this));
		this.onMouseMoveEvent(this.onMouseMove.bind(this));
		this.onMouseUpEvent(this.onMouseUp.bind(this));
		this.onMouseLeaveEvent(this.onMouseUp.bind(this));
		this.onContextMenuEvent(this.onContextMenu.bind(this));
		this.onWheelEvent(this.onMouseWheel.bind(this));

		this.onTouchStartEvent(this.onTouchStart.bind(this));
		this.onTouchMoveEvent(this.onTouchMove.bind(this));
		this.onTouchEndEvent(this.onTouchEnd.bind(this));

		this.onKeydownEvent(this.onKeyDown.bind(this));
	}

	onContextMenu(evt: MouseEvent) {
		evt.preventDefault();
	}

	onResize() {
		Board.canvas.width = document.body.clientWidth;
		Board.canvas.height = document.body.clientHeight;
		Board.reDraw();
	}

	static reDraw() {
		if (Board.history.length == 0) return;
		Board.clearCanvas();

		Board.history.forEach((draw) => {
			Board.ctx.beginPath();
			Board.ctx.strokeStyle = draw.properties.strokeColor as string;
			Board.ctx.lineWidth = draw.properties.lineWidth as number;

			draw.reDraw();
		});
		Board.ctx.closePath();
	}

	onMouseDown(evt: MouseEvent) {
		evt.preventDefault();
		this.isDrawing = evt.button == 0;
		this.isDragging = evt.button == 1;

		Board.canvasConfig.cursorX = evt.pageX;
		Board.canvasConfig.cursorY = evt.pageY;
		Board.canvasConfig.prevCursorX = evt.pageX;
		Board.canvasConfig.prevCursorY = evt.pageY;

		this.createDrawable();

		this.currentDraw?.startDraw(evt);
	}

	onMouseMove(evt: MouseEvent) {
		Board.canvasConfig.cursorX = evt.pageX;
		Board.canvasConfig.cursorY = evt.pageY;

		if (this.isDrawing) {
			this.currentDraw?.draw(evt);
		}

		if (this.isDragging) {
			console.log('dragging');
			console.log(Board.history);
			Board.canvasConfig.offsetX +=
				(Board.canvasConfig.cursorX - Board.canvasConfig.prevCursorX) /
				Board.canvasConfig.scale;
			Board.canvasConfig.offsetY +=
				(Board.canvasConfig.cursorY - Board.canvasConfig.prevCursorY) /
				Board.canvasConfig.scale;

			Board.reDraw();
		}

		Board.canvasConfig.prevCursorX = Board.canvasConfig.cursorX;
		Board.canvasConfig.prevCursorY = Board.canvasConfig.cursorY;
	}

	onMouseUp(evt: MouseEvent | null) {
		// Board.ctx.closePath();
		if (this.isDrawing) {
			this.currentDraw?.endDraw(evt);
			Board.history.push(this.currentDraw as Drawable);
		}

		this.isDrawing = false;
		this.isDragging = false;
	}

	onMouseWheel(evt: WheelEvent) {
		if (this.isDrawing) {
			this.currentDraw?.cancelDraw();
			this.createDrawable();

			this.isDrawing = false;
			this.isDragging = false;
			return;
		}

		const deltaY = evt.deltaY;
		const scaleAmount = -deltaY / 500;
		Board.canvasConfig.scale = Board.canvasConfig.scale * (1 + scaleAmount);

		var distX = evt.pageX / Board.canvas.clientWidth;
		var distY = evt.pageY / Board.canvas.clientHeight;

		const unitsZoomedX = Board.canvasConfig.getWidth() * scaleAmount;
		const unitsZoomedY = Board.canvasConfig.getHeight() * scaleAmount;

		const unitsAddLeft = unitsZoomedX * distX;
		const unitsAddTop = unitsZoomedY * distY;

		Board.canvasConfig.offsetX -= unitsAddLeft;
		Board.canvasConfig.offsetY -= unitsAddTop;

		Board.reDraw();
	}

	onTouchStart(evt: TouchEvent) {
		this.isDrawing = evt.touches.length == 1;
		this.isDragging = evt.touches.length >= 2;

		Board.canvasConfig.prevTouches[0] = evt.touches[0];
		Board.canvasConfig.prevTouches[1] = evt.touches[1];

		this.createDrawable();

		this.currentDraw?.startDraw(evt);
	}

	onTouchMove(evt: TouchEvent) {
		if (
			Board.canvasConfig.prevTouches[0] === null ||
			Board.canvasConfig.prevTouches[1] === null
		)
			return;
		const touch0X = evt.touches[0].pageX;
		const touch0Y = evt.touches[0].pageY;
		const prevTouch0X = Board.canvasConfig.prevTouches[0].pageX;
		const prevTouch0Y = Board.canvasConfig.prevTouches[0].pageY;

		if (this.isDrawing) {
			this.currentDraw?.draw(evt);
		}

		if (this.isDragging) {
			evt.preventDefault();
			const touch1X = evt.touches[1].pageX;
			const touch1Y = evt.touches[1].pageY;
			const prevTouch1X = Board.canvasConfig.prevTouches[1]?.pageX;
			const prevTouch1Y = Board.canvasConfig.prevTouches[1]?.pageY;

			const midX = (touch0X + touch1X) / 2;
			const midY = (touch0Y + touch1Y) / 2;
			const prevMidX = (prevTouch0X + prevTouch1X) / 2;
			const prevMidY = (prevTouch0Y + prevTouch1Y) / 2;

			const hypot = Math.sqrt(
				Math.pow(touch0X - touch1X, 2) + Math.pow(touch0Y - touch1Y, 2)
			);
			const prevHypot = Math.sqrt(
				Math.pow(prevTouch0X - prevTouch1X, 2) +
					Math.pow(prevTouch0Y - prevTouch1Y, 2)
			);

			var zoomAmount = hypot / prevHypot;
			Board.canvasConfig.scale = Board.canvasConfig.scale * zoomAmount;
			const scaleAmount = 1 - zoomAmount;

			const panX = midX - prevMidX;
			const panY = midY - prevMidY;

			Board.canvasConfig.offsetX += panX / Board.canvasConfig.scale;
			Board.canvasConfig.offsetY += panY / Board.canvasConfig.scale;

			var zoomRatioX = midX / Board.canvas.clientWidth;
			var zoomRatioY = midY / Board.canvas.clientHeight;

			const unitsZoomedX = Board.canvasConfig.getWidth() * scaleAmount;
			const unitsZoomedY = Board.canvasConfig.getHeight() * scaleAmount;

			const unitsAddLeft = unitsZoomedX * zoomRatioX;
			const unitsAddTop = unitsZoomedY * zoomRatioY;

			Board.canvasConfig.offsetX += unitsAddLeft;
			Board.canvasConfig.offsetY += unitsAddTop;

			Board.reDraw();
		}

		Board.canvasConfig.prevTouches[0] = evt.touches[0];
		Board.canvasConfig.prevTouches[1] = evt.touches[1];
	}

	onTouchEnd() {
		Board.canvasConfig.prevTouches[0] = null;
		Board.canvasConfig.prevTouches[1] = null;
		this.onMouseUp(null);
	}

	onKeyDown(evt: KeyboardEvent) {
		if (evt.ctrlKey && (evt.key === '\u001a' || evt.key === 'z')) {
			this.undo();
		}
	}

	undo() {
		if (Board.history.length === 0) return;

		Board.clearCanvas();
		Board.history.pop();
		Board.reDraw();
	}

	saveImage() {
		this.config.downloadButton.setAttribute('download', 'image.png');
		this.config.downloadButton.setAttribute(
			'href',
			Board.canvas.toDataURL('image/png')
		);
	}

	clearBoard() {
		Board.clearCanvas();
		this.createDrawable();
		Board.history = [];
	}

	createDrawable() {
		this.currentDraw = DrawableFactory.create(Config.currentDrawing, {
			strokeColor: this.config.color,
			lineWidth: this.config.brushSize,
		});
	}

	static clearCanvas(point: Point | null = null) {
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
