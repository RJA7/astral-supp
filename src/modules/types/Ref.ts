export enum Ref {
	CurrentGameObject = '.',
	CurrentComponent = '#',

	// main collection
	MainRootGO = 'main:/root',
	CoreProxy = 'main:/state_loader#core',
	MenuProxy = 'main:/state_loader#menu',

	CoreRootGO = 'core:/root',
	MenuRootGO = 'menu:/root',

	PlayerGO = '/player',
	CursorGO = '/cursor',
}
