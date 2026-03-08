import { GameObject, GameObjectClass } from '../GameObject';
import { ComponentClass } from '../components/Component';
import { ShapeClass } from '../shapes/Shape';
import { RigidBody } from '../components/RigidBody';
import { SpineModel } from '../components/SpineModel';
import { NameById } from '../types/Hash';

export type ListLayout<T> = {
	isList: true;
	schema: T;
	baseName?: string;
};

type ListOr<T> = T | ListLayout<T>;

export type CollectionSchema = Record<string, ListOr<GameObjectSchema>>;

export type GameObjectSchema = Record<string, ListOr<ComponentSchema>>;

export type ComponentSchema =
	| ComponentClass
	| RigidBodySchema
	| SpineModelSchema;

export enum ComponentType {
	RigidBody = 'RigidBody',
	SpineModel = 'SpineModel',
}

export type RigidBodySchemaShapes = Record<string, ListOr<ShapeClass>>;

export type RigidBodySchema<
	T extends RigidBodySchemaShapes = RigidBodySchemaShapes,
> = {
	type: ComponentType.RigidBody;
	shapes: T;
};

export type SpineModelBones = Record<string, ListOr<GameObjectClass>>;

export type SpineModelSchema<T extends SpineModelBones = SpineModelBones> = {
	type: ComponentType.SpineModel;
	bones: T;
};

export type CollectionLayout<T extends CollectionSchema> = {
	nameById: NameById;
} & {
	[K in keyof T]: T[K] extends ListLayout<GameObjectSchema>
		? GameObjectLayout<T[K]['schema']>[]
		: T[K] extends GameObjectSchema
			? GameObjectLayout<T[K]>
			: never;
};

export type GameObjectLayout<T extends GameObjectSchema> = GameObject & {
	[K in keyof T]: T[K] extends ListLayout<ComponentSchema>
		? ComponentLayout<T[K]['schema']>[]
		: T[K] extends ComponentSchema
			? ComponentLayout<T[K]>
			: never;
};

export type ComponentLayout<T extends ComponentSchema> =
	T extends RigidBodySchema
		? RigidBodyLayout<T>
		: T extends SpineModelSchema
			? SpineModelLayout<T>
			: T extends ComponentClass
				? InstanceType<T>
				: never;

export type RigidBodyLayout<
	S extends RigidBodySchema,
	T = S['shapes'],
> = RigidBody & {
	[K in keyof T]: T[K] extends ListLayout<ShapeClass>
		? InstanceType<T[K]['schema']>[]
		: T[K] extends ShapeClass
			? InstanceType<T[K]>
			: never;
};

export type SpineModelLayout<
	S extends SpineModelSchema,
	T = S['bones'],
> = SpineModel & {
	[K in keyof T]: T[K] extends ListLayout<object> ? GameObject[] : GameObject;
};
