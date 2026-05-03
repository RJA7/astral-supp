import { CollectionLayout, collectionProxy, CollectionSchema } from '../engine';
import { ControllerName } from '../enums/ControllerName';

export const mainSchema = {
	root: {
		proxy_core: collectionProxy('core', ControllerName.CoreController),
	},
} satisfies CollectionSchema;

export type MainLayout = CollectionLayout<typeof mainSchema>;
