import { Camera } from './Camera';
import { RenderState } from './RenderState';

export type ProjectionFn = (
	camera: Camera,
	state: RenderState,
) => vmath.matrix4;

function fixedProjection(camera: Camera, state: RenderState) {
	const halfWidth = state.windowWidth / camera.zoom / 2;
	const halfHeight = state.windowHeight / camera.zoom / 2;

	return vmath.matrix4_orthographic(
		-halfWidth,
		halfWidth,
		-halfHeight,
		halfHeight,
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

	const halfWidth = width / camera.zoom / 2;
	const halfHeight = height / camera.zoom / 2;

	return vmath.matrix4_orthographic(
		-halfWidth,
		halfWidth,
		-halfHeight,
		halfHeight,
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
