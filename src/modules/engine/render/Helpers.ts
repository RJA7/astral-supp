import { Camera } from './Camera';

export function setCamera(camera: Camera): void {
	render.set_projection(camera.proj);
	render.set_view(camera.view);
}
