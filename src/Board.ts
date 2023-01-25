import BoardEvents from './BoardEvents';
import { initializeConfig, Config, saveHistory } from './Config/Config';
import Drawable from './types/Drawable';
import Point from './types/Point';
import { CanvasConfig } from './Config/CanvasConfig';
import { DrawableFactory } from './Drawables/DrawableFactory';

type erasedHistoryItem = {
	index: number;
	countHistory: number;
};

export default class Board extends BoardEvents {
	public static canvas: HTMLCanvasElement;
	public static ctx: CanvasRenderingContext2D;
	public static isCursorMode = false;

	isDrawing: boolean;
	isDragging: boolean;

	timer: number = 0;
	static isPerfectShape: boolean = false;
	static history: Drawable[] = [];
	static erasedHistory: Array<erasedHistoryItem> = [];
	currentDraw: Drawable | null = null;

	constructor() {
		super();

		Board.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		Board.ctx = Board.canvas.getContext('2d') as CanvasRenderingContext2D;
		Board.canvas.width = document.body.clientWidth;
		Board.canvas.height = document.body.clientHeight;

		this.isDrawing = false;
		this.isDragging = false;

		this.createDrawable();
		Board.clearCanvas();
	}

	initializeEvents() {
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

		initializeConfig();
	}

	onContextMenu(evt: MouseEvent) {
		evt.preventDefault();
	}

	onResize() {
		Board.canvas.width = document.body.clientWidth;
		Board.canvas.height = document.body.clientHeight;
		Board.clearCanvas();
		Board.reDraw();
	}

	static reDraw() {
		if (Board.history.length == 0) return;
		Board.clearCanvas();

		Board.history.forEach((draw: Drawable) => {
			if (draw.isErased) return;
			Board.ctx.strokeStyle = draw.properties.strokeColor as string;
			Board.ctx.fillStyle = draw.properties.fillColor as string;
			Board.ctx.lineWidth =
				(draw.properties.lineWidth as number) * Config.scale;
			Board.ctx.moveTo(
				draw.properties.initialX as number,
				draw.properties.initialY as number
			);

			Board.ctx.beginPath();
			Board.ctx.lineCap = 'round';
			draw.reDraw();
			Board.ctx.closePath();
		});

		Board.ctx.strokeStyle = Config.strokeColor;
		Board.ctx.lineWidth = Config.lineWidth * Config.scale;
	}

	startDraw(evt: TouchEvent | MouseEvent) {
		if (Board.isCursorMode) {
			if (evt instanceof MouseEvent) {
				if (evt.button !== 0) return;
			}

			let drawIndex = this.checkCursorOnShape(evt);
			if (drawIndex !== -1) {
				Board.history[drawIndex].isErased = true;
				Board.erasedHistory.push({
					index: drawIndex,
					countHistory: Board.history.length,
				});
				Board.clearCanvas();
				Board.reDraw();
				saveHistory();
			}
			return;
		}

		if (this.isDrawing) {
			Board.ctx.strokeStyle = Config.strokeColor as string;
			Board.ctx.fillStyle = Config.fillColor as string;
			Board.ctx.lineWidth = (Config.lineWidth as number) * Config.scale;

			this.createDrawable();
			this.currentDraw?.startDraw(evt);
		}
	}

	draw(evt: MouseEvent | TouchEvent) {
		if (Board.isCursorMode) return;

		if (this.isDrawing) {
			clearTimeout(this.timer);
			if (!Board.isPerfectShape)
				this.timer = setTimeout(() => {
					Board.isPerfectShape = true;
					this.currentDraw?.draw(evt);
				}, 600);
			this.currentDraw?.draw(evt);
		}
	}

	endDraw(evt: MouseEvent | TouchEvent) {
		if (Board.isCursorMode) {
			this.isDragging = false;
			return;
		}

		if (this.isDrawing) {
			this.currentDraw?.endDraw(evt);

			if (!this.currentDraw?.isEmpty()) {
				Board.history.push(this.currentDraw as Drawable);
				saveHistory();
			}
		}

		this.isDrawing = false;
		this.isDragging = false;
		Board.isPerfectShape = false;
		clearTimeout(this.timer);
	}

	onMouseDown(evt: MouseEvent) {
		evt.preventDefault();
		this.isDrawing = evt.button == 0 && !Board.isCursorMode;
		this.isDragging = evt.button == 1;

		CanvasConfig.cursorX = evt.pageX;
		CanvasConfig.cursorY = evt.pageY;
		CanvasConfig.prevCursorX = evt.pageX;
		CanvasConfig.prevCursorY = evt.pageY;

		this.startDraw(evt);
	}

	checkCursorOnShape(evt: MouseEvent | TouchEvent) {
		let index = -1;

		for (let i = Board.history.length - 1; i >= 0; i--) {
			if (Board.history[i].isCursorOnShape(evt)) {
				index = i;
				break;
			}
		}

		return index;
	}

