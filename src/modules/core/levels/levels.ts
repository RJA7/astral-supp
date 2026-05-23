import { CollectionFactory } from '../../engine';
import { LevelLayout } from '../../layouts/LevelLayout';
import { Level1 } from './Level1';
import { Level2 } from './Level2';
import { Level3 } from './Level3';
import { Level4 } from './Level4';

export type LevelProps = {
	level_factory: CollectionFactory;
	levelNumber: number;
};

export type Level = {
	layout: LevelLayout;
	start(): void;
	destroy(): void;
};

export const levels: Record<number, new (props: LevelProps) => Level> = {
	1: Level1,
	2: Level2,
	3: Level3,
	4: Level4,
};
