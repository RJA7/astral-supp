import { Shape } from './Shape';
import { RigidBody } from '../components/RigidBody';
import { ShapeId } from '../types/Hash';

export class BoxShape implements Shape {
	private readonly body: RigidBody;
	private readonly shapeId: ShapeId;

	constructor(body: RigidBody, shapeId: ShapeId) {
		this.body = body;
		this.shapeId = shapeId;
	}

	public set(dimensions: vmath.vector3) {
		physics.set_shape(this.body.url, this.shapeId, {
			type: physics.SHAPE_TYPE_BOX,
			dimensions,
		});
	}
}
