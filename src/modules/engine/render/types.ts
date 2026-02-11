import { RenderState } from './RenderState';

export type RenderPass = {
	update(state: RenderState): void;
	draw(state: RenderState): void;
};
