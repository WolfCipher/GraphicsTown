varying vec2 v_uv;
varying vec2 v_uv2;
varying vec2 reg_uv;
varying vec4 v_position;

uniform sampler2D displacementMap;
uniform float time;

void main() {

    // handle displacement in the downstream direction
    vec2 animated_uv = uv + vec2(time*0.4, time*0.4);

    vec4 tex_color = texture2D(displacementMap, animated_uv);
    float red = tex_color.r - 0.5;
    float green = tex_color.g - 0.5;
    float blue = tex_color.b - 0.5;
    float height = red + green + blue;

    // handle displacement in the upstream direction (more subtle; adds the more variant motion needed)
    vec2 animated_uv2 = uv - vec2(time*0.1,time*0.1);

    tex_color = texture2D(displacementMap, animated_uv2);
    red = tex_color.r - 0.5;
    green = tex_color.g - 0.5;
    blue = tex_color.b - 0.5;
    height = height + red + green + blue;

    // calculate position
    vec3 pos = position + height*normal*0.4;

    v_position = (modelViewMatrix * vec4(pos,1.0));
    gl_Position = projectionMatrix * v_position;

    v_uv = animated_uv;
    v_uv2 = animated_uv2;
    reg_uv = uv;
}