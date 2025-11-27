uniform vec3 color;
uniform vec3 lightDir;
uniform float time;
uniform sampler2D normalMap;
uniform sampler2D map;

varying vec2 v_uv;
varying vec2 v_uv2;
varying vec2 reg_uv;
varying vec4 v_position;

const vec3 lightColor = vec3(0.5, 1.0, 1.0);

void main() {
    // diffuse lighting
    vec3 tex_normal = texture2D(normalMap, v_uv).xyz;
    vec3 tex_normal2 = texture2D(normalMap, v_uv2).xyz;

    vec3 n_hat = normalize(tex_normal + tex_normal2);
    vec3 diffuse = dot(n_hat, lightDir)*lightColor;
    vec3 ambient = vec3(0.75,0.75,0.75);
    vec3 lightIntensity = diffuse + ambient;

    // specular lighting
    vec3 viewDir = normalize(-v_position.xyz);
    vec3 reflectDir = reflect(-lightDir, n_hat);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = lightColor * spec;

    lightIntensity = clamp(specular + diffuse, 0., 1.);

    float alpha = texture2D(map, reg_uv).b / 1.5;

    gl_FragColor = vec4(color * lightIntensity, alpha);
}
