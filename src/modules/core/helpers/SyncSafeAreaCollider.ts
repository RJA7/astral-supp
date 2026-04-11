import { Tween } from '../../engine/tweens/Tweens';
import { SafeZoneLayout } from '../../layouts/LevelLayout';

export function syncSafeZoneTweenCollider(tween: Tween<SafeZoneLayout>) {
	syncSafeZoneCollider(tween.object);
}

export function syncSafeZoneCollider(safeZone: SafeZoneLayout) {
	const size = safeZone.getScale();
	safeZone.body.box.set(vmath.vector3(size.x, size.y, 1));
}
