import { RigidBody } from '../components/RigidBody';

export type Shape = {};

export type ShapeClass = new (body: RigidBody, shapeId: hash) => Shape;
