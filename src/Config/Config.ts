import Board from '../Board';
import { DrawableType } from '../Drawables/DrawableFactory';

const drawables: { [key: string]: DrawableType } = {
	pen: DrawableType.HandDrawing,
	rectangle: DrawableType.Rectangle,
	circle: DrawableType.Circle,
};

const getAncestorByTagName = (
	element: HTMLElement,
	tagName: string
): HTMLElement => {
	let parent = element.parentElement;
	while (parent !== null) {
		if (parent.tagName === tagName) return parent;
		parent = parent.parentElement;
	}
	return element;
};

export let strokeColor: string = '#000000';
export let lineWidth: number = 10;
export let fillColor: string = '#000000';
export let currentDrawable: DrawableType = DrawableType.HandDrawing;

export const initializeConfig = () => {
	// Line width
	(document.getElementById('size') as HTMLInputElement).addEventListener(
		'change',
		(evt: Event) => {
			const target: HTMLInputElement = evt.target as HTMLInputElement;
			const sibiling: HTMLSpanElement =
				target.nextElementSibling as HTMLSpanElement;

			sibiling.textContent = target.value;

			lineWidth = Number(target.value);
		}
	);

	// Stroke color
	(document.getElementById('color') as HTMLInputElement).addEventListener(
		'change',
		({ target }: Event) => {
			strokeColor = (target as HTMLInputElement).value;
		}
	);

	// Clear Button
	(document.getElementById('clear') as HTMLButtonElement).addEventListener(
		'click',
		() => {
			Board.clearBoard();
		}
	);

	// Undo button
	(document.getElementById('undo') as HTMLButtonElement).addEventListener(
		'click',
		() => {
			Board.undo();
		}
	);

	// Download Button
	const downloadButton = document.getElementById(
		'download'
	) as HTMLButtonElement;
	downloadButton.addEventListener('click', () => {
		downloadButton.setAttribute('download', 'image.png');
		downloadButton.setAttribute('href', Board.canvas.toDataURL('image/png'));
	});

	// Drawables
	const drawablesUI = document.getElementById('drawables') as HTMLDivElement;
	drawablesUI.addEventListener('click', (evt: MouseEvent) => {
		let target = evt.target as HTMLButtonElement;
		if (target.tagName !== 'BUTTON') {
			target = getAncestorByTagName(target, 'BUTTON') as HTMLButtonElement;
		}
		const drawable = target.dataset.type;
		if (drawable === undefined) return;
		currentDrawable = drawables[drawable];
	});
};
