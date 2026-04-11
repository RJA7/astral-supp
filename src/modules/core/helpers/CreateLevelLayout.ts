import { CollectionFactory } from '../../engine/components/CollectionFactory';
import { levelSchema } from '../../layouts/LevelLayout';

export function createLevelLayout<T extends typeof levelSchema>(
	level_factory: CollectionFactory,
	levelNumber: number,
	schema: T,
) {
	level_factory.setPrototype(`/main/levels/level_${levelNumber}.collectionc`);
	return level_factory.createLayout(schema);
}
