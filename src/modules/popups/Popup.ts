import { Script } from '../engine/components/Script';
import { ControllerName } from '../ControllerName';
import { GameObjectId } from '../engine/types/Hash';

export class Popup<T extends ControllerName> {
	public readonly rootId: GameObjectId;
	public readonly script: Script<T>;

	constructor(rootId: GameObjectId, script: Script<T>) {
		this.rootId = rootId;
		this.script = script;
	}
}
