import { ComponentUrl } from '../ComponentUrl';

export type Shape = {};

export type ShapeClass = new (bodyUrl: ComponentUrl, shapeId: hash) => Shape;
