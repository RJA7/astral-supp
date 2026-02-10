import { MessageId } from '../modules/types/MessageId';
import { Message } from '../modules/types/Message';

type Predicate = number;

type Self = {
	state: State;
	predicates: {
		tile: Predicate;
		gui: Predicate;
		particle: Predicate;
		model: Predicate;
		debug_text: Predicate;
	};
	camera_projection: vmath.matrix4;
};

type ProjectionFn = (camera: Camera, state: State) => vmath.matrix4;

type Camera = {
	near: number;
	far: number;
	zoom: number;
	projection_fn: ProjectionFn;
	proj: vmath.matrix4;
	view: vmath.matrix4;
	options: CameraOptions;
};

type State = {
	valid: boolean;
	window_width: number;
	window_height: number;
	width: number;
	height: number;
	prev_window_width: number;
	prev_window_height: number;
	camera_world: Camera;
	camera_gui: Camera;
	clear_buffers: {
		[graphics.BUFFER_TYPE_COLOR0_BIT]: vmath.vector4;
		[graphics.BUFFER_TYPE_DEPTH_BIT]: number;
		[graphics.BUFFER_TYPE_STENCIL_BIT]: number;
	};
};

type CameraOptions = {
	frustum?: vmath.matrix4;
	frustum_planes?: number;
	constants?: render.constant_buffer;
};

export type RenderMessage = {
	mid: MessageId.ClearColor;
	color: vmath.vector4;
};

export function init(this: Self) {
	this.predicates = {
		tile: render.predicate(['tile']),
		gui: render.predicate(['gui']),
		particle: render.predicate(['particle']),
		model: render.predicate(['model']),
		debug_text: render.predicate(['debug_text']),
	};

	this.state = create_state();
	update_state(this.state);
}

export function update(this: Self, _dt: number) {
	const state = this.state;

	if (!state.valid && !update_state(state)) return;

	const predicates = this.predicates;
	// clear screen buffers
	// turn on depth_mask before `render.clear()` to clear it as well
	render.set_depth_mask(true);
	render.set_stencil_mask(0xff);
	render.clear(state.clear_buffers);

	// setup camera view and projection
	const draw_options_world = set_camera_world(state);
	render.set_viewport(0, 0, state.window_width, state.window_height);

	// set states used for all the world predicates
	render.set_blend_func(
		graphics.BLEND_FACTOR_SRC_ALPHA,
		graphics.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA,
	);
	render.enable_state(graphics.STATE_DEPTH_TEST);

	// render `model` predicate for default 3D material
	render.enable_state(graphics.STATE_CULL_FACE);
	render.draw(predicates.model, draw_options_world);
	render.set_depth_mask(false);
	render.disable_state(graphics.STATE_CULL_FACE);

	// render the other components: sprites, tilemaps, particles etc
	render.enable_state(graphics.STATE_BLEND);
	render.draw(predicates.tile, draw_options_world);
	render.draw(predicates.particle, draw_options_world);
	render.disable_state(graphics.STATE_DEPTH_TEST);

	render.draw_debug3d();

	render.set_camera(undefined);

	// render GUI
	const camera_gui = state.camera_gui;
	render.set_view(camera_gui.view);
	render.set_projection(camera_gui.proj);

	render.enable_state(graphics.STATE_STENCIL_TEST);
	render.draw(predicates.gui, camera_gui.options);
	render.draw(predicates.debug_text, camera_gui.options);
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
		state.clear_buffers[graphics.BUFFER_TYPE_COLOR0_BIT] = message.color;
	}
}

function create_state(): State {
	const color = vmath.vector4(0, 0, 0, 0);
	color.x = sys.get_config_number('render.clear_color_red', 0);
	color.y = sys.get_config_number('render.clear_color_green', 0);
	color.z = sys.get_config_number('render.clear_color_blue', 0);
	color.w = sys.get_config_number('render.clear_color_alpha', 0);

	return {
		valid: false,
		window_width: 0,
		window_height: 0,
		width: 0,
		height: 0,
		prev_window_width: 0,
		prev_window_height: 0,
		clear_buffers: {
			[graphics.BUFFER_TYPE_COLOR0_BIT]: color,
			[graphics.BUFFER_TYPE_DEPTH_BIT]: 1,
			[graphics.BUFFER_TYPE_STENCIL_BIT]: 0,
		},
		camera_world: create_camera(get_fixed_fit_projection, -1000, 1000),
		camera_gui: create_camera(get_gui_projection, -1, 1),
	};
}

function create_camera(
	projection_fn: ProjectionFn,
	near: number,
	far: number,
	zoom = 1,
): Camera {
	return {
		projection_fn,
		near,
		far,
		zoom,
		proj: vmath.matrix4(),
		view: vmath.matrix4(),
		options: {
			frustum: vmath.matrix4(),
		},
	};
}

function update_state(state: State) {
	state.window_width = render.get_window_width();
	state.window_height = render.get_window_height();
	state.valid = state.window_width > 0 && state.window_height > 0;

	if (!state.valid) {
		return false;
	}

	// Make sure state updated only once when resize window
	if (
		state.window_width === state.prev_window_width &&
		state.window_height === state.prev_window_height
	) {
		return true;
	}

	state.prev_window_width = state.window_width;
	state.prev_window_height = state.window_height;
	state.width = render.get_width();
	state.height = render.get_height();

	update_camera(state.camera_world, state);
	update_camera(state.camera_gui, state);

	return true;
}

function update_camera(camera: Camera, state: State) {
	camera.proj = camera.projection_fn(camera, state);
	camera.options.frustum = camera.proj.mul(camera.view);
}

function set_camera_world(state: State): CameraOptions {
	const camera_world = state.camera_world;
	render.set_view(camera_world.view);
	render.set_projection(camera_world.proj);

	return camera_world.options;
}

function get_fixed_fit_projection(camera: Camera, state: State) {
	camera.zoom = math.min(
		state.window_width / state.width,
		state.window_height / state.height,
	);
	const projected_width = state.window_width / camera.zoom;
	const projected_height = state.window_height / camera.zoom;
	const left = -(projected_width - state.width) / 2;
	const bottom = -(projected_height - state.height) / 2;
	const right = left + projected_width;
	const top = bottom + projected_height;

	return vmath.matrix4_orthographic(
		left,
		right,
		bottom,
		top,
		camera.near,
		camera.far,
	);
}

function get_gui_projection(camera: Camera, state: State) {
	return vmath.matrix4_orthographic(
		0,
		state.window_width,
		0,
		state.window_height,
		camera.near,
		camera.far,
	);
}
