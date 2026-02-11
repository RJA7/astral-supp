import { RenderState } from './RenderState';
import { ProjectionFn } from './Projection';

export type CameraOptions = {
	frustum: vmath.matrix4;
	constants: render.constant_buffer;
};

export class Camera {
	public readonly projectionFn: ProjectionFn;
	public readonly near: number;
	public readonly far: number;
	public zoom: number;
	public proj: vmath.matrix4;
	public view: vmath.matrix4;
	public readonly options: CameraOptions;

	constructor(
		projectionFn: ProjectionFn,
		near: number,
		far: number,
		zoom = 1,
	) {
		this.projectionFn = projectionFn;
		this.near = near;
		this.far = far;
		this.zoom = zoom;
		this.proj = vmath.matrix4();
		this.view = vmath.matrix4();
		this.options = {
			frustum: vmath.matrix4(),
			constants: render.constant_buffer(),
		};
	}

	public update(state: RenderState) {
		this.proj = this.projectionFn(this, state);
		this.options.frustum = this.proj.mul(this.view);
	}
}
