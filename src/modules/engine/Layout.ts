import { GameObject } from './GameObject';
import { ComponentClass } from './components/Component';
import { RigidBody } from './components/RigidBody';
import { ShapeClass } from './shapes/Shape';
import { Fragment, GameObjectId } from './types/GameObjectId';

export type CollectionSchema = Record<string, GameObjectSchema>;

export type GameObjectSchema = Record<string, ComponentSchema>;

export type ComponentSchema = ComponentClass | RigidBodySchema;

export type RigidBodySchema = Record<string, ShapeClass>;

export type CollectionLayout<T extends CollectionSchema> = {
	[K in keyof T]: GameObjectLayout<T[K]>;
};

export type GameObjectLayout<T extends GameObjectSchema> = GameObject & {
	[K in keyof T]: ComponentLayout<T[K]>;
};

export type ComponentLayout<T extends ComponentSchema> =
	T extends RigidBodySchema
		? RigidBodyLayout<T>
		: T extends ComponentClass
			? InstanceType<T>
			: never;

export type RigidBodyLayout<T extends RigidBodySchema> = RigidBody & {
	[K in keyof T]: InstanceType<T[K]>;
};

export function createCollectionLayout<T extends CollectionSchema>(
	schema: T,
): CollectionLayout<T> {
	const layout = {} as CollectionLayout<T>;

	for (const [id, gameObjectSchema] of Object.entries(schema)) {
		// @ts-expect-error
		layout[id] = createGameObjectLayout(hash(`/${id}`), gameObjectSchema);
	}

	return layout;
}

export function createGameObjectLayout<T extends GameObjectSchema>(
	id: GameObjectId,
	schema: T,
): GameObjectLayout<T> {
	const layout = new GameObject(id) as GameObjectLayout<T>;

	for (const [fragment, componentSchema] of Object.entries(schema)) {
		// @ts-expect-error
		layout[fragment] = createComponentLayout(
			id,
			hash(fragment),
			componentSchema,
		);
	}

	return layout;
}

export function createComponentLayout<T extends ComponentSchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): ComponentLayout<T> {
	return schema.prototype // lua check
		? (new (schema as ComponentClass)(id, fragment) as ComponentLayout<T>)
		: (createRigidBodyLayout(
				id,
				fragment,
				schema as RigidBodySchema,
			) as ComponentLayout<T>);
}

export function createRigidBodyLayout<T extends RigidBodySchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): RigidBodyLayout<T> {
	const layout = new RigidBody(id, fragment) as RigidBodyLayout<T>;

	for (const [shapeId, Shape] of Object.entries(schema)) {
		// @ts-expect-error
		layout[shapeId] = new Shape(layout, hash(shapeId));
	}

	return layout;
}
