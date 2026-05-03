import { Easing, GuiNode, GuiProperty } from '../engine';

export function playPopupOpening(layout: { dimmer: GuiNode; root: GuiNode }) {
	const { dimmer, root } = layout;
	const rootY = root.y;

	dimmer.alpha = 0;
	root.y += 500;

	dimmer.animate(GuiProperty.Alpha, 0.8, 0.3);
	root.animate(GuiProperty.PositionY, rootY, 0.5, Easing.BackOut);
}
