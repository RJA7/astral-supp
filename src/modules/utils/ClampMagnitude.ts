export function clampMagnitude(
	vector: vmath.vector3,
	length: number,
): vmath.vector3 {
	const len = vmath.length(vector);

	if (len > length) {
		return vector.mul(length / len);
	}

	return vector;
}
