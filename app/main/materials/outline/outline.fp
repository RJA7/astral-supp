#version 140

in mediump vec2 var_texcoord0;

out vec4 out_fragColor;

uniform mediump sampler2D texture_sampler;
uniform fs_uniforms
{
	mediump vec4 tint;
	mediump vec4 globals;
};

vec2 iResolution = globals.xy;

void main()
{
	const vec3 target = vec3(0.0); // Find transparent
	const float TAU = 6.28318530;
	const float steps = 32.0;

	float radius = 10.0;
	vec2 uv = var_texcoord0;

	// Correct aspect ratio
	vec2 aspect = 1.0 / iResolution;

	out_fragColor = vec4(uv.y, 0.0, uv.x, 1.0);
	for (float i = 0.0; i < TAU; i += TAU / steps) {
		// Sample image in a circular pattern
		vec2 offset = vec2(sin(i), cos(i)) * aspect * radius;
		vec4 col = texture(texture_sampler, uv + offset);

		// Mix outline with background
		float alpha = smoothstep(0.5, 0.7, distance(col.rgb, target));
		out_fragColor = mix(out_fragColor, vec4(0,0,0,1.0), alpha);
	}

	// Overlay original video
	vec4 mat = texture(texture_sampler, uv);
	float factor = smoothstep(0.5, 0.7, distance(mat.rgb, target));
	out_fragColor = mix(out_fragColor, mat, factor);
}
