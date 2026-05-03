import { Factory, GameObjectLayout, GameObjectSchema } from '../engine';
import { PopupName } from '../enums/PopupName';

export const popupsSchema: Record<PopupName, typeof Factory> =
	Object.fromEntries(
		Object.values(PopupName).map((name) => [name, Factory]),
	) as Record<PopupName, typeof Factory> satisfies GameObjectSchema;

export type PopupsLayout = GameObjectLayout<typeof popupsSchema>;
