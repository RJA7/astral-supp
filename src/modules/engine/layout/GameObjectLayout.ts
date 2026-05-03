import { GameObjectId, IdsMap } from '../types/Hash';
import { GameObject } from '../GameObject';
import { GameObjectLayout, GameObjectSchema, ListLayout } from './types';
import { isListLayout, resolveListItemName } from './ListLayout';
import {
	createComponentLayout,
	createComponentLayouts,
} from './ComponentLayout';

export function createGameObjectLayouts(
	list: ListLayout<GameObjectSchema>,
	propName: string,
	map?: IdsMap,
) {
	const baseName = resolveListItemName(list, propName);
	const layouts: GameObjectLayout<any>[] = [];

	for (let i = 0; true; i++) {
		const goName = `${baseName}${i}`;
		const ownId = hash(`/${goName}`);
		const id = map ? map.get(ownId) : ownId;

		if (!id || !go.exists(id)) break;

		layouts.push(createGameObjectLayout(id, list.schema));
	}

	return layouts;
}

export function createGameObjectLayout<T extends GameObjectSchema>(
	id: GameObjectId,
	schema: T,
): GameObjectLayout<T> {
	const layout: Record<string, any> = new GameObject(id);

	for (const [name, componentSchema] of Object.entries(schema)) {
		if (isListLayout(componentSchema)) {
			layout[name] = createComponentLayouts(componentSchema, id, name);
		} else {
			layout[name] = createComponentLayout(id, hash(name), componentSchema);
		}
	}

	return layout as GameObjectLayout<T>;
}
