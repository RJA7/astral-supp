import { LevelZone } from '../types';
import { FinishZoneLayout } from '../../layouts/CoreLayout';

export class FinishZone {
	private readonly layout: FinishZoneLayout;

	constructor(layout: FinishZoneLayout, data: LevelZone) {
		this.layout = layout;

		this.layout.setPosition2D(vmath.vector3(data.x, data.y, 0));
		this.layout.sprite.setSize(vmath.vector3(data.width, data.height, 0));
		this.layout.body.box.set(vmath.vector3(data.width, data.height, 0));
	}
}
