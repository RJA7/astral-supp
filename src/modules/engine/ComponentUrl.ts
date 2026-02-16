import { GameObjectId } from '../types/GameObjectId';
import { Ref } from '../types/Ref';
import { DynamicGameObjectId } from '../types/Factory';

export type ComponentUrl = url & { __brand: 'ComponentUrl' };

export function componentUrl(
	id: GameObjectId | DynamicGameObjectId | Ref,
	fragment?: string | hash,
): ComponentUrl {
	const url =
		typeof id === 'string' ? msg.url(id) : msg.url(undefined, id, fragment);

	if (!go.exists(url)) {
		throw new Error(`Component ${id} does not exist`);
	}

	return url as ComponentUrl;
}
