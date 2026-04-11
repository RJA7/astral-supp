import { levelSchema } from '../../layouts/LevelLayout';
import { CollectionLayout, CollectionSchema } from '../../engine/layout/types';
import { Level, LevelProps } from './levels';
import { createLevelLayout } from '../helpers/CreateLevelLayout';
import { Tweens } from '../../engine/tweens/Tweens';

const schema = {
	...levelSchema,
} satisfies CollectionSchema;

type Layout = CollectionLayout<typeof schema>;

export class Level2 implements Level {
	public readonly layout: Layout;

	private readonly tweens: Tweens;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.tweens = new Tweens();

		this.layout = createLevelLayout(level_factory, levelNumber, schema);
		this.animate();
	}

	private animate() {
		const { safe_zones } = this.layout;

		this.tweens
			.add(safe_zones[1], 'scale', { x: 0.01 }, 1)
			.yoyo()
			.repeat(Infinity, 1)
			.onUpdate((tween) => {
				const size = tween.object.getScale();
				tween.object.body.box.set(vmath.vector3(size.x, size.y, 1));
			});
	}

	destroy(): void {}
}