	onMouseMove(evt: MouseEvent) {
		CanvasConfig.cursorX = evt.pageX;
		CanvasConfig.cursorY = evt.pageY;

		this.draw(evt);

		if (this.isDragging) {
			Config.offsetX +=
				(CanvasConfig.cursorX - CanvasConfig.prevCursorX) / Config.scale;
			Config.offsetY +=
				(CanvasConfig.cursorY - CanvasConfig.prevCursorY) / Config.scale;

			Board.reDraw();
		}

		CanvasConfig.prevCursorX = CanvasConfig.cursorX;
		CanvasConfig.prevCursorY = CanvasConfig.cursorY;
	}

	onMouseUp(evt: MouseEvent) {
		this.endDraw(evt);
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
		const newScale = Config.scale * (1 + scaleAmount);

		if (newScale < 0.1 || newScale > 10) return;

		Config.scale = newScale;

		var distX = evt.pageX / Board.canvas.clientWidth;
		var distY = evt.pageY / Board.canvas.clientHeight;

		const unitsZoomedX = CanvasConfig.getWidth() * scaleAmount;
		const unitsZoomedY = CanvasConfig.getHeight() * scaleAmount;

		const unitsAddLeft = unitsZoomedX * distX;
		const unitsAddTop = unitsZoomedY * distY;

		Config.offsetX -= unitsAddLeft;
		Config.offsetY -= unitsAddTop;

		Board.reDraw();
	}

	onTouchStart(evt: TouchEvent) {
		this.isDrawing = evt.touches.length == 1;
		this.isDragging = evt.touches.length >= 2;

		CanvasConfig.prevTouches[0] = evt.touches[0];
		CanvasConfig.prevTouches[1] = evt.touches[1];

		this.startDraw(evt);
	}

	onTouchMove(evt: TouchEvent) {
		if (
			CanvasConfig.prevTouches[0] === null ||
			CanvasConfig.prevTouches[1] === null
		)
			return;
		const touch0X = evt.touches[0].pageX;
		const touch0Y = evt.touches[0].pageY;
		const prevTouch0X = CanvasConfig.prevTouches[0].pageX;
		const prevTouch0Y = CanvasConfig.prevTouches[0].pageY;

		this.draw(evt);

		if (this.isDragging) {
			if (this.isDrawing) {
				this.currentDraw?.cancelDraw();
				this.createDrawable();

				this.isDrawing = false;
				this.isDragging = false;
				return;
			}
			evt.preventDefault();
			const touch1X = evt.touches[1].pageX;
			const touch1Y = evt.touches[1].pageY;
			const prevTouch1X = CanvasConfig.prevTouches[1]?.pageX;
			const prevTouch1Y = CanvasConfig.prevTouches[1]?.pageY;

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
			const newScale = Config.scale * zoomAmount;

			if (newScale < 0.1 || newScale > 10) return;
			Config.scale = newScale;
			const scaleAmount = 1 - zoomAmount;

			const panX = midX - prevMidX;
			const panY = midY - prevMidY;

			Config.offsetX += panX / Config.scale;
			Config.offsetY += panY / Config.scale;

			var zoomRatioX = midX / Board.canvas.clientWidth;
			var zoomRatioY = midY / Board.canvas.clientHeight;

			const unitsZoomedX = CanvasConfig.getWidth() * scaleAmount;
			const unitsZoomedY = CanvasConfig.getHeight() * scaleAmount;

			const unitsAddLeft = unitsZoomedX * zoomRatioX;
			const unitsAddTop = unitsZoomedY * zoomRatioY;

			Config.offsetX += unitsAddLeft;
			Config.offsetY += unitsAddTop;

			Board.reDraw();
		}

		CanvasConfig.prevTouches[0] = evt.touches[0];
		CanvasConfig.prevTouches[1] = evt.touches[1];
	}

	onTouchEnd(evt: TouchEvent) {
		this.endDraw(evt);
		CanvasConfig.prevTouches[0] = null;
		CanvasConfig.prevTouches[1] = null;
	}

	onKeyDown(evt: KeyboardEvent) {
		if (evt.ctrlKey && (evt.key === '\u001a' || evt.key === 'z')) {
			Board.undo();
		}
	}

	static undo() {
		if (Board.history.length == 0) return;

		Board.clearCanvas();

		if (Board.erasedHistory.length > 0) {
			let lastIndex = Board.erasedHistory.length - 1;
			if (
				Board.erasedHistory[lastIndex].countHistory === Board.history.length
			) {
				Board.history[Board.erasedHistory[lastIndex].index].isErased = false;
				Board.erasedHistory.pop();
			} else {
				Board.history.pop();
			}
		} else {
			Board.history.pop();
		}

		saveHistory();
		Board.reDraw();
	}

	static clearBoard() {
		Board.clearCanvas();
		Board.history = [];
		saveHistory();
	}

	createDrawable() {
		this.currentDraw = DrawableFactory.create(Config.currentDrawable, {
			strokeColor: Config.strokeColor,
			lineWidth: Config.lineWidth,
			fillColor: Config.fillColor,
		});
	}

	static clearCanvas(point: Point | null = null) {
		Board.ctx.fillStyle = Config.canvasColor;

		if (point === null)
			Board.ctx.fillRect(
				0,
				0,
				document.body.clientWidth,
				document.body.clientHeight
			);
		else Board.ctx.fillRect(point.prevX, point.prevY, point.x, point.y);

		Board.ctx.fillStyle = Config.fillColor;
	}
}
