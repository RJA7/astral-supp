import { CollectionSchema, createCollectionLayout } from '../../engine/Layout';
import { Property } from '../../engine/types/Property';
import { Playback } from '../../engine/types/Playback';
import { Easing } from '../../engine/types/Easing';
import { IdsMap } from '../../engine/types/Hash';

const schema = {
	safe_zone5: {},
	safe_zone6: {},
} satisfies CollectionSchema;

// type Layout = CollectionLayout<typeof schema>;

export function playLevelAnimations(levelIdsMap: IdsMap) {
	const layout = createCollectionLayout(schema, levelIdsMap);

	layout.safe_zone5.animate(
		Property.PositionX,
		-472,
		3,
		Easing.INOUTSINE,
		0,
		Playback.PLAYBACK_LOOP_PINGPONG,
	);

	layout.safe_zone6.animate(
		Property.PositionX,
		370,
		3,
		Easing.INOUTSINE,
		0,
		Playback.PLAYBACK_LOOP_PINGPONG,
	);
}
