#version 140

in mediump vec2 var_texcoord0;

out vec4 out_fragColor;

uniform mediump sampler2D texture_sampler;

void main()
{
	vec4 tex = texture(texture_sampler, var_texcoord0.xy);
	
	// Only write fragments with enough alpha to stencil
	if(tex.a < 0.5) discard; // discard transparent pixels

	// Write fully opaque color for stencil
	out_fragColor = vec4(1.0);
}
