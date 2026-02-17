import { LevelZone } from '../types';
import { SafeZoneLayout } from '../../layouts/SafeZoneLayout';

const STROKE_SIZE = 50;

export class SafeZone {
	private readonly layout: SafeZoneLayout;

	constructor(layout: SafeZoneLayout) {
		this.layout = layout;
	}

	setData(data: LevelZone) {
		this.layout.setPosition2D(vmath.vector3(data.x, data.y, 0));

		this.layout.sprite.setSize(
			vmath.vector3(data.width + STROKE_SIZE, data.height + STROKE_SIZE, 0),
		);

		physics.set_shape(this.layout.body.url, 'box', {
			type: physics.SHAPE_TYPE_BOX,
			dimensions: vmath.vector3(data.width, data.height, 0),
		});
	}
}
