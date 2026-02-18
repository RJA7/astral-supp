import { MessageId } from '../modules/types/MessageId';
import { Message } from '../modules/types/Message';
import { RenderState } from '../modules/engine/render/RenderState';
import { RenderPass } from '../modules/engine/render/types';
import { OutlineRenderPass } from '../modules/engine/render_passes/OutlineRenderPass';
import { setCamera } from '../modules/engine/render/Helpers';
import { screen } from '../modules/engine/render/Screen';

type Self = {
	state: RenderState;
	predicates: {
		tile: number;
		gui: number;
		particle: number;
		model: number;
		debugText: number;
	};
	globals: vmath.vector4;
	passes: RenderPass[];
};

export function init(this: Self) {
	this.predicates = {
		tile: render.predicate(['tile']),
		gui: render.predicate(['gui']),
		particle: render.predicate(['particle']),
		model: render.predicate(['model']),
		debugText: render.predicate(['debug_text']),
	};
	this.globals = vmath.vector4();

	this.state = new RenderState();
	this.passes = [new OutlineRenderPass(this.state)];
	this.state.update();
}

export function update(this: Self, dt: number) {
	const { state, globals } = this;

	if (!state.valid && !state.update()) return;

	const { cameraWorld } = state;
	globals.x = render.get_width();
	globals.y = render.get_height();
	globals.z += dt;
	cameraWorld.options.constants.globals = globals;

	for (const pass of this.passes) {
		pass.update(state);
	}

	const predicates = this.predicates;
	// clear screen buffers
	// turn on depth_mask before `render.clear()` to clear it as well
	render.set_depth_mask(true);
	render.set_stencil_mask(0xff);
	render.clear(state.clearBuffers);

	// setup camera view and projection
	setCamera(cameraWorld);
	render.set_viewport(0, 0, state.windowWidth, state.windowHeight);

	// set states used for all the world predicates
	render.set_blend_func(
		graphics.BLEND_FACTOR_SRC_ALPHA,
		graphics.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
	);
	render.enable_state(graphics.STATE_DEPTH_TEST);

	// render `model` predicate for default 3D material
	render.enable_state(graphics.STATE_CULL_FACE);
	render.draw(predicates.model, cameraWorld.options);
	render.set_depth_mask(false);
	render.disable_state(graphics.STATE_CULL_FACE);

	// render the other components: sprites, tilemaps, particles etc
	render.enable_state(graphics.STATE_BLEND);

	for (const pass of this.passes) {
		pass.draw(state);
	}

	render.draw(predicates.tile, cameraWorld.options);
	render.draw(predicates.particle, cameraWorld.options);
	render.disable_state(graphics.STATE_DEPTH_TEST);

	render.draw_debug3d();

	render.set_camera(undefined);

	// render GUI
	const cameraGui = state.cameraGui;
	render.set_view(cameraGui.view);
	render.set_projection(cameraGui.proj);

	render.enable_state(graphics.STATE_STENCIL_TEST);
	render.draw(predicates.gui, cameraGui.options);
	render.draw(predicates.debugText, cameraGui.options);
	render.disable_state(graphics.STATE_STENCIL_TEST);
	render.disable_state(graphics.STATE_BLEND);
}

export function on_message(
	this: Self,
	message_id: MessageId,
	message: Message,
) {
	message.mid = message_id;
	const state = this.state;

	if (message.mid === MessageId.ClearColor) {
		state.clearBuffers[graphics.BUFFER_TYPE_COLOR0_BIT] = message.color;
	} else if (message.mid === MessageId.window_resized) {
		state.update();

		screen.dispatchOnResize(
			state.windowWidth / state.cameraWorld.zoom,
			state.windowHeight / state.cameraWorld.zoom,
		);
	}
}
