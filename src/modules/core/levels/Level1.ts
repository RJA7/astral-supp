import { Property } from '../../engine/types/Property';
import { Playback } from '../../engine/types/Playback';
import { Easing } from '../../engine/types/Easing';
import { IdsMap } from '../../engine/types/Hash';
import { CollectionSchema } from '../../engine/layout/types';
import { createCollectionLayout } from '../../engine/layout/CollectionLayout';

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
		5,
		Easing.INOUTSINE,
		0,
		Playback.PLAYBACK_LOOP_PINGPONG,
	);

	layout.safe_zone6.animate(
		Property.PositionX,
		-80,
		4,
		Easing.INOUTSINE,
		0,
		Playback.PLAYBACK_LOOP_PINGPONG,
	);
}
