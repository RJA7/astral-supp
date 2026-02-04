export enum Ref {
	CurrentGameObject = '.',
	CurrentComponent = '#',

	// main collection
	Main = 'main:/go#main',
	CoreProxy = 'main:/state_loader#core',
	MenuProxy = 'main:/state_loader#menu',

	// core collection
	PlayerGO = 'core:/player',
	CursorGO = 'core:/cursor',
}
