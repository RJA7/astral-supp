import { LevelLayout } from '../../layouts/LevelLayout';
import { CollectionFactory } from '../../engine/components/CollectionFactory';
import { Level1 } from './Level1';
import { Level2 } from './Level2';
import { Level3 } from './Level3';

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
	3: Level3,
};
