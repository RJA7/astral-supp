import { levelSchema } from '../../layouts/LevelLayout';
import { CollectionLayout, CollectionSchema } from '../../engine/layout/types';
import { Level, LevelProps } from './levels';
import { Property } from '../../engine/types/Property';
import { Easing } from '../../engine/types/Easing';
import { Playback } from '../../engine/types/Playback';
import { createLevelLayout } from '../helpers/CreateLevelLayout';

const schema = {
	...levelSchema,
} satisfies CollectionSchema;

type Layout = CollectionLayout<typeof schema>;

export class Level2 implements Level {
	public readonly layout: Layout;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.layout = createLevelLayout(level_factory, levelNumber, schema);
		this.animate();
	}

	private animate() {
		const { safe_zones } = this.layout;

		safe_zones[1].animate(
			Property.ScaleX,
			0,
			0.5,
			Easing.SinInOut,
			0.5,
			Playback.PLAYBACK_LOOP_PINGPONG,
		);
	}

	destroy(): void {}
}
