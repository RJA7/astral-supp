import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Component } from './Component';
import { Fragment, GameObjectId, IdsMap } from '../types/Hash';
import { CollectionLayout, CollectionSchema } from '../layout/types';
import { createCollectionLayout } from '../layout/CollectionLayout';

export class CollectionFactory implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment, true);
	}

	public create(): IdsMap {
		return collectionfactory.create(this.url);
	}

	public createLayout<T extends CollectionSchema>(
		schema: T,
	): CollectionLayout<T> {
		const map = this.create();
		return createCollectionLayout(schema, map);
	}
}
