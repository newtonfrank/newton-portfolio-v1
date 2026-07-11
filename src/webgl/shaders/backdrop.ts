/**
 * Living background. Two slow-drifting radial glows in the active ambient colour
 * over a dark base, plus a vignette. This is what stops the scene reading as a
 * flat fill — the reference never sits on a static colour.
 */

export const backdropVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const backdropFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform float uTime;
  uniform vec2 uAspect;

  varying vec2 vUv;

  float glow(vec2 uv, vec2 center, float radius) {
    float d = length((uv - center) * uAspect);
    return smoothstep(radius, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;

    // A very dark base tinted toward the ambient colour.
    vec3 base = uColor * 0.10;

    // Two blobs drifting on slow, offset sinusoids.
    vec2 a = vec2(0.28 + sin(uTime * 0.08) * 0.10, 0.34 + cos(uTime * 0.06) * 0.12);
    vec2 b = vec2(0.74 + cos(uTime * 0.05) * 0.12, 0.66 + sin(uTime * 0.07) * 0.10);

    float ga = glow(uv, a, 0.55);
    float gb = glow(uv, b, 0.45);

    vec3 color = base;
    color += uColor * ga * 0.42;
    color += uColor * gb * 0.30;

    // Vignette toward the corners keeps the eye centred.
    float vig = smoothstep(1.15, 0.35, length((uv - 0.5) * uAspect));
    color *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;
