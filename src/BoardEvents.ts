import Board from './Board';

export default abstract class BoardEvents {
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
		Board.canvas.addEventListener('mousemove', callback);
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

	onContextMenuEvent(callback: (evt: MouseEvent) => void) {
		Board.canvas.addEventListener('contextmenu', callback);
	}
}
