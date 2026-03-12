import { GameObject, GameObjectClass } from '../GameObject';
import { ComponentClass } from '../components/Component';
import { ShapeClass } from '../shapes/Shape';
import { RigidBody } from '../components/RigidBody';
import { SpineModel } from '../components/SpineModel';
import { NameById } from '../types/Hash';
import { Script } from '../components/Script';
import { ControllerName } from '../../ControllerName';
import { CollectionProxy } from '../components/CollectionProxy';
import { GuiNode } from '../components/GuiNode';

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
	| SpineModelSchema
	| ScriptSchema
	| CollectionProxySchema;

export enum ComponentType {
	RigidBody = 'RigidBody',
	SpineModel = 'SpineModel',
	Script = 'Script',
	CollectionProxy = 'CollectionProxy',
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

export type ScriptSchema<T extends ControllerName = ControllerName> = {
	type: ComponentType.Script;
	controllerName: T;
};

export type CollectionProxySchema<T extends ControllerName = ControllerName> = {
	type: ComponentType.CollectionProxy;
	collectionName: string;
	controllerName: T;
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
			: T extends ScriptSchema
				? Script<T['controllerName']>
				: T extends CollectionProxySchema
					? CollectionProxy<T['controllerName']>
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

// GUI
export type GuiSchema = Record<string, ListOr<GuiAnyNodeSchema>>;

export type GuiAnyNodeSchema = GuiNodeSchema | GuiTemplateSchema;

export type GuiNodeSchema = {
	type: 'node';
};

export type GuiTemplateSchema<T extends GuiSchema = any> = {
	type: 'template';
	schema: T;
};

export type GuiLayout<T extends GuiSchema> = {
	[K in keyof T]: T[K] extends ListLayout<GuiNodeSchema>
		? GuiNode[]
		: T[K] extends GuiNodeSchema
			? GuiNode
			: T[K] extends ListLayout<GuiTemplateSchema>
				? GuiLayout<T[K]['schema']['schema']>[]
				: T[K] extends GuiTemplateSchema
					? GuiLayout<T[K]['schema']>
					: never;
};
