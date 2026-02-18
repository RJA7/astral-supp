import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Component } from './Component';
import { Fragment, GameObjectId } from '../types/Hash';
import {
	createGameObjectLayout,
	GameObjectLayout,
	GameObjectSchema,
} from '../Layout';

export class Factory implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment, true);
	}

	public create<T extends GameObjectSchema>(schema: T): GameObjectLayout<T> {
		const id = factory.create(this.url);
		const layout = createGameObjectLayout(id, schema);
		go.set_parent(layout.id, this.url);

		return layout;
	}
}
