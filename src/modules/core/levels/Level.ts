import { DEG_TO_RAD, Property, Timeline } from '../../engine';
import { LevelLayout } from '../../layouts/LevelLayout';
import { SafeZoneLayout } from '../../layouts/SafeZoneLayout';
import { bulletSchema } from '../../layouts/BulletLayout';
import { shooterSchema } from '../../layouts/ShooterLayout';
import { AnimationTrack, LevelData, ShooterData } from '../types/LevelData';
import {
	syncSafeZoneCollider,
	syncSafeZoneTweenCollider,
} from '../helpers/SyncSafeZoneCollider';
import { PhysicsGroup } from '../../enums/PhysicsGroup';

export type LevelProps = {
	layout: LevelLayout;
	safeZones: SafeZoneLayout[];
	levelData: LevelData;
};

export class Level {
	public readonly layout: LevelLayout;

	private readonly safeZones: SafeZoneLayout[];

	private readonly levelData: LevelData;

	private readonly timeline: Timeline;

	constructor({ layout, safeZones, levelData }: LevelProps) {
		this.layout = layout;
		this.safeZones = safeZones;
		this.levelData = levelData;
		this.timeline = new Timeline();
	}

	public start(): void {
		for (let i = 0; i < this.levelData.safeZones.length; i++) {
			const zoneData = this.levelData.safeZones[i];
			if (zoneData.animations) {
				for (const track of zoneData.animations) {
					this.runTrack(track, this.safeZones[i], true);
				}
			}
		}
		for (const shooter of this.levelData.shooters) {
			this.setupShooter(shooter);
		}
	}

	public destroy(): void {
		this.timeline.destroy();
	}

	private async runTrack(
		track: AnimationTrack,
		target: any,
		isSafeZone: boolean,
	): Promise<void> {
		const { group, axes } = this.parseProperty(track.property);
		const { keyframes, loop, loopDuration } = track;

		if (keyframes.length === 0) return;

		const lastKfTime = keyframes[keyframes.length - 1].time;
		const cycleDuration = loopDuration ?? lastKfTime;

		const runOnce = async () => {
			for (let i = 0; i < keyframes.length; i++) {
				const kf = keyframes[i];
				const prevTime = i > 0 ? keyframes[i - 1].time : 0;
				const duration = kf.time - prevTime;

				if (duration === 0) {
					this.applyValue(target, group, axes, kf.value, isSafeZone);
				} else {
					const tweenTarget = this.buildTweenTarget(axes, kf.value);
					const tween = this.timeline.tween(
						target as any,
						group,
						tweenTarget,
						duration,
					);
					if (isSafeZone) {
						tween.onUpdate(syncSafeZoneTweenCollider);
					}
					await this.timeline.wait(duration);
				}
			}
		};

		if (loop) {
			while (true) {
				await runOnce();
				const gap = cycleDuration - lastKfTime;
				if (gap > 0) await this.timeline.wait(gap);
			}
		} else {
			await runOnce();
		}
	}

	private parseProperty(property: string): { group: string; axes: string[] } {
		if (property === 'scale') return { group: 'scale', axes: ['x', 'y'] };
		const dotIndex = property.indexOf('.');
		return {
			group: property.slice(0, dotIndex),
			axes: [property.slice(dotIndex + 1)],
		};
	}

	private buildTweenTarget(
		axes: string[],
		value: number,
	): Record<string, number> {
		const target: Record<string, number> = {};
		for (const axis of axes) target[axis] = value;
		return target;
	}

	private applyValue(
		obj: any,
		group: string,
		axes: string[],
		value: number,
		isSafeZone: boolean,
	): void {
		if (group === 'scale') {
			const s = obj.scale as vmath.vector3;
			const nx = axes.includes('x') ? value : s.x;
			const ny = axes.includes('y') ? value : s.y;
			obj.setScale2D(vmath.vector3(nx, ny, 1));
			if (isSafeZone) syncSafeZoneCollider(obj as SafeZoneLayout);
		} else if (group === 'euler') {
			go.set(obj.id, 'euler.z', value);
		} else if (group === 'position') {
			const p = obj.position as vmath.vector3;
			const nx = axes.includes('x') ? value : p.x;
			const ny = axes.includes('y') ? value : p.y;
			obj.setPosition2D(vmath.vector3(nx, ny, 0));
		}
	}

	private setupShooter(data: ShooterData): void {
		const shooter = this.layout.shooters.factory.create(shooterSchema);

		shooter.setPosition2D(vmath.vector3(data.x, data.y, 0));
		if (data.angle !== 0) {
			go.set(shooter.id, 'euler.z', data.angle);
		}

		if (data.animations) {
			for (const track of data.animations) {
				this.runTrack(track, shooter, false);
			}
		}

		this.timeline.loop(data.fireInterval, () => {
			const count = data.bulletCount ?? 1;
			const spread = data.bulletSpread ?? 0;
			const shooterPos = shooter.getPosition();

			for (let i = 0; i < count; i++) {
				const bullet = this.layout.bullets.factory.create(bulletSchema);
				bullet.setPosition(shooterPos);
				const offsetAngle =
					count > 1 ? i * spread - (spread * (count - 1)) / 2 : 0;
				const rotation = (shooter.angle + offsetAngle) * DEG_TO_RAD;
				const direction = vmath.vector3(
					Math.cos(rotation),
					Math.sin(rotation),
					0,
				);
				const distance = 1500;
				const target = shooterPos.add(direction.mul(distance));

				bullet.animate(
					Property.Position,
					target,
					8,
					undefined,
					undefined,
					undefined,
					() => {
						bullet.delete();
					},
				);

				bullet.physics.setHandler(PhysicsGroup.wall, () => {
					bullet.delete();
				});
			}
		});
	}
}
