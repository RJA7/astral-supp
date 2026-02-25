import { GameObject } from '../GameObject';
import { ComponentClass } from '../components/Component';
import { ShapeClass } from '../shapes/Shape';
import { RigidBody } from '../components/RigidBody';

export type CollectionSchema = Record<
	string,
	GameObjectSchema | ListLayout<GameObjectSchema>
>;

export type GameObjectSchema = Record<
	string,
	ComponentSchema | ListLayout<ComponentSchema>
>;

export type ComponentSchema = ComponentClass | RigidBodySchema;

export enum ComponentType {
	RigidBody = 'RigidBody',
}

export type RigidBodySchemaShapes = Record<
	string,
	ShapeClass | ListLayout<ShapeClass>
>;

export type RigidBodySchema<
	T extends RigidBodySchemaShapes = RigidBodySchemaShapes,
> = {
	type: ComponentType.RigidBody;
	shapes: T;
};

export type CollectionLayout<T extends CollectionSchema> = {
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

export type ListSchema = GameObjectSchema | ComponentSchema | ShapeClass;

export type ListLayout<T extends ListSchema> = {
	isList: true;
	schema: T;
	baseName?: string;
};
