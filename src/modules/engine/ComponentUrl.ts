import { Fragment, GameObjectId } from './types/GameObjectId';

export type ComponentUrl = url & { __brand: 'ComponentUrl' };

export function componentUrl(
	id: GameObjectId,
	fragment?: Fragment,
): ComponentUrl {
	const url = msg.url(undefined, id, fragment);

	if (!go.exists(url)) {
		const message = fragment
			? `Component ${id}#${fragment} does not exist in ${url.socket}`
			: `Game object ${id} does not exist in ${url.socket}`;
		throw new Error(message);
	}

	return url as ComponentUrl;
}
