/**
 * Curved project plane. Inlined rather than imported as .glsl so the build needs
 * no loader — the shaders are short enough that a loader would cost more than it
 * saves.
 */

export const planeVertexShader = /* glsl */ `
  uniform float uCurve;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    // Bow the plane away from the camera at its edges, like a curved display.
    vec3 p = position;
    float bx = cos(p.x * uCurve);
    float by = cos(p.y * uCurve * 0.5);
    p.z += (bx * by - 1.0) * 1.6;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const planeFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uPlaneSize;
  uniform float uRadius;
  uniform float uAberration;
  uniform float uActive;
  uniform float uOpacity;
  uniform float uTime;

  varying vec2 vUv;

  // Signed distance to a rounded rectangle. Negative inside.
  float roundedRectSdf(vec2 uv, vec2 size, float radius) {
    vec2 p = (uv - 0.5) * size;
    vec2 q = abs(p) - (size * 0.5 - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  void main() {
    // Chromatic aberration: sample the channels along the radial direction,
    // scaled by squared distance so the fringing only shows near the edges.
    vec2 dir = vUv - 0.5;
    float amount = uAberration * dot(dir, dir);

    float r = texture2D(uTexture, vUv + dir * amount).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - dir * amount).b;
    vec3 color = vec3(r, g, b);

    // Fine scanlines, the way a captured screen reads on camera.
    float scan = 0.94 + 0.06 * sin(vUv.y * 1400.0 + uTime * 0.4);
    color *= scan;

    // Inactive slides recede: darker and desaturated toward luminance.
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma) * 0.35, color, mix(0.25, 1.0, uActive));
    color *= mix(0.45, 1.0, uActive);

    // Rounded-corner mask, antialiased against the derivative.
    float d = roundedRectSdf(vUv, uPlaneSize, uRadius);
    float aa = fwidth(d) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, d);

    // A faint rim of light on the very edge of the panel.
    float rim = smoothstep(-aa * 6.0, -aa, d) - smoothstep(-aa * 2.0, aa, d);
    color += rim * 0.35 * uActive;

    float alpha = mask * uOpacity;
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;
