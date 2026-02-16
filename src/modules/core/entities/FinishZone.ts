import { GameObject } from '../../engine/GameObject';
import { LevelZone } from '../types';
import { GameObjectId } from '../../types/GameObjectId';

export class FinishZone extends GameObject {
	private readonly sprite: GameObject;

	private readonly body: GameObject;

	constructor(id: GameObjectId, data: LevelZone) {
		super(id);

		this.setPosition2D(vmath.vector3(data.x, data.y, 0));

		this.sprite = new GameObject(id, 'sprite');
		this.sprite.setSize(vmath.vector3(data.width, data.height, 0));

		this.body = new GameObject(id, 'body');
		physics.set_shape(this.body.url, 'box', {
			type: physics.SHAPE_TYPE_BOX,
			dimensions: vmath.vector3(data.width, data.height, 0),
		});
	}
}
