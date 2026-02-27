import { IdsMap } from '../../engine/types/Hash';
import { CollectionSchema, GameObjectSchema } from '../../engine/layout/types';
import { createCollectionLayout } from '../../engine/layout/CollectionLayout';
import { body, list, spineModel } from '../../engine/layout/Elements';
import { Factory } from '../../engine/components/Factory';
import { Sprite } from '../../engine/components/Sprite';
import { BoxShape } from '../../engine/shapes/BoxShape';

const schema = {
	root: {
		spine_model: spineModel({
			safe_zones: list({}),
		}),
		safe_zone_factory: Factory,
	},
} satisfies CollectionSchema;

const safeZoneSchema = {
	sprite: Sprite,
	body: body({
		box: BoxShape,
	}),
} satisfies GameObjectSchema;

// type Layout = CollectionLayout<typeof schema>;

const outlineSize = vmath.vector3(50, 50, 0);

export function playLevelAnimations(levelIdsMap: IdsMap) {
	const layout = createCollectionLayout(schema, levelIdsMap);
	layout.root.spine_model.alpha = 0;

	layout.root.spine_model.safe_zones.forEach((safeZoneBone) => {
		const safeZone = layout.root.safe_zone_factory.create(safeZoneSchema);
		safeZoneBone.addChild(safeZone);

		const boneScale = safeZoneBone.getScale();
		safeZone.setScale(vmath.vector3(1 / boneScale.x, 1 / boneScale.y, 1));
		safeZone.sprite.setSize(boneScale.add(outlineSize));
		safeZone.body.box.set(boneScale);
	});
}
