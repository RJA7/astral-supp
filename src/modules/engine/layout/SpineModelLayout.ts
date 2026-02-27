import { isListLayout, resolveListItemName } from './ListLayout';
import { ListLayout, SpineModelLayout, SpineModelSchema } from './types';
import { Fragment, GameObjectId } from '../types/Hash';
import { SpineModel } from '../components/SpineModel';
import { GameObject } from '../GameObject';

export function createSpineModelLayout<T extends SpineModelSchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): SpineModelLayout<T> {
	const spineModel = new SpineModel(id, fragment);
	const layout = spineModel as Record<string, any>;

	for (const [name, bone] of Object.entries(schema.bones)) {
		if (isListLayout(bone)) {
			layout[name] = createBoneLayouts(bone, name);
		} else {
			layout[name] = new GameObject(hash(name));
		}
	}

	return layout as SpineModelLayout<T>;
}

function createBoneLayouts(list: ListLayout<object>, name: string) {
	const baseName = resolveListItemName(list, name);
	const layouts = [] as GameObject[];

	for (let i = 0; true; i++) {
		const id: GameObjectId = hash(`${baseName}${i}`);

		if (!go.exists(id)) break;

		layouts.push(new GameObject(id));
	}

	return layouts;
}
