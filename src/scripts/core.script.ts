import { CoreRoot } from '../modules/core/CoreRoot';
import { Ref } from '../modules/types/Ref';
import { ActionId } from '../modules/types/ActionId';
import { Action } from '../modules/types/Action';

type Self = {
	root: CoreRoot;
};

export function init(this: Self) {
	this.root = new CoreRoot(Ref.CurrentGameObject);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.root.onInput(actionId, action);
}
