import { Sprite } from '../engine/components/Sprite';
import { CollectionFactory } from '../engine/components/CollectionFactory';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { Factory } from '../engine/components/Factory';
import { list, script } from '../engine/layout/Elements';
import { ControllerName } from '../ControllerName';

export const coreSchema = {
	root: {
		level_factory: CollectionFactory,
		safe_zone_factory: Factory,
	},
	world: {},
	player: {},
	player_center: {},
	player_edges: list({}),
	cursor: {
		sprite: Sprite,
	},
	hud: {
		gui: script(ControllerName.CoreGuiController),
	},
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;

export type PlayerLayout = CoreLayout['player'];

export type CursorLayout = CoreLayout['cursor'];
