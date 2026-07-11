"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { backdropFragmentShader, backdropVertexShader } from "./shaders/backdrop";

/**
 * Full-screen living background, drawn behind the planes. Reads the shared
 * ambient colour (lerped in Carousel) each frame and drifts two glows across it.
 * Rendered as a fullscreen-clip triangle/quad, unaffected by the camera.
 */
export function Backdrop({ colorRef }: { colorRef: React.RefObject<THREE.Color> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#0b0b0e") },
      uTime: { value: 0 },
      uAspect: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    if (colorRef.current) uniforms.uColor.value.copy(colorRef.current);
    const aspect = size.width / size.height;
    uniforms.uAspect.value.set(aspect > 1 ? aspect : 1, aspect > 1 ? 1 : 1 / aspect);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={backdropVertexShader}
        fragmentShader={backdropFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
