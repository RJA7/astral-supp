export class Storage<T extends object> {
	private readonly key: string;

	public data: T;

	constructor(key: string, defaultData: T) {
		this.key = key;
		const loadedData = sys.load(key) || {};

		this.data = {
			...defaultData,
			...loadedData,
		};
	}

	save(patch: Partial<T>) {
		this.data = { ...this.data, ...patch };
		sys.save(this.key, this.data);
	}
}
