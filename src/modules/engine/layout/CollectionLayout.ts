import { GameObjectId, IdsMap } from '../types/Hash';
import { CollectionLayout, CollectionSchema } from './types';
import { isListLayout } from './ListLayout';
import {
	createGameObjectLayout,
	createGameObjectLayouts,
} from './GameObjectLayout';

export function createCollectionLayout<T extends CollectionSchema>(
	schema: T,
	idsMap?: IdsMap,
): CollectionLayout<T> {
	const nameById = new Map<GameObjectId, string>();
	const layout: Record<string, any> = {
		nameById,
	};

	for (const [name, goSchema] of Object.entries(schema)) {
		if (isListLayout(goSchema)) {
			layout[name] = createGameObjectLayouts(goSchema, name, nameById, idsMap);
		} else {
			const ownId = hash(`/${name}`);
			const id = idsMap ? idsMap.get(ownId)! : ownId;
			nameById.set(id, name);
			layout[name] = createGameObjectLayout(id, goSchema);
		}
	}

	return layout as CollectionLayout<T>;
}
