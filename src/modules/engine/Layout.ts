import { GameObject } from './GameObject';
import { ComponentClass } from './components/Component';
import { RigidBody } from './components/RigidBody';
import { ShapeClass } from './shapes/Shape';
import { Fragment, GameObjectId, IdsMap } from './types/Hash';
import { componentExists, componentUrl } from './ComponentUrl';

export type CollectionSchema = Record<
	string,
	GameObjectSchema | List<GameObjectSchema>
>;

export type GameObjectSchema = Record<
	string,
	ComponentSchema | List<ComponentSchema>
>;

export type ComponentSchema = ComponentClass | RigidBodySchema;

export type RigidBodySchema = Record<string, ShapeClass | List<ShapeClass>>;

export type CollectionLayout<T extends CollectionSchema> = {
	[K in keyof T]: T[K] extends List<any>
		? GameObjectLayout<T[K]['schema']>[]
		: T[K] extends GameObjectSchema
			? GameObjectLayout<T[K]>
			: never;
};

export type GameObjectLayout<T extends GameObjectSchema> = GameObject & {
	[K in keyof T]: T[K] extends List<any>
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

export type RigidBodyLayout<T extends RigidBodySchema> = RigidBody & {
	[K in keyof T]: T[K] extends List<any>
		? InstanceType<T[K]['schema']>[]
		: T[K] extends ShapeClass
			? InstanceType<T[K]>
			: never;
};

export function createCollectionLayout<T extends CollectionSchema>(
	schema: T,
	map?: IdsMap,
): CollectionLayout<T> {
	const layout: Record<string, any> = {};

	for (const [name, goSchema] of Object.entries(schema)) {
		if (isList(goSchema)) {
			const list = goSchema as List<GameObjectSchema>;
			const baseName = list.baseName ?? name.slice(0, -1);
			const layouts = [] as GameObjectLayout<any>[];
			layout[name] = layouts;

			for (let i = 0; true; i++) {
				const ownId = hash(`/${baseName}${i}`);
				const id = map ? map.get(ownId) : ownId;

				if (!id || !go.exists(id)) break;

				layouts.push(createGameObjectLayout(id, list.schema));
			}
		} else {
			const ownId = hash(`/${name}`);
			const id = map ? map.get(ownId)! : ownId;
			layout[name] = createGameObjectLayout(id, goSchema);
		}
	}

	return layout as CollectionLayout<T>;
}

export function createGameObjectLayout<T extends GameObjectSchema>(
	id: GameObjectId,
	schema: T,
): GameObjectLayout<T> {
	const layout: Record<string, any> = new GameObject(id);

	for (const [name, componentSchema] of Object.entries(schema)) {
		if (isList(componentSchema)) {
			const list = componentSchema as List<ComponentSchema>;
			const baseName = list.baseName ?? name.slice(0, -1);
			const layouts = [] as ComponentLayout<any>[];
			layout[name] = layouts;

			for (let i = 0; true; i++) {
				const fragment = hash(`${baseName}${i}`);
				const url = componentUrl(id, fragment, true);

				if (!componentExists(url)) break;

				layouts.push(createComponentLayout(id, fragment, list.schema));
			}
		} else {
			layout[name] = createComponentLayout(id, hash(name), componentSchema);
		}
	}

	return layout as GameObjectLayout<T>;
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
	const body = new RigidBody(id, fragment);
	const layout = body as Record<string, any>;

	for (const [name, Shape] of Object.entries(schema)) {
		if (isList(Shape)) {
			const list = Shape as List<ShapeClass>;
			const baseName = list.baseName ?? name.slice(0, -1);
			const layouts = [] as InstanceType<ShapeClass>[];
			layout[name] = layouts;

			for (let i = 0; true; i++) {
				const shapeId = hash(`${baseName}${i}`);

				if (!shapeExists(body.url, shapeId)) break;

				layouts.push(new list.schema(body.url, shapeId));
			}
		} else {
			layout[name] = new Shape(body.url, hash(name));
		}
	}

	return layout as RigidBodyLayout<T>;
}

type ListSchema = GameObjectSchema | ComponentSchema | ShapeClass;

export type List<T extends ListSchema> = {
	isList: true;
	schema: T;
	baseName?: string;
};

export function list<T extends ListSchema>(
	schema: T,
	baseName?: string,
): List<T> {
	return {
		isList: true,
		schema,
		baseName,
	};
}

function isList(schema: any): schema is List<any> {
	return schema.isList === true;
}

function shapeExists(bodyUrl: url, shapeId: hash) {
	const [ok, _] = pcall(physics.get_shape, bodyUrl, shapeId);
	return ok;
}
