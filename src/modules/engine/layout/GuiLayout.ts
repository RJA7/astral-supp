import { isListLayout, resolveListItemName } from './ListLayout';
import { GuiAnyNodeSchema, GuiLayout, GuiSchema, ListLayout } from './types';
import { GuiNode } from '../components/GuiNode';
import { assertNever } from '../utils/AssertNever';

export function createGuiLayout<T extends GuiSchema>(
	schema: T,
	prefix = '',
): GuiLayout<T> {
	const layout: Record<string, any> = {};

	for (const [name, nodeSchema] of Object.entries(schema)) {
		if (isListLayout(nodeSchema)) {
			layout[name] = createGuiNodeLayouts(`${prefix}${name}`, nodeSchema);
		} else {
			layout[name] = createGuiNodeLayout(`${prefix}${name}`, nodeSchema);
		}
	}

	return layout as GuiLayout<T>;
}

function createGuiNodeLayouts(
	propName: string,
	list: ListLayout<GuiAnyNodeSchema>,
) {
	const baseName = resolveListItemName(list, propName);
	const layouts: any[] = [];

	for (let i = 0; true; i++) {
		const name = `${baseName}${i}`;
		const [ok] = pcall(gui.get_node, name);

		if (!ok) break;

		layouts.push(createGuiNodeLayout(name, list.schema));
	}

	return layouts;
}

function createGuiNodeLayout(name: string, nodeSchema: GuiAnyNodeSchema) {
	if (nodeSchema.type === 'node') {
		return new GuiNode(name);
	}

	if (nodeSchema.type === 'template') {
		return createGuiLayout(nodeSchema.schema, `${name}/`);
	}

	assertNever(nodeSchema);
}
