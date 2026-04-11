import { Level1 } from './Level1';
import { Level2 } from './Level2';
import { LevelLayout } from '../../layouts/LevelLayout';
import { CollectionFactory } from '../../engine/components/CollectionFactory';

export type LevelProps = {
	level_factory: CollectionFactory;
	levelNumber: number;
};

export type Level = {
	layout: LevelLayout;
	destroy(): void;
};

export const levels: Record<number, new (props: LevelProps) => Level> = {
	1: Level1,
	2: Level2,
};
