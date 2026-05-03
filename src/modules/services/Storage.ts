import { Storage } from '../engine';

type UserData = {
	levelNumber: number;
};

export const storage = new Storage<UserData>('user_data', {
	levelNumber: 1,
});
