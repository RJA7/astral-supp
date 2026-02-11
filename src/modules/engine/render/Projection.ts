import { Camera } from './Camera';
import { RenderState } from './RenderState';

export type ProjectionFn = (
	camera: Camera,
	state: RenderState,
) => vmath.matrix4;

function fixedProjection(camera: Camera, state: RenderState) {
	const projectedWidth = state.windowWidth / camera.zoom;
	const projectedHeight = state.windowHeight / camera.zoom;
	const left = -(projectedWidth - state.width) / 2;
	const bottom = -(projectedHeight - state.height) / 2;
	const right = left + projectedWidth;
	const top = bottom + projectedHeight;

	return vmath.matrix4_orthographic(
		left,
		right,
		bottom,
		top,
		camera.near,
		camera.far,
	);
}

function fixedFitProjection(camera: Camera, state: RenderState) {
	camera.zoom = math.min(
		state.windowWidth / state.width,
		state.windowHeight / state.height,
	);

	return fixedProjection(camera, state);
}

function guiProjection(camera: Camera, state: RenderState) {
	return vmath.matrix4_orthographic(
		0,
		state.windowWidth,
		0,
		state.windowHeight,
		camera.near,
		camera.far,
	);
}

function renderTargetProjection(camera: Camera, state: RenderState) {
	const width = state.width; // 1280
	const height = state.height; // 720

	const projectedWidth = width / camera.zoom;
	const projectedHeight = height / camera.zoom;

	return vmath.matrix4_orthographic(
		0,
		projectedWidth,
		0,
		projectedHeight,
		camera.near,
		camera.far,
	);
}

export const Projection = {
	fixed: fixedProjection,
	fixedFit: fixedFitProjection,
	gui: guiProjection,
	renderTarget: renderTargetProjection,
} satisfies Record<string, ProjectionFn>;
