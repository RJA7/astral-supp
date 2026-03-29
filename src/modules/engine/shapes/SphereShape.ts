import { Shape } from './Shape';
import { ShapeId } from '../types/Hash';
import { ComponentUrl } from '../ComponentUrl';

export class SphereShape implements Shape {
	private readonly bodyUrl: ComponentUrl;
	private readonly shapeId: ShapeId;

	constructor(bodyUrl: ComponentUrl, shapeId: ShapeId) {
		this.bodyUrl = bodyUrl;
		this.shapeId = shapeId;
	}

	public set(diameter: number) {
		physics.set_shape(this.bodyUrl, this.shapeId, {
			type: physics.SHAPE_TYPE_SPHERE,
			diameter,
		});
	}
}
