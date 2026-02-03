enum Predicate {
	mask = 'mask',
	masked = 'masked',
}

type Self = {
	predicates: Record<Predicate, number>;
	constants: {
		globals: vmath.vector4; // resolution - xy, z - time, z - unused
	};
};

export function addPredicates(this: Self) {
	Object.values(Predicate).forEach((predicate) => {
		this.predicates[predicate] = render.predicate([predicate]);
	});

	this.constants = Object.assign(render.constant_buffer(), {
		globals: vmath.vector4(),
	});
}

export function update(
	this: Self,
	dt: number,
	drawOptions: { constants?: render.constant_buffer },
) {
	const { globals } = this.constants;
	globals.x = render.get_width();
	globals.y = render.get_height();
	globals.z += dt;
	drawOptions.constants = drawOptions.constants || this.constants;
	drawOptions.constants.globals = globals; // reassign to update buffer

	const predicates = this.predicates;

	// STENCIL MASK PASS
	render.enable_state(graphics.STATE_STENCIL_TEST);
	render.disable_state(graphics.STATE_BLEND);

	// Clear stencil before writing
	render.clear({ [graphics.BUFFER_TYPE_STENCIL_BIT]: 0 });

	// Write stencil = 1 where mask objects are drawn
	render.set_stencil_func(graphics.COMPARE_FUNC_ALWAYS, 1, 0xff);

	render.set_stencil_op(
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_REPLACE,
	);

	render.set_color_mask(false, false, false, false);
	render.draw(predicates.mask, drawOptions);
	render.set_color_mask(true, true, true, true);

	// MASKED EFFECT PASS
	render.enable_state(graphics.STATE_BLEND);

	render.set_stencil_func(graphics.COMPARE_FUNC_EQUAL, 1, 0xff);

	render.set_stencil_op(
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_KEEP,
	);

	render.draw(predicates.masked, drawOptions);

	// Disable stencil so rest of world is normal
	render.disable_state(graphics.STATE_STENCIL_TEST);
}
