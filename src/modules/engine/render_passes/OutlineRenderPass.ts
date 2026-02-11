import { RenderPass } from '../render/types';
import { RenderState } from '../render/RenderState';
import { Camera } from '../render/Camera';
import { DEFAULT_FAR, DEFAULT_NEAR } from '../render/Constants';
import { Projection } from '../render/Projection';
import { setCamera } from '../render/Helpers';

export class OutlineRenderPass implements RenderPass {
	private readonly renderTexture: render.render_target & hash;
	private readonly predicateRT: number;
	private readonly predicateMain: number;
	private readonly clearColorRT: vmath.vector4;
	private readonly cameraRT: Camera;

	constructor(state: RenderState) {
		this.renderTexture = hash('outline_rt') as unknown as render.render_target &
			hash;
		this.predicateRT = render.predicate(['outline_rt']);
		this.predicateMain = render.predicate(['outline']);
		this.clearColorRT = vmath.vector4();

		this.cameraRT = state.addCamera(
			Projection.renderTarget,
			DEFAULT_NEAR,
			DEFAULT_FAR,
		);
	}

	public update(state: RenderState) {
		this.cameraRT.options.constants = state.cameraWorld.options.constants;
	}

	public draw(state: RenderState) {
		const width = render.get_render_target_width(
			this.renderTexture,
			graphics.BUFFER_TYPE_COLOR0_BIT,
		);
		const height = render.get_render_target_height(
			this.renderTexture,
			graphics.BUFFER_TYPE_COLOR0_BIT,
		);

		// Draw into RT
		render.set_viewport(0, 0, width, height);
		setCamera(this.cameraRT);

		render.set_render_target(this.renderTexture);
		render.clear({
			[graphics.BUFFER_TYPE_COLOR0_BIT]: this.clearColorRT,
		});
		render.draw(this.predicateRT, this.cameraRT.options);
		render.set_render_target(
			render.RENDER_TARGET_DEFAULT as unknown as render.render_target,
		);

		// Draw RT onto the screen
		render.set_viewport(0, 0, state.windowWidth, state.windowHeight);
		setCamera(state.cameraWorld);

		render.enable_texture(
			0,
			this.renderTexture,
			graphics.BUFFER_TYPE_COLOR0_BIT,
		);
		render.draw(this.predicateMain, state.cameraWorld.options);
		render.disable_texture(0);
	}
}
