export default class Config {
	colorInput: HTMLInputElement;
	sizeInput: HTMLInputElement;
	downloadButton: HTMLButtonElement;
	clearButton: HTMLButtonElement;

	constructor() {
		this.colorInput = document.getElementById('color') as HTMLInputElement;
		this.sizeInput = document.getElementById('size') as HTMLInputElement;
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
		this.sizeInput.addEventListener('change', () => {
			callback(this.brushSize);
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
}
