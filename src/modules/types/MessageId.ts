import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	SwitchState = 'SwitchState',
}

patchEnum(MessageId, toHash);
