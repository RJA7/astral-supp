import {
	ComponentType,
	ListLayout,
	ListSchema,
	RigidBodySchema,
	RigidBodySchemaShapes,
} from './types';

export function body<T extends RigidBodySchemaShapes>(
	shapes: T,
): RigidBodySchema<T> {
	return {
		type: ComponentType.RigidBody,
		shapes,
	};
}

export function list<T extends ListSchema>(
	schema: T,
	baseName?: string,
): ListLayout<T> {
	return {
		isList: true,
		schema,
		baseName,
	};
}
