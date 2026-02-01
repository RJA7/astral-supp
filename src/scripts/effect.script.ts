type Self = {
	time: number;
};

export function init(this: Self) {
	this.time = 0;
}

export function update(this: Self, dt: number) {
	this.time += dt;
	go.set('#sprite', 'u_data', vmath.vector4(this.time, 0, 0, 0));
}
