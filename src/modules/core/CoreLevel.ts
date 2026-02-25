import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { playLevelAnimations } from './levels/Level1';
import { createCollectionLayout } from '../engine/layout/CollectionLayout';
import { screen } from '../engine/render/Screen';

export class CoreLevel {
	private readonly levelLayout: LevelLayout;

	constructor(layout: CoreLayout) {
		const levelIdsMap = layout.root.level_factory.create();
		this.levelLayout = createCollectionLayout(levelSchema, levelIdsMap);

		this.levelLayout.finish_zone.body.box.set(
			this.levelLayout.finish_zone.sprite.getSize(),
		);

		const stroke = vmath.vector3(50, 50, 0);

		for (const safeZoneLayout of this.levelLayout.safe_zones) {
			const { sprite, body } = safeZoneLayout;
			body.box.set(safeZoneLayout.sprite.getSize().sub(stroke));
			sprite.setSize(sprite.getSize());
		}

		playLevelAnimations(levelIdsMap);
	}

	public getPlayerPosition(): vmath.vector3 {
		return this.levelLayout.player_position.getPosition();
	}

	public resize() {
		this.levelLayout.bg.sprite.width = screen.width;
		this.levelLayout.bg.sprite.height = screen.height;
	}
}
