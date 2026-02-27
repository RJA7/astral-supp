import { isListLayout, resolveListItemName } from './ListLayout';
import { ListLayout, SpineModelLayout, SpineModelSchema } from './types';
import { Fragment, GameObjectId } from '../types/Hash';
import { SpineModel } from '../components/SpineModel';
import { GameObject } from '../GameObject';
import { ComponentUrl } from '../ComponentUrl';

export function createSpineModelLayout<T extends SpineModelSchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): SpineModelLayout<T> {
	const spineModel = new SpineModel(id, fragment);
	const layout = spineModel as Record<string, any>;

	for (const [name, bone] of Object.entries(schema.bones)) {
		if (isListLayout(bone)) {
			layout[name] = createBoneLayouts(bone, spineModel.url, name);
		} else {
			const boneId: GameObjectId = spine.get_go(spineModel.url, hash(name));
			layout[name] = new GameObject(boneId);
		}
	}

	return layout as SpineModelLayout<T>;
}

function createBoneLayouts(
	list: ListLayout<object>,
	spineModelUrl: ComponentUrl,
	name: string,
) {
	const baseName = resolveListItemName(list, name);
	const layouts = [] as GameObject[];

	for (let i = 0; true; i++) {
		const boneHash = hash(`${baseName}${i}`);

		const [ok, boneId] = pcall(spine.get_go, spineModelUrl, boneHash);
		if (!ok) break;

		layouts.push(new GameObject(boneId));
	}

	return layouts;
}
