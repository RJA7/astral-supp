import {
	CollectionFactory,
	CollectionLayout,
	CollectionSchema,
	Factory,
	list,
	script,
	Sprite,
} from '../engine';
import { ControllerName } from '../enums/ControllerName';

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
