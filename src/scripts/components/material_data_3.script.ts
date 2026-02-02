type Self = {
	u_data_1: vmath.vector4;
	u_data_2: vmath.vector4;
	u_data_3: vmath.vector4;
};

go.property('u_data_1', vmath.vector4());
go.property('u_data_2', vmath.vector4());
go.property('u_data_3', vmath.vector4());

export function init(this: Self) {
	go.set('#sprite', 'u_data_1', this.u_data_1);
	go.set('#sprite', 'u_data_2', this.u_data_2);
	go.set('#sprite', 'u_data_3', this.u_data_3);
}
