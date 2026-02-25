import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { CollectionProxy } from '../engine/components/CollectionProxy';

export const mainSchema = {
	root: {
		proxy_core: CollectionProxy,
	},
} satisfies CollectionSchema;

export type MainLayout = CollectionLayout<typeof mainSchema>;
