type Self = {
	angle: number;
	step: number;
	sign: number;
};

go.property('sign', 1);

export function init(this: Self) {
	this.angle = 0;
	this.step = 90 * this.sign;

	rotate_next(this, msg.url('.'));
}

function rotate_next(self: Self, url: url) {
	self.angle %= 360;
	go.set(url, 'euler.z', self.angle);

	self.angle = self.angle + self.step;

	go.animate(
		url,
		'euler.z',
		go.PLAYBACK_ONCE_FORWARD,
		self.angle,
		go.EASING_LINEAR,
		0.5,
		0.5,
		() => rotate_next(self, url),
	);
}
