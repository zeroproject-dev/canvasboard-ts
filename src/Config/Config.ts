import { DrawableType } from '../Drawables/DrawableFactory';

export default class Config {
	colorInput: HTMLInputElement;
	sizeInput: HTMLInputElement;
	downloadButton: HTMLButtonElement;
	clearButton: HTMLButtonElement;

	public static currentDrawing: DrawableType;

	drawables: { [key: string]: DrawableType } = {
		pen: DrawableType.HandDrawing,
		rectangle: DrawableType.Rectangle,
	};

	private static _instance: Config | null = null;

	constructor() {
		this.colorInput = document.getElementById('color') as HTMLInputElement;
		this.sizeInput = document.getElementById('size') as HTMLInputElement;

		Config.currentDrawing = DrawableType.HandDrawing;

		this.downloadButton = document.getElementById(
			'download'
		) as HTMLButtonElement;
		this.clearButton = document.getElementById('clear') as HTMLButtonElement;

		this.onColorChange((color: string) => {
			this.color = color;
		});

		this.onBrushSizeChange((brushSize: number) => {
			this.brushSize = brushSize;
		});

		this.onDrawableClick();
	}

	static get getInstance() {
		if (this._instance === null) {
			this._instance = new Config();
		}

		return this._instance;
	}

	get color() {
		return this.colorInput.value;
	}

	get brushSize() {
		return Number(this.sizeInput.value);
	}

	set color(color: string) {
		this.colorInput.value = color;
	}

	set brushSize(size: number) {
		this.sizeInput.value = size.toString();
	}

	onColorChange(callback: (color: string) => void) {
		this.colorInput.addEventListener('change', () => {
			callback(this.color);
		});
	}

	onBrushSizeChange(callback: (brushSize: number) => void) {
		this.sizeInput.addEventListener('change', (evt: Event) => {
			const target: HTMLInputElement = evt.target as HTMLInputElement;
			const sibiling: HTMLSpanElement =
				target.nextElementSibling as HTMLSpanElement;

			sibiling.textContent = target.value;

			callback(Number(this.sizeInput.value));
		});
	}

	onDownloadClick(callback: () => void) {
		this.downloadButton.addEventListener('click', () => {
			callback();
		});
	}

	onClearClick(callback: () => void) {
		this.clearButton.addEventListener('click', () => {
			callback();
		});
	}

	onDrawableClick() {
		const drawables = document.getElementById('drawables') as HTMLDivElement;
		drawables.addEventListener('click', (evt: MouseEvent) => {
			const target = evt.target as HTMLButtonElement;
			const drawable = target.dataset.type;
			if (drawable === undefined) return;
			Config.currentDrawing = this.drawables[drawable];
		});
	}
}
