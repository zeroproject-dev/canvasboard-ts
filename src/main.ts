import Board from './Board';
import './style.css';

const board = new Board();

// window.addEventListener('load', () => {});

window.addEventListener('resize', () => {
	board.onResize();
	board.reDraw();
});

Board.canvas.addEventListener('mousedown', (evt: MouseEvent) => {
	board.startDraw(evt);
});

Board.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
	board.drawLine(evt);
});

Board.canvas.addEventListener('mouseup', () => {
	board.stopDraw();
});

Board.canvas.addEventListener('contextmenu', (evt) => {
	evt.preventDefault();
});

Board.canvas.addEventListener('wheel', (evt: WheelEvent) => {
	board.onMouseWheel(evt);
});

Board.canvas.addEventListener('mouseleave', board.stopDraw.bind(board));

addEventListener('keydown', (e: KeyboardEvent) => {
	if (e.ctrlKey && (e.key === '\u001a' || e.key === 'z')) {
		board.undo();
	}
});
