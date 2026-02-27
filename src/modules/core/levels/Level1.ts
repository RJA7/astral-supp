import { IdsMap } from '../../engine/types/Hash';
import { CollectionSchema } from '../../engine/layout/types';
import { createCollectionLayout } from '../../engine/layout/CollectionLayout';
import { list, spineModel } from '../../engine/layout/Elements';

const schema = {
	root: {
		spineModel: spineModel({
			bones: list({}),
		}),
	},
} satisfies CollectionSchema;

// type Layout = CollectionLayout<typeof schema>;

export function playLevelAnimations(levelIdsMap: IdsMap) {
	const layout = createCollectionLayout(schema, levelIdsMap);

	// layout.root.spineModel.bones.
}
