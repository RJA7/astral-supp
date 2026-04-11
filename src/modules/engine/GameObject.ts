import { ComponentUrl } from './ComponentUrl';
import { postVoidMessage } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { Playback } from './types/Playback';
import { Property } from './types/Property';
import { Easing } from './types/Easing';
import { GameObjectId } from './types/Hash';
import { AnimateTo, AnyEasing, wrapAnimationComplete } from './utils/Animate';
import { DEG_TO_RAD } from './utils/Math';

export type GameObjectClass = typeof GameObject;

export class GameObject {
	public readonly id: GameObjectId;

	constructor(id: GameObjectId) {
		if (!go.exists(id)) {
			throw new Error(
				`GameObject with id ${id} does not exist in ${msg.url().socket}`,
			);
		}

		this.id = id;
	}

	getPosition() {
		return go.get_position(this.id);
	}

	setPosition(position: vmath.vector3) {
		go.set_position(position, this.id);
	}

	setPosition2D(position: vmath.vector3 | vmath.vector4) {
		go.set_position(
			vmath.vector3(position.x, position.y, this.getPosition().z),
			this.id,
		);
	}

	get position() {
		return this.getPosition();
	}

	set position(position: vmath.vector3) {
		this.setPosition(position);
	}

	getParentId() {
		return go.get_parent(this.id);
	}

	setWorldPosition2D(position: vmath.vector3) {
		const parentId = this.getParentId();

		const local = parentId
			? go.world_to_local_position(position, this.id)
			: position;

		this.setPosition2D(local);
	}

	getWorldPosition() {
		return go.get_world_position(this.id);
	}

	worldToLocalPosition(position: vmath.vector3) {
		return go.world_to_local_position(position, this.id);
	}

	getWorldTransform() {
		return go.get_world_transform(this.id);
	}

	worldToLocalTransform(transform: vmath.matrix4) {
		return go.world_to_local_transform(transform, this.id);
	}

	updateWorldTransform() {
		go.update_world_transform(this.id);
	}

	addPosition2D(position: vmath.vector3) {
		this.setPosition2D(this.getPosition().add(position));
	}

	getScale(): vmath.vector3 {
		return go.get_scale(this.id);
	}

	setScale(scale: vmath.vector3) {
		go.set_scale(scale, this.id);
	}

	setScale2D(scale: vmath.vector3) {
		go.set_scale_xy(scale, this.id);
	}

	get scale() {
		return this.getScale();
	}

	set scale(scale: vmath.vector3) {
		this.setScale(scale);
	}

	enable() {
		postVoidMessage(this.id, MessageId.enable);
	}

	disable() {
		postVoidMessage(this.id, MessageId.disable);
	}

	get angle() {
		return go.get(this.id, Property.EulerZ) as number;
	}

	set angle(value: number) {
		go.set(this.id, Property.EulerZ, value);
	}

	get rotation() {
		return this.angle * DEG_TO_RAD;
	}

	set rotation(value: number) {
		this.angle = value * DEG_TO_RAD;
	}

	animate(
		property: Property,
		to: AnimateTo,
		duration: number,
		easing: AnyEasing = Easing.Linear,
		delay: number = 0,
		playback: Playback = Playback.PLAYBACK_ONCE_FORWARD,
		complete?: (url: ComponentUrl, property: Property) => void,
	) {
		go.animate(
			this.id,
			property,
			go[playback],
			to,
			typeof easing === 'string' ? go[easing] : easing,
			duration,
			delay,
			wrapAnimationComplete(complete),
		);
	}

	cancelAnimation(property: Property | hash) {
		go.cancel_animations(this.id, property);
	}

	cancelAnimations() {
		go.cancel_animations(this.id);
	}

	setParent(parent: GameObject) {
		go.set_parent(this.id, parent.id);
	}

	addChild(child: GameObject) {
		go.set_parent(child.id, this.id);
	}

	delete(recursive = true) {
		go.delete(this.id, recursive);
	}
}
