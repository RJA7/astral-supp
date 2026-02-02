enum Predicate {
	bg_effect = 'bg_effect',
	mask = 'mask',
	effect = 'effect',
}

type Self = {
	predicates: Record<Predicate, number>;
};

export function addPredicates(this: Self) {
	Object.values(Predicate).forEach((predicate) => {
		this.predicates[predicate] = render.predicate([predicate]);
	});
}

export function renderMasked(this: Self, drawOptionsWorld: object) {
	const predicates = this.predicates;

	render.draw(predicates.bg_effect, drawOptionsWorld);

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
	render.draw(predicates.mask, drawOptionsWorld);
	render.set_color_mask(true, true, true, true);

	// MASKED EFFECT PASS
	render.enable_state(graphics.STATE_BLEND);

	render.set_stencil_func(graphics.COMPARE_FUNC_EQUAL, 1, 0xff);

	render.set_stencil_op(
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_KEEP,
		graphics.STENCIL_OP_KEEP,
	);

	render.draw(predicates.effect, drawOptionsWorld);

	// Disable stencil so rest of world is normal
	render.disable_state(graphics.STATE_STENCIL_TEST);
}
