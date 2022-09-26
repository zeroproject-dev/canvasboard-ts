import Board from './Board';
import './style.css';

const board = new Board();

// window.addEventListener('load', () => {});

window.addEventListener('resize', () => {
	board.onResize();
	board.reDraw();
});

board.canvas.addEventListener('mousedown', (e: MouseEvent) => {
	board.startDraw({ x: e.clientX, y: e.clientY });
});

board.canvas.addEventListener('mousemove', (e: MouseEvent) => {
	board.drawLine({ x: e.clientX, y: e.clientY });
});
board.canvas.addEventListener('mouseup', () => {
	board.stopDraw();
});

addEventListener('keydown', (e: KeyboardEvent) => {
	console.log('key pressed', e);
	if (e.ctrlKey && (e.key === '\u001a' || e.key === 'z')) {
		board.undo();
	}
});
