import { Easing } from '../types/Easing';

export type AnimateTo =
	| number
	| vmath.vector3
	| vmath.vector4
	| vmath.quaternion;

export type AnyEasing =
	| Easing
	| vmath.vector3
	| vmath.vector4
	| vmath.quaternion
	| ReturnType<typeof vmath.vector>;

export function wrapAnimationComplete(
	complete?: (url: any, property: any) => void,
): any {
	if (!complete) return;

	return function (this: object, url: any, property: string | hash) {
		complete(url, property);
	};
}
