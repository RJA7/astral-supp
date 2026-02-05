import { App } from './App';
import { CoreRoot } from './core/CoreRoot';
import { Controller } from './types/Controller';
import { Ref } from './types/Ref';
import { PlayerRoot } from './core/PlayerRoot';

export const Controllers = new Map<hash, new (ref: Ref) => Controller>();
Controllers.set(hash('App'), App);
Controllers.set(hash('CoreRoot'), CoreRoot);
Controllers.set(hash('PlayerRoot'), PlayerRoot);
