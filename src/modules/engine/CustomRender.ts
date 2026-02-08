type Self = {
	globals: vmath.vector4;
	outlineRT: render.render_target & hash;
	outlineRtPredicate: number;
	outlinePredicate: number;
	clearColor: vmath.vector4;
};

type Options = {
	constants: render.constant_buffer;
};

export function init(this: Self, cameraWorld: { options: Options }) {
	this.globals = vmath.vector4();
	cameraWorld.options.constants = render.constant_buffer();

	this.outlineRT = hash('outline_rt') as unknown as render.render_target & hash;
	this.outlineRtPredicate = render.predicate(['outline_rt']);
	this.outlinePredicate = render.predicate(['outline']);
	this.clearColor = vmath.vector4(0, 0, 0, 0);

	// Camera
	render.set_render_target_size(this.outlineRT, render.get_window_width(), render.get_window_height());
}

export function update(this: Self, dt: number, options: Options) {
	const { globals } = this;
	globals.x = render.get_width();
	globals.y = render.get_height();
	globals.z += dt;
	options.constants.globals = globals; // reassign to update buffer
}

export function draw(this: Self, options: Options) {
	// Draw into RT
	render.set_render_target(this.outlineRT);
	render.clear({
		[graphics.BUFFER_TYPE_COLOR0_BIT]: this.clearColor,
	});
	render.draw(this.outlineRtPredicate, options);
	render.set_render_target(
		render.RENDER_TARGET_DEFAULT as unknown as render.render_target,
	);

	// Draw RT onto the screen
	render.enable_texture(0, this.outlineRT, graphics.BUFFER_TYPE_COLOR0_BIT);
	render.draw(this.outlinePredicate, options);
	render.disable_texture(0);
}
