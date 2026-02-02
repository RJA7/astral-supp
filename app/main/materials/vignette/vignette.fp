#version 140

in mediump vec2 var_texcoord0;
out vec4 out_fragColor;

uniform mediump sampler2D texture_sampler;
uniform fs_uniforms
{
	mediump vec4 u_data_1;     // xyzw = center_color.rgba
	mediump vec4 u_data_2;     // xyzw = edge_color.rgba
	mediump vec4 u_data_3;     // x = intensity, y = power, z/w unused
};

void main()
{
	mediump vec2 uv = var_texcoord0;

	// Fabrice Neyret vignette
	uv *= 1.0 - uv.yx;

	mediump float vig = uv.x * uv.y * u_data_3.x;
	vig = pow(vig, u_data_3.y);
	vig = clamp(vig, 0.0, 1.0);

	// Blend full RGBA (NOT just rgb)
	out_fragColor = mix(u_data_2, u_data_1, vig);
}
