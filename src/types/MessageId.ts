import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	Input = 'Input',
}

patchEnum(MessageId, toHash);
