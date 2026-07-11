/**
 * Drifting dust motes. Each particle carries a random phase so the field never
 * pulses in unison; motion lives in the vertex shader so there is no per-frame
 * CPU cost. Soft round alpha in the fragment shader, additive-blended for glow.
 */

export const particlesVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uPointer;

  attribute float aPhase;
  attribute float aScale;

  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Slow, phase-offset drift on all three axes.
    p.x += sin(uTime * 0.12 + aPhase * 6.28) * 0.6;
    p.y += cos(uTime * 0.10 + aPhase * 6.28) * 0.5;
    p.z += sin(uTime * 0.08 + aPhase * 3.14) * 0.4;

    // A whisper of pointer parallax, scaled by depth.
    p.xy += uPointer * (0.4 + aScale * 0.6);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Size attenuates with distance; fade the nearest and farthest out.
    gl_PointSize = uSize * aScale * (12.0 / -mv.z);
    vAlpha = smoothstep(0.0, 0.3, aScale) * 0.6;
  }
`;

export const particlesFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Round, soft-edged point.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
