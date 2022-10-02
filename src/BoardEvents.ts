import Board from './Board';

export default abstract class BoardEvents {
	private throttleTime: number = 10;

	constructor() {}

	onResizeEvent(callback: (evt: UIEvent) => void) {
		window.addEventListener('resize', callback);
	}

	onKeydownEvent(callback: (evt: KeyboardEvent) => void) {
		window.addEventListener('keydown', callback);
	}
	onKeyupEvent(callback: (evt: KeyboardEvent) => void) {
		window.addEventListener('keyup', callback);
	}
	onKeypressEvent(callback: (evt: KeyboardEvent) => void) {
		window.addEventListener('keypress', callback);
	}

	onMouseDownEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener('mousedown', callback);
	}
	onMouseMoveEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener(
			'mousemove',
			this.throttle<MouseEvent>(callback, this.throttleTime)
		);
	}

	onMouseUpEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener('mouseup', callback);
	}
	onMouseLeaveEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener('mouseleave', callback);
	}
	onWheelEvent(callback: (evt: WheelEvent) => void) {
		Board.canvas.addEventListener('wheel', callback);
	}

	onTouchStartEvent(callback: (evt: TouchEvent) => void) {
		Board.canvas.addEventListener('touchstart', callback);
	}
	onTouchMoveEvent(callback: (evt: TouchEvent) => void) {
		Board.canvas.addEventListener(
			'touchmove',
			this.throttle<TouchEvent>(callback, this.throttleTime)
		);
	}

	onTouchEndEvent(callback: (evt: TouchEvent) => void) {
		Board.canvas.addEventListener('touchend', callback);
	}

	onContextMenuEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener('contextmenu', callback);
	}

	throttle<T>(callback: (evt: T) => void, limit: number) {
		let wait = false;
		return function (arg: T) {
			if (!wait) {
				callback.apply(null, [arg]);
				wait = true;
				setTimeout(function () {
					wait = false;
				}, limit);
			}
		};
	}
}
