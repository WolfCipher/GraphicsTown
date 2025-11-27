uniform vec3 color;
uniform float time;

uniform vec3 lightDir;

varying vec3 v_normal;

void main() {

    // diffuse lighting
    vec3 n_hat = normalize(v_normal);
    float diffuse = dot(n_hat, lightDir);
    float ambient = 0.75;
    float lightIntensity = max(min(diffuse + ambient, 1.0), 0.75);

    gl_FragColor = vec4(lightIntensity*color, 1.0);
    gl_FragColor.r += 0.5 * sin(time);
    gl_FragColor.r = min(gl_FragColor.r, 0.89);
}