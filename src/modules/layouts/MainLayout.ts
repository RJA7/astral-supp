import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { ControllerName } from '../ControllerName';
import { collectionProxy } from '../engine/layout/Elements';

export const mainSchema = {
	root: {
		proxy_core: collectionProxy('core', ControllerName.CoreController),
	},
} satisfies CollectionSchema;

export type MainLayout = CollectionLayout<typeof mainSchema>;
