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
	projection_fn?: ProjectionFn;
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
	main_camera: Camera;
	cameras: {
		camera_world: Camera;
		camera_gui: Camera;
		camera_component: Camera & {
			camera?: url;
		};
	};
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

export type RenderMessage =
	| {
			mid: MessageId.ClearColor;
			color: vmath.vector4;
	  }
	| {
			mid: MessageId.SetViewProjection;
			view: vmath.matrix4;
			projection: vmath.matrix4;
	  }
	| {
			mid: MessageId.SetCameraProjection;
	  }
	| {
			mid:
				| MessageId.UseStretchProjection
				| MessageId.UseFixedProjection
				| MessageId.UseFixedFitProjection;
			near: number;
			far: number;
			zoom?: number;
	  };

const DEFAULT_NEAR = -1;
const DEFAULT_FAR = 1;
const DEFAULT_ZOOM = 1;

// projection that centers content with maintained aspect ratio and optional zoom
function get_fixed_projection(camera: Camera, state: State) {
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

// projection that centers and fits content with maintained aspect ratio
function get_fixed_fit_projection(camera: Camera, state: State) {
	camera.zoom = math.min(
		state.window_width / state.width,
		state.window_height / state.height,
	);
	return get_fixed_projection(camera, state);
}

// projection that stretches content
function get_stretch_projection(camera: Camera, state: State) {
	return vmath.matrix4_orthographic(
		0,
		state.width,
		0,
		state.height,
		camera.near,
		camera.far,
	);
}

// projection for gu
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

function update_clear_color(state: State, color: vmath.vector4) {
	state.clear_buffers[graphics.BUFFER_TYPE_COLOR0_BIT] = color;
}

function update_camera(camera: Camera, state: State) {
	if (camera.projection_fn) {
		camera.proj = camera.projection_fn(camera, state);
		camera.options.frustum = camera.proj.mul(camera.view);
	}
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

	for (const camera of Object.values(state.cameras)) {
		update_camera(camera, state);
	}

	return true;
}

function init_camera(
	camera: Camera,
	projection_fn: ProjectionFn,
	near: number = DEFAULT_NEAR,
	far: number = DEFAULT_FAR,
	zoom: number = DEFAULT_ZOOM,
) {
	camera.view = vmath.matrix4();
	camera.near = near;
	camera.far = far;
	camera.zoom = zoom;
	camera.projection_fn = projection_fn;
}

function create_camera(): Camera {
	return {
		projection_fn: get_stretch_projection,
		near: DEFAULT_NEAR,
		far: DEFAULT_FAR,
		zoom: DEFAULT_ZOOM,
		proj: vmath.matrix4(),
		view: vmath.matrix4(),
		options: {
			frustum: vmath.matrix4(),
		},
	};
}

function create_state(): State {
	const color = vmath.vector4(0, 0, 0, 0);
	color.x = sys.get_config_number('render.clear_color_red', 0);
	color.y = sys.get_config_number('render.clear_color_green', 0);
	color.z = sys.get_config_number('render.clear_color_blue', 0);
	color.w = sys.get_config_number('render.clear_color_alpha', 0);

	const camera_world = create_camera();
	init_camera(camera_world, get_stretch_projection);
	const camera_gui = create_camera();
	init_camera(camera_gui, get_gui_projection);
	// Create a special camera that wraps camera components (if they exist)
	// It will take precedence over any other camera, and not change from messages
	const camera_component = create_camera();

	return {
		valid: false,
		window_width: 0,
		window_height: 0,
		width: 0,
		height: 0,
		prev_window_width: 0,
		prev_window_height: 0,
		main_camera: camera_world,
		cameras: {
			camera_world,
			camera_gui,
			camera_component,
		},
		clear_buffers: {
			[graphics.BUFFER_TYPE_COLOR0_BIT]: color,
			[graphics.BUFFER_TYPE_DEPTH_BIT]: 1,
			[graphics.BUFFER_TYPE_STENCIL_BIT]: 0,
		},
	};
}

function set_camera_world(state: State): CameraOptions {
	const camera_components = camera.get_cameras();

	// This will set the last enabled camera from the stack of camera components
	if (camera_components.length > 0) {
		for (let i = camera_components.length - 1; i >= 0; i--) {
			if (camera.get_enabled(camera_components[i])) {
				const camera_component = state.cameras.camera_component;
				camera_component.camera = camera_components[i];
				render.set_camera(camera_component.camera, { use_frustum: true });
				// The frustum will be overridden by the render.set_camera call,
				// so we don't need to return anything here other than an empty table.
				return camera_component.options;
			}
		}
	}

	// If no active camera was found, we use the default main "camera world" camera
	const camera_world = state.cameras.camera_world;
	render.set_view(camera_world.view);
	render.set_projection(camera_world.proj);

	return camera_world.options;
}

function reset_camera_world(state: State) {
	// unbind the camera if a camera component is used
	if (state.cameras.camera_component.camera) {
		state.cameras.camera_component.camera = undefined;
		render.set_camera(undefined);
	}
}

export function init(this: Self) {
	this.predicates = {
		tile: render.predicate(['tile']),
		gui: render.predicate(['gui']),
		particle: render.predicate(['particle']),
		model: render.predicate(['model']),
		debug_text: render.predicate(['debug_text']),
	};

	// default is stretch projection. copy from builtins and change for different projection
	// or send a message to the render script to change projection:
	// msg.post("@render:", "use_stretch_projection", { near = -1, far = 1 })
	// msg.post("@render:", "use_fixed_projection", { near = -1, far = 1, zoom = 2 })
	// msg.post("@render:", "use_fixed_fit_projection", { near = -1, far = 1 })

	this.state = create_state();
	update_state(this.state);
}

export function update(this: Self, _dt: number) {
	const state = this.state;
	if (!state.valid) {
		if (!update_state(state)) {
			return;
		}
	}

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

	reset_camera_world(state);

	// render GUI
	const camera_gui = state.cameras.camera_gui;
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
	const camera = state.main_camera;

	if (message.mid === MessageId.ClearColor) {
		update_clear_color(state, message.color);
	} else if (message.mid === MessageId.window_resized) {
		update_state(state);
	} else if (message.mid === MessageId.SetViewProjection) {
		camera.view = message.view;
		this.camera_projection = message.projection;
		update_camera(camera, state);
	} else if (message.mid === MessageId.SetCameraProjection) {
		camera.projection_fn = () => this.camera_projection;
	} else if (message.mid === MessageId.UseStretchProjection) {
		init_camera(camera, get_stretch_projection, message.near, message.far);
		update_camera(camera, state);
	} else if (message.mid === MessageId.UseFixedProjection) {
		init_camera(
			camera,
			get_fixed_projection,
			message.near,
			message.far,
			message.zoom,
		);
		update_camera(camera, state);
	} else if (message.mid === MessageId.UseFixedFitProjection) {
		init_camera(camera, get_fixed_fit_projection, message.near, message.far);
		update_camera(camera, state);
	}
}
