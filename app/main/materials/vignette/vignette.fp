#version 140

in mediump vec2 var_texcoord0;

out vec4 out_fragColor;

uniform fs_uniforms
{
	mediump vec4 tint;
	mediump vec4 intensity;
};

uniform mediump sampler2D texture_sampler;

void main()
{
	vec4 tex = texture(texture_sampler, var_texcoord0);

	vec2 uv = var_texcoord0;
	uv *=  1.0 - uv.yx;
	float vig = uv.x * uv.y * intensity.x;
	vig = 1 - pow(vig, tint.a);

	out_fragColor = vec4(tint.rgb * vig, vig);
}
