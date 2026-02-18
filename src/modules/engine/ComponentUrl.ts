import { Fragment, GameObjectId } from './types/Hash';
import { SpriteProperty } from './types/Property';

export type ComponentUrl = url & { __brand: 'ComponentUrl' };

export function componentUrl(
	id: GameObjectId,
	fragment: Fragment,
	skipValidation = false,
): ComponentUrl {
	const url = msg.url(undefined, id, fragment) as ComponentUrl;

	if (!skipValidation && !componentExists(url)) {
		throw new Error(
			`Component ${id}#${fragment} does not exist in ${url.socket}`,
		);
	}

	return url;
}

export function componentExists(url: ComponentUrl) {
	return spriteExists(url) || bodyExists(url);
}

function spriteExists(url: ComponentUrl) {
	const [ok, _] = pcall(go.get, url, SpriteProperty.Width);
	return ok;
}

function bodyExists(url: ComponentUrl) {
	const [ok] = pcall(physics.get_group, url);
	return ok;
}
