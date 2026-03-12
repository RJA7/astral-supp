import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';
import { CoreState } from './CoreState';
import { GameObjectId } from '../engine/types/Hash';
import { level1 } from './levels/Level1';
import { LevelData, LevelPart, PickupType } from './types/LevelData';
import { assertNever } from '../engine/utils/AssertNever';

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
			const portalData = this.getPortalDataById(portalId);
			this.state.setLevelPart(portalData.targetPart);
		});

		this.state.onPlayerPickupCollision.add((pickupId: GameObjectId) => {
			const pickupData = this.getPickupDataById(pickupId);
			this.handlePickupCollected(pickupData.type);
		});

		this.state.onLevelSpeedChanged.addAndCall(() => {
			this.levelLayout.root.spine_model.playbackRate = this.state.levelSpeed;
		});
	}

	private teleportTo(levelPart: LevelPart) {
		this.levelLayout.root.delete();
		this.levelLayout = this.createLevelLayout(
			this.state.levelNumber,
			levelPart,
		);
	}

	public resize() {
		// this.levelLayout.bg.sprite.width = screen.width;
		// this.levelLayout.bg.sprite.height = screen.height;
	}

	private createLevelLayout(levelNumber: number, levelPart: LevelPart) {
		const { player, cursor } = this.coreLayout;
		const { level_factory, safe_zone_factory } = this.coreLayout.root;

		level_factory.setPrototype(
			`/main/levels/level_${levelNumber}_${levelPart}.collectionc`,
		);
		const levelLayout = level_factory.createLayout(levelSchema);
		this.levelLayout = levelLayout;
		this.coreLayout.world.addChild(levelLayout.root);

		const outlineSize = vmath.vector3(50, 50, 0);

		levelLayout.root.spine_model.safe_zones.forEach((safeZoneBone, i) => {
			levelLayout.root.spine_model.hideSlotAttachment(`safe_zone_slot${i}`);

			const safeZone = safe_zone_factory.create(safeZoneSchema);
			safeZoneBone.addChild(safeZone);

			const boneScale = safeZoneBone.getScale();
			safeZone.setScale(vmath.vector3(1 / boneScale.x, 1 / boneScale.y, 1));
			safeZone.sprite.setSize(boneScale.add(outlineSize));
			safeZone.body.box.set(boneScale);
		});

		levelLayout.portals.forEach((portal) => {
			const portalData = this.getPortalDataById(portal.id);
			const asset = this.data.colorByPart[portalData.targetPart];
			portal.sprite.playFlipBook(asset);
		});

		levelLayout.pickups.forEach((pickup) => {
			const pickupData = this.getPickupDataById(pickup.id);
			pickup.sprite.playFlipBook(pickupData.color);
		});

		const playerPosition = this.levelLayout.player_position.getWorldPosition();
		player.setScale2D(this.levelLayout.root.getScale());
		player.setPosition2D(playerPosition);
		cursor.setPosition2D(playerPosition);

		return levelLayout;
	}

	private getPortalDataById(portalId: GameObjectId) {
		const name = this.levelLayout.nameById.get(portalId)!;
		return this.data.parts[this.state.levelPart].portals[name];
	}

	private getPickupDataById(pickupId: GameObjectId) {
		const name = this.levelLayout.nameById.get(pickupId)!;
		return this.data.parts[this.state.levelPart].pickups[name];
	}

	private handlePickupCollected(type: PickupType) {
		if (type === PickupType.SpeedUp) {
			this.state.setLevelSpeed(2);
		} else if (type === PickupType.SlowDown) {
			this.state.setLevelSpeed(0.5);
		} else {
			assertNever(type);
		}
	}
}
