import { GameObjectLayout, GameObjectSchema } from '../engine/layout/types';
import { Factory } from '../engine/components/Factory';
import { PopupName } from '../engine/popups/types/PopupName';

export const popupsSchema: Record<PopupName, typeof Factory> =
	Object.fromEntries(
		Object.values(PopupName).map((name) => [name, Factory]),
	) as Record<PopupName, typeof Factory> satisfies GameObjectSchema;

export type PopupsLayout = GameObjectLayout<typeof popupsSchema>;
