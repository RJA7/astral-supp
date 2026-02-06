type Self = {
	globals: vmath.vector4;
};

type Options = {
	constants: render.constant_buffer;
};

export function init(this: Self, cameraWorld: { options: Options }) {
	this.globals = vmath.vector4();
	cameraWorld.options.constants = render.constant_buffer();
}

export function update(this: Self, dt: number, options: Options) {
	const { globals } = this;
	globals.x = render.get_width();
	globals.y = render.get_height();
	globals.z += dt;
	options.constants.globals = globals; // reassign to update buffer
}
