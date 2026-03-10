import {
	CollectionProxySchema,
	ComponentType,
	ListLayout,
	RigidBodySchema,
	RigidBodySchemaShapes,
	ScriptSchema,
	SpineModelBones,
	SpineModelSchema,
} from './types';
import { ControllerName } from '../../ControllerName';

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

export function script<T extends ControllerName>(
	controllerName: T,
): ScriptSchema<T> {
	return {
		type: ComponentType.Script,
		controllerName,
	};
}

export function collectionProxy<T extends ControllerName>(
	collectionName: string,
	controllerName: T,
): CollectionProxySchema<T> {
	return {
		type: ComponentType.CollectionProxy,
		collectionName,
		controllerName,
	};
}

export function list<T>(schema: T, baseName?: string): ListLayout<T> {
	return {
		isList: true,
		schema,
		baseName,
	};
}
