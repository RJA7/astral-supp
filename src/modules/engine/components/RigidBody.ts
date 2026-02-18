import { Component } from './Component';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';

export class RigidBody implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment);
	}
}
