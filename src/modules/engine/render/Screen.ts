import { Signal } from '../Signal';

class Screen {
	public onResize = new Signal();
	public width = 1280;
	public height = 720;

	dispatchOnResize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.onResize.dispatch();
	}
}

export const screen = new Screen();
