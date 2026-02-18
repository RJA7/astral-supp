import { Camera } from './Camera';
import { Projection, ProjectionFn } from './Projection';

export class RenderState {
	valid = false;
	windowWidth = 0;
	windowHeight = 0;
	width = 0;
	height = 0;
	prevWindowWidth = 0;
	prevWindowHeight = 0;
	cameras: Camera[] = [];
	clearBuffers = {
		[graphics.BUFFER_TYPE_COLOR0_BIT]: vmath.vector4(),
		[graphics.BUFFER_TYPE_DEPTH_BIT]: 1,
		[graphics.BUFFER_TYPE_STENCIL_BIT]: 0,
	};
	cameraWorld: Camera;
	cameraGui: Camera;

	constructor() {
		this.cameraWorld = this.addCamera(Projection.fixedFit, -1000, 1000);
		this.cameraGui = this.addCamera(Projection.gui, -1, 1);
	}

	public addCamera(projectionFn: ProjectionFn, near: number, far: number) {
		const camera = new Camera(projectionFn, near, far);
		this.cameras.push(camera);

		return camera;
	}

	public update() {
		this.windowWidth = render.get_window_width();
		this.windowHeight = render.get_window_height();
		this.valid = this.windowWidth > 0 && this.windowHeight > 0;

		if (!this.valid) {
			return false;
		}

		// Make sure state updated only once when resize window
		if (
			this.windowWidth === this.prevWindowWidth &&
			this.windowHeight === this.prevWindowHeight
		) {
			return true;
		}

		this.prevWindowWidth = this.windowWidth;
		this.prevWindowHeight = this.windowHeight;
		this.width = render.get_width();
		this.height = render.get_height();

		for (const camera of this.cameras) {
			camera.update(this);
		}

		return true;
	}
}
