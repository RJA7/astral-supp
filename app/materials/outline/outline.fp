#version 140

in vec2 var_texcoord0;
out vec4 out_fragColor;

uniform sampler2D texture_sampler;

void main() {
	vec2 uv = var_texcoord0;
	vec4 color = texture(texture_sampler, uv);

	if (color.a > 0.975) {
		out_fragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else if (color.a > 0.5) {
		out_fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		out_fragColor = vec4(0.0);
	}

	#ifdef EDITOR
	out_fragColor = vec4(0.0);
	#endif
}
