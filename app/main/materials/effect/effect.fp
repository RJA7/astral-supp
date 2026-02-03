#version 140

in mediump vec2 var_texcoord0;
out vec4 out_fragColor;

uniform sampler2D texture_sampler;

layout(std140) uniform u_time_block
{
	vec4 globals;
};

float time = globals.x;

// Simple pseudo-random
float rand(vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
	// Original UV inside the sprite frame
	vec2 uv = var_texcoord0;

	// Small random shake
	float maxOffset = 0.02; // max shake in UV space (2% of frame)
	vec2 shake = vec2(
		(rand(uv + time * 12.34) - 0.5) * maxOffset,
		(rand(uv + time * 56.78) - 0.5) * maxOffset
	);

	uv += shake;

	// Sample the texture
	float noise = texture(texture_sampler, uv).r;

	out_fragColor = vec4(vec3(noise), 1.0);
}
