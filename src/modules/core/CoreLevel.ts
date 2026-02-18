import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { playLevelAnimations } from './levels/Level1';
import { createCollectionLayout } from '../engine/Layout';

export class CoreLevel {
	private readonly levelLayout: LevelLayout;

	constructor(layout: CoreLayout) {
		const levelIdsMap = layout.root.level_factory.create();
		this.levelLayout = createCollectionLayout(levelSchema, levelIdsMap);

		const finishData = this.levelLayout.finish;
		layout.finish_zone.setPosition2D(finishData.getPosition());
		layout.finish_zone.sprite.setSize(finishData.sprite.getSize());
		layout.finish_zone.body.box.set(finishData.sprite.getSize());

		const stroke = vmath.vector3(50, 50, 0);

		for (const safeZoneLayout of this.levelLayout.safe_zones) {
			const { sprite, body } = safeZoneLayout;
			body.box.set(safeZoneLayout.sprite.getSize().sub(stroke));
			sprite.setSize(sprite.getSize());
			layout.safe_zones.addChild(safeZoneLayout);
		}

		this.levelLayout.player_position.disable();
		this.levelLayout.finish.disable();

		playLevelAnimations(levelIdsMap);
	}

	public getPlayerPosition(): vmath.vector3 {
		return this.levelLayout.player_position.getPosition();
	}
}
