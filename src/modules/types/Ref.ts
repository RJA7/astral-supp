export enum Ref {
	CurrentGameObject = '.',
	CurrentComponent = '#',
	Render = '@render:',

	// main collection
	RootGO = 'main:/root',
	CoreProxy = 'main:/root#proxy_core',
	MenuProxy = 'main:/root#proxy_menu',

	CoreRootGO = 'core:/root',
	MenuRootGO = 'menu:/root',

	PlayerGO = '/player',
	CursorGO = '/cursor',
}
