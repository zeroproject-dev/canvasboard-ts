import Board from '../Board';
import { DrawableFactory, DrawableType } from '../Drawables/DrawableFactory';
import Drawable from '../types/Drawable';

const $colorStroke = document.getElementById('color') as HTMLInputElement;
const $lineWidth = document.getElementById('size') as HTMLInputElement;
const $lineWidthNumber = $lineWidth.nextElementSibling as HTMLInputElement;
const $drawablesUI = document.getElementById('drawables') as HTMLDivElement;

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

const loadHistory = (): void => {
	const history = localStorage.getItem('history');

	if (history !== null) {
		const historyParse = JSON.parse(history);

		historyParse.forEach((item: Drawable) => {
			const type: DrawableType = item.type as DrawableType;
			const drawable = DrawableFactory.create(type);

			Object.assign(drawable, item);

			Board.history.push(drawable);
		});

		Board.reDraw();
	}
};

export const saveHistory = (): void => {
	localStorage.setItem('history', JSON.stringify(Board.history));
};

const ConfigObject = {
	strokeColor: '#000000',
	lineWidth: 10,
	fillColor: '#000000',
	currentDrawable: 'HandDrawing' as DrawableType,
};

export const Config = new Proxy(ConfigObject, {
	get: (target, prop) => {
		return target[prop as keyof typeof target];
	},
	set: (target, key, value) => {
		switch (key) {
			case 'strokeColor':
				target.strokeColor = value;
				$colorStroke.value = value;
				Board.ctx.strokeStyle = value;
				break;
			case 'lineWidth':
				target.lineWidth = value;
				$lineWidth.value = value;

				$lineWidthNumber.value = value;

				Board.ctx.lineWidth = value;
				break;
			case 'fillColor':
				target.fillColor = value;
				Board.ctx.fillStyle = value;
				break;

			case 'currentDrawable':
				target.currentDrawable = value;
				toggleSelectedDraw();
				break;
		}
		saveConfig();
		return true;
	},
});

const loadConfig = (): void => {
	Board.ctx.lineJoin = 'round';
	Board.ctx.lineCap = 'round';

	const config = localStorage.getItem('config');

	if (config !== null) {
		const configParse = JSON.parse(config);

		Object.assign(Config, configParse);
	}
};

const saveConfig = (): void => {
	localStorage.setItem('config', JSON.stringify(ConfigObject));
};

const toggleSelectedDraw = (): void => {
	$drawablesUI.childNodes.forEach((child) => {
		if (child.nodeType === Node.ELEMENT_NODE) {
			const target = child as HTMLElement;
			target.classList.remove('selected_draw');
			if (target.dataset.type === Config.currentDrawable) {
				target.classList.add('selected_draw');
			}
		}
	});
};

export const initializeConfig = () => {
	$lineWidth.addEventListener('input', (evt: Event) => {
		const target: HTMLInputElement = evt.target as HTMLInputElement;

		Config.lineWidth = Number(target.value);
	});

	$lineWidthNumber.addEventListener('input', (evt: Event) => {
		const target: HTMLInputElement = evt.target as HTMLInputElement;

		if (Number(target.value) > 50) {
			Config.lineWidth = 50;
			return;
		} else if (Number(target.value) < 1) {
			Config.lineWidth = 1;
			return;
		}

		Config.lineWidth = Number(target.value);
	});

	$colorStroke.addEventListener('change', ({ target }: Event) => {
		Config.strokeColor = (target as HTMLInputElement).value;
	});

	(document.getElementById('clear') as HTMLButtonElement).addEventListener(
		'click',
		() => {
			Board.clearBoard();
		}
	);

	(document.getElementById('undo') as HTMLButtonElement).addEventListener(
		'click',
		() => {
			Board.undo();
		}
	);

	const downloadButton = document.getElementById(
		'download'
	) as HTMLButtonElement;
	downloadButton.addEventListener('click', () => {
		downloadButton.setAttribute('download', 'image.png');
		downloadButton.setAttribute('href', Board.canvas.toDataURL('image/png'));
	});

	$drawablesUI.addEventListener('click', (evt: MouseEvent) => {
		let target = evt.target as HTMLButtonElement;
		if (target.tagName !== 'BUTTON') {
			target = getAncestorByTagName(target, 'BUTTON') as HTMLButtonElement;
		}
		const drawable = target.dataset.type;
		if (drawable === undefined) return;

		Config.currentDrawable = drawable as DrawableType;
	});

	window.addEventListener('load', () => {
		loadConfig();
		loadHistory();
	});
};
