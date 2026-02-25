import { IdsMap } from '../types/Hash';
import { CollectionLayout, CollectionSchema } from './types';
import { isListLayout } from './ListLayout';
import {
	createGameObjectLayout,
	createGameObjectListLayout,
} from './GameObjectLayout';

export function createCollectionLayout<T extends CollectionSchema>(
	schema: T,
	map?: IdsMap,
): CollectionLayout<T> {
	const layout: Record<string, any> = {};

	for (const [name, goSchema] of Object.entries(schema)) {
		if (isListLayout(goSchema)) {
			layout[name] = createGameObjectListLayout(goSchema, name, map);
		} else {
			const ownId = hash(`/${name}`);
			const id = map ? map.get(ownId)! : ownId;
			layout[name] = createGameObjectLayout(id, goSchema);
		}
	}

	return layout as CollectionLayout<T>;
}
