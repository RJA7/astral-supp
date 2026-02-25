import { ListLayout } from './types';

export function isListLayout(schema: any): schema is ListLayout<any> {
	return schema.isList === true;
}

export function resolveListItemName(
	list: ListLayout<any>,
	propertyName: string,
) {
	return list.baseName ?? propertyName.slice(0, -1);
}
