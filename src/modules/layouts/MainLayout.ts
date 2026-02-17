import { CollectionLayout, CollectionSchema } from '../engine/Layout';
import { CollectionProxy } from '../engine/components/CollectionProxy';

export const mainSchema = {
	root: {
		proxy_core: CollectionProxy,
	},
} satisfies CollectionSchema;

export type MainLayout = CollectionLayout<typeof mainSchema>;
