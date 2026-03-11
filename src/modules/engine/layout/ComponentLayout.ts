import { resolveListItemName } from './ListLayout';
import {
	ComponentLayout,
	ComponentSchema,
	ComponentType,
	ListLayout,
} from './types';
import { componentExists, componentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { ComponentClass } from '../components/Component';
import { createRigidBodyLayout } from './RigidBodyLayout';
import { assertNever } from '../utils/AssertNever';
import { createSpineModelLayout } from './SpineModelLayout';
import { Script } from '../components/Script';
import { CollectionProxy } from '../components/CollectionProxy';

export function createComponentLayouts(
	list: ListLayout<ComponentSchema>,
	id: GameObjectId,
	propName: string,
) {
	const baseName = resolveListItemName(list, propName);
	const layouts: ComponentLayout<any>[] = [];

	for (let i = 0; true; i++) {
		const fragment = hash(`${baseName}${i}`);
		const url = componentUrl(id, fragment, true);

		if (!componentExists(url)) break;

		layouts.push(createComponentLayout(id, fragment, list.schema));
	}

	return layouts;
}

export function createComponentLayout<T extends ComponentSchema>(
	id: GameObjectId,
	fragment: Fragment,
	schema: T,
): ComponentLayout<T> {
	if (isComponentClass(schema)) {
		return new schema(id, fragment) as ComponentLayout<T>;
	}

	if (schema.type === ComponentType.RigidBody) {
		return createRigidBodyLayout(id, fragment, schema) as ComponentLayout<T>;
	}

	if (schema.type === ComponentType.SpineModel) {
		return createSpineModelLayout(id, fragment, schema) as ComponentLayout<T>;
	}

	if (schema.type === ComponentType.Script) {
		return new Script(
			componentUrl(id, fragment, true),
			schema.controllerName,
		) as ComponentLayout<T>;
	}

	if (schema.type === ComponentType.CollectionProxy) {
		return new CollectionProxy(
			id,
			fragment,
			schema.collectionName,
			schema.controllerName,
		) as ComponentLayout<T>;
	}

	assertNever(schema);
}

function isComponentClass(schema: any): schema is ComponentClass {
	return schema.prototype; // lua check
}
