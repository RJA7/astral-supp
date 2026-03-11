import { ComponentUrl } from '../ComponentUrl';
import { Easing } from '../types/Easing';

export type AnyEasing =
	| Easing
	| vmath.vector3
	| vmath.vector4
	| vmath.quaternion
	| ReturnType<typeof vmath.vector>;

export function wrapAnimationComplete(
	complete?: (url: ComponentUrl, property: any) => void,
) {
	if (!complete) return;

	return function (this: object, url: ComponentUrl, property: string | hash) {
		complete(url, property);
	};
}
