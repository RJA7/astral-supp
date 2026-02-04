import { Ref } from '../types/Ref';

export type ComponentUrl = url & { __brand: 'ComponentUrl' };

export function componentUrl(ref: Ref): ComponentUrl {
	const url = msg.url(ref);

	if (!go.exists(url)) {
		throw new Error(`Component ${ref} does not exist`);
	}

	return url as ComponentUrl;
}
