import {
	CollectionFactory,
	CollectionLayout,
	CollectionSchema,
	script,
} from '../engine';
import { ControllerName } from '../enums/ControllerName';

export const coreSchema = {
	root: {
		level_factory: CollectionFactory,
	},
	hud: {
		gui: script(ControllerName.CoreGuiController),
	},
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;
