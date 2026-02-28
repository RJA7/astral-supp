import { Component } from './Component';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { SpriteProperty } from '../types/Property';

export class SpineModel implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment, true);
	}

	set alpha(value: number) {
		go.set(this.url, SpriteProperty.Alpha, value);
	}

	get alpha() {
		return go.get(this.url, SpriteProperty.Alpha) as number;
	}

	public hideSlotAttachment(slotName: string) {
		spine.set_attachment(this.url, slotName, undefined!);
	}
}
