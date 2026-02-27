import {
	ComponentType,
	ListLayout,
	RigidBodySchema,
	RigidBodySchemaShapes,
	SpineModelBones,
	SpineModelSchema,
} from './types';

export function body<T extends RigidBodySchemaShapes>(
	shapes: T,
): RigidBodySchema<T> {
	return {
		type: ComponentType.RigidBody,
		shapes,
	};
}

export function spineModel<T extends SpineModelBones>(
	bones: T,
): SpineModelSchema<T> {
	return {
		type: ComponentType.SpineModel,
		bones,
	};
}

export function list<T>(
	schema: T,
	baseName?: string,
): ListLayout<T> {
	return {
		isList: true,
		schema,
		baseName,
	};
}
