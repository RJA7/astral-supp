import { Storage } from '../engine';

type UserData = {
	levelIndex: number;
};

export const storage = new Storage<UserData>('user_data', {
	levelIndex: 0,
});
