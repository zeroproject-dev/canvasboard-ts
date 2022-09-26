import Board from './Board';
import Config from './config';
import './style.css';

const config = new Config();
const board = new Board(config);

// window.addEventListener('load', () => {});

window.addEventListener('resize', () => {
	board.onResize();
	board.reDraw();
});

board.canvas.addEventListener('mousedown', board.startDraw.bind(board));

board.canvas.addEventListener('mousemove', (e: MouseEvent) => {
	board.drawLine({ x: e.clientX, y: e.clientY });
});

board.canvas.addEventListener('mouseup', () => {
	board.stopDraw();
});

board.canvas.addEventListener('mouseleave', board.stopDraw.bind(board));

addEventListener('keydown', (e: KeyboardEvent) => {
	if (e.ctrlKey && (e.key === '\u001a' || e.key === 'z')) {
		board.undo();
	}
});
