import { GameObject } from '../../engine/GameObject';
import { LevelZone } from '../types';
import { DynamicGameObjectId } from '../../types/Factory';

const STROKE_SIZE = 50;

export class SafeZone extends GameObject {
	private readonly sprite: GameObject;

	private readonly body: GameObject;

	constructor(id: DynamicGameObjectId) {
		super(id);

		this.sprite = new GameObject(id, 'sprite');
		this.body = new GameObject(id, 'body');
	}

	setData(data: LevelZone) {
		this.setPosition2D(vmath.vector3(data.x, data.y, 0));

		this.sprite.setSize(
			vmath.vector3(data.width + STROKE_SIZE, data.height + STROKE_SIZE, 0),
		);

		physics.set_shape(this.body.url, 'box', {
			type: physics.SHAPE_TYPE_BOX,
			dimensions: vmath.vector3(data.width, data.height, 0),
		});
	}
}
