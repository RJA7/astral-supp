import { Storage } from '../engine/Storage';

type UserData = {
	levelNumber: number;
};

export const storage = new Storage<UserData>('user_data', {
	levelNumber: 1,
});
