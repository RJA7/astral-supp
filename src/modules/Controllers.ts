import { MainController } from './MainController';
import { CoreController } from './core/CoreController';
import { Controller } from './types/Controller';
import { CoreGuiController } from './core/CoreGuiController';

export const Controllers = new Map<hash, new () => Controller>();
Controllers.set(hash('MainController'), MainController);
Controllers.set(hash('CoreController'), CoreController);
Controllers.set(hash('CoreGuiController'), CoreGuiController);
