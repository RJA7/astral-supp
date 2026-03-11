export enum Property {
	Position = 'position',
	PositionX = 'position.x',
	PositionY = 'position.y',
	PositionZ = 'position.z',

	Rotation = 'rotation', // quaternion
	RotationX = 'rotation.x',
	RotationY = 'rotation.y',
	RotationZ = 'rotation.z',
	RotationW = 'rotation.w',

	Euler = 'euler', // degrees
	EulerX = 'euler.x',
	EulerY = 'euler.y',
	EulerZ = 'euler.z',

	Scale = 'scale',
	ScaleX = 'scale.x',
	ScaleY = 'scale.y',
	ScaleZ = 'scale.z',
}

export enum SpriteProperty {
	Size = 'size',
	Width = 'size.x',
	Height = 'size.y',
	Depth = 'size.z',

	Tint = 'tint',
	TintR = 'tint.x',
	TintG = 'tint.y',
	TintB = 'tint.z',
	Alpha = 'tint.w',
}

export enum LabelProperty {
	Color = 'color',
	ColorR = 'color.x',
	ColorG = 'color.y',
	ColorB = 'color.z',
	ColorA = 'color.w',

	Scale = 'scale',
	ScaleX = 'scale.x',
	ScaleY = 'scale.y',
	ScaleZ = 'scale.z',

	Outline = 'outline',
	OutlineR = 'outline.x',
	OutlineG = 'outline.y',
	OutlineB = 'outline.z',
	OutlineA = 'outline.w',

	Shadow = 'shadow',
	ShadowR = 'shadow.x',
	ShadowG = 'shadow.y',
	ShadowB = 'shadow.z',
	ShadowA = 'shadow.w',
}

export enum GuiProperty {
	Position = 'position',
	PositionX = 'position.x',
	PositionY = 'position.y',
	PositionZ = 'position.z',

	Rotation = 'rotation', // number

	Scale = 'scale',
	ScaleX = 'scale.x',
	ScaleY = 'scale.y',
	ScaleZ = 'scale.z',

	Color = 'color',
	ColorR = 'color.x',
	ColorG = 'color.y',
	ColorB = 'color.z',
	ColorA = 'color.w',

	Outline = 'outline',
	OutlineR = 'outline.x',
	OutlineG = 'outline.y',
	OutlineB = 'outline.z',
	OutlineA = 'outline.w',

	Shadow = 'shadow',
	ShadowR = 'shadow.x',
	ShadowG = 'shadow.y',
	ShadowB = 'shadow.z',
	ShadowA = 'shadow.w',

	Size = 'size',
	Width = 'size.x',
	Height = 'size.y',
	Depth = 'size.z',
}

export enum ParticleProperty {
	scale = 'scale', // number
}
