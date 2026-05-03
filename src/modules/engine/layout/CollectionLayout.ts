import { IdsMap } from '../types/Hash';
import { CollectionLayout, CollectionSchema } from './types';
import { isListLayout } from './ListLayout';
import {
	createGameObjectLayout,
	createGameObjectLayouts,
} from './GameObjectLayout';
import { Collection } from '../Collection';

export function createCollectionLayout<T extends CollectionSchema>(
	schema: T,
	idsMap?: IdsMap,
): CollectionLayout<T> {
	const layout: Record<string, any> = new Collection();

	for (const [name, goSchema] of Object.entries(schema)) {
		if (isListLayout(goSchema)) {
			layout[name] = createGameObjectLayouts(goSchema, name, idsMap);
		} else {
			const ownId = hash(`/${name}`);
			const id = idsMap ? idsMap.get(ownId)! : ownId;
			layout[name] = createGameObjectLayout(id, goSchema);
		}
	}

	return layout as CollectionLayout<T>;
}
