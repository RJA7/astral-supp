export enum Property {
	// GO
	Position = 'position', // vector3
	Rotation = 'rotation', // quaternion
	Euler = 'euler', // vector3 (degrees)
	Scale = 'scale', // vector3

	PositionX = 'position.x',
	PositionY = 'position.y',
	PositionZ = 'position.z',

	RotationX = 'rotation.x',
	RotationY = 'rotation.y',
	RotationZ = 'rotation.z',
	RotationW = 'rotation.w',

	EulerX = 'euler.x',
	EulerY = 'euler.y',
	EulerZ = 'euler.z',

	ScaleX = 'scale.x',
	ScaleY = 'scale.y',
	ScaleZ = 'scale.z',

	// Sprite
	Tint = 'tint', // vector4 (RGBA)
	Size = 'size', // vector3 (local size)

	TintR = 'tint.x',
	TintG = 'tint.y',
	TintB = 'tint.z',
	Alpha = 'tint.w',

	// Label
	Color = 'color', // vector4 (RGBA)
	// scale vector3
	Outline = 'outline', // vector4
	Shadow = 'shadow', // vector4

	ColorR = 'color.x',
	ColorG = 'color.y',
	ColorB = 'color.z',
	ColorA = 'color.w',

	OutlineR = 'outline.x',
	OutlineG = 'outline.y',
	OutlineB = 'outline.z',
	OutlineA = 'outline.w',

	ShadowR = 'shadow.x',
	ShadowG = 'shadow.y',
	ShadowB = 'shadow.z',
	ShadowA = 'shadow.w',

	// GUI
	// position vector3
	// rotation number !!!!!!!!!!!!!!!!!!!!!!!
	// scale vector3
	// color vector4
	// outline vector4
	// shadow vector4
	// size vector3

	// Particle
	// scale number !!!!!!!!!!!!!!!!!!!!!!!
}
