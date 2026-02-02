#version 140

in mediump vec2 var_texcoord0;
out vec4 out_fragColor;

uniform sampler2D texture_sampler;

layout(std140) uniform u_time_block
{
	vec4 u_data; // x = time
};

// Simple pseudo-random
float rand(vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
	vec2 uv = var_texcoord0;

	// Slightly faster and more chaotic shake
	float maxOffset = 0.03; // increase shake to 3%
	vec2 shake = vec2(
		(rand(uv + u_data.x * 20.0) - 0.5) * maxOffset,
		(rand(uv + u_data.x * 60.0) - 0.5) * maxOffset
	);
	uv += shake;

	// Sample the white-noise texture
	float noise = texture(texture_sampler, uv).r;

	// Map grayscale noise to pink-ish color
	vec3 pinkTint = vec3(1.0, 0.5, 0.8); // RGB for pink
	vec3 color = noise * pinkTint;

	out_fragColor = vec4(color, 1.0);
}
