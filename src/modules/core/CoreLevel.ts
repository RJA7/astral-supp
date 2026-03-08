import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';
import { CoreState } from './CoreState';
import { GameObjectId } from '../engine/types/Hash';
import { level1 } from './levels/level1';
import { LevelData, LevelPart } from './types/LevelData';

export class CoreLevel {
	private readonly state: CoreState;

	private readonly coreLayout: CoreLayout;

	private levelLayout: LevelLayout;

	private data: LevelData = level1;

	constructor(state: CoreState, coreLayout: CoreLayout) {
		this.state = state;
		this.coreLayout = coreLayout;

		this.levelLayout = this.createLevelLayout(
			this.state.levelNumber,
			this.state.levelPart,
		);

		this.state.onLevelPartChanged.add(() => {
			this.teleportTo(this.state.levelPart);
		});

		this.state.onPlayerPortalCollision.add((portalId: GameObjectId) => {
			const name = this.levelLayout.nameById.get(portalId);

			if (!name) return;

			const portalData = this.data.parts[this.state.levelPart].portals[name];

			if (!portalData) return;

			this.state.setLevelPart(portalData.targetPart);
		});
	}

	private teleportTo(levelPart: LevelPart) {
		this.levelLayout.root.delete();
		this.levelLayout = this.createLevelLayout(
			this.state.levelNumber,
			levelPart,
		);

		const playerPosition = this.levelLayout.player_position.getWorldPosition();
		this.coreLayout.player.setScale2D(this.levelLayout.root.getScale());
		this.coreLayout.player.setPosition2D(playerPosition);
		this.coreLayout.cursor.setPosition2D(playerPosition);
	}

	public resize() {
		// this.levelLayout.bg.sprite.width = screen.width;
		// this.levelLayout.bg.sprite.height = screen.height;
	}

	private createLevelLayout(levelNumber: number, levelPart: LevelPart) {
		this.coreLayout.root.level_factory.setPrototype(
			`/main/levels/level_${levelNumber}_${levelPart}.collectionc`,
		);
		const levelLayout =
			this.coreLayout.root.level_factory.createLayout(levelSchema);
		this.coreLayout.world.addChild(levelLayout.root);

		const outlineSize = vmath.vector3(50, 50, 0);

		levelLayout.root.spine_model.safe_zones.forEach((safeZoneBone, i) => {
			levelLayout.root.spine_model.hideSlotAttachment(`safe_zone_slot${i}`);

			const safeZone =
				this.coreLayout.root.safe_zone_factory.create(safeZoneSchema);
			safeZoneBone.addChild(safeZone);

			const boneScale = safeZoneBone.getScale();
			safeZone.setScale(vmath.vector3(1 / boneScale.x, 1 / boneScale.y, 1));
			safeZone.sprite.setSize(boneScale.add(outlineSize));
			safeZone.body.box.set(boneScale);
		});

		return levelLayout;
	}
}
