import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { createCollectionLayout } from '../engine/layout/CollectionLayout';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';

export class CoreLevel {
	private readonly levelLayout: LevelLayout;

	constructor(layout: CoreLayout) {
		const levelIdsMap = layout.root.level_factory.create();
		this.levelLayout = createCollectionLayout(levelSchema, levelIdsMap);
		layout.world.addChild(this.levelLayout.root);

		const outlineSize = vmath.vector3(50, 50, 0);

		this.levelLayout.root.spine_model.safe_zones.forEach((safeZoneBone, i) => {
			this.levelLayout.root.spine_model.hideSlotAttachment(
				`safe_zone_slot${i}`,
			);

			const safeZone = layout.root.safe_zone_factory.create(safeZoneSchema);
			safeZoneBone.addChild(safeZone);

			const boneScale = safeZoneBone.getScale();
			safeZone.setScale(vmath.vector3(1 / boneScale.x, 1 / boneScale.y, 1));
			safeZone.sprite.setSize(boneScale.add(outlineSize));
			safeZone.body.box.set(boneScale);
		});
	}

	public getPlayerPosition(): vmath.vector3 {
		return this.levelLayout.player_position.getPosition();
	}

	public resize() {
		// this.levelLayout.bg.sprite.width = screen.width;
		// this.levelLayout.bg.sprite.height = screen.height;
	}
}
