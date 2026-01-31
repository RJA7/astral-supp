export function patchEnum(
	enumeration: Record<string, string>,
	mapCb: (value: string) => unknown,
) {
	Object.entries(enumeration).forEach(([key, value]) => {
		// @ts-expect-error unknown value
		enumeration[key] = mapCb(value);
	});
}

export function toHash(value: string) {
	return hash(value);
}
