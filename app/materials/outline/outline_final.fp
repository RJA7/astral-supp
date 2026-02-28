#version 140

in vec2 var_texcoord0;
out vec4 out_fragColor;

uniform sampler2D texture_sampler;
uniform sampler2D mask_sampler;

void main() {
	vec2 uv = var_texcoord0;
	vec4 color = texture(texture_sampler, uv);

	if (color.a > 0.975) {
		out_fragColor = texture(mask_sampler, uv);
	} else if (color.a > 0.75) {
		out_fragColor = vec4(0.3, 0.3, 0.5, 0.5);
	} else {
		out_fragColor = vec4(0.0);
	}
}
