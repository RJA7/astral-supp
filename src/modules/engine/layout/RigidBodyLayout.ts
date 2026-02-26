import { isListLayout, resolveListItemName } from './ListLayout';
import { ShapeClass } from '../shapes/Shape';
import { ComponentUrl } from '../ComponentUrl';
import { RigidBody } from '../components/RigidBody';
import { ListLayout, RigidBodyLayout, RigidBodySchema } from './types';
import { Fragment, GameObjectId } from '../types/Hash';

export function createRigidBodyLayout<T extends RigidBodySchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): RigidBodyLayout<T> {
	const body = new RigidBody(id, fragment);
	const layout = body as Record<string, any>;

	for (const [name, shape] of Object.entries(schema.shapes)) {
		if (isListLayout(shape)) {
			layout[name] = createShapeLayouts(shape, body.url, name);
		} else {
			layout[name] = new shape(body.url, hash(name));
		}
	}

	return layout as RigidBodyLayout<T>;
}

function createShapeLayouts(
	list: ListLayout<ShapeClass>,
	bodyUrl: ComponentUrl,
	name: string,
) {
	const baseName = resolveListItemName(list, name);
	const layouts = [] as InstanceType<ShapeClass>[];

	for (let i = 0; true; i++) {
		const shapeId = hash(`${baseName}${i}`);

		if (!shapeExists(bodyUrl, shapeId)) break;

		layouts.push(new list.schema(bodyUrl, shapeId));
	}

	return layouts;
}

function shapeExists(bodyUrl: url, shapeId: hash) {
	const [ok, _] = pcall(physics.get_shape, bodyUrl, shapeId);
	return ok;
}
