"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { DesignProject } from "@/types/content";
import type { CardPlacement } from "../layout";

interface CardProps {
  project: DesignProject;
  placement: CardPlacement;
  /** 0…1 scroll position through the section. Read per frame, never rendered. */
  progress: RefObject<number>;
  /** World distance the field travels across the whole section. */
  travel: number;
  /** World x of the stage's left edge, so the field starts on screen. */
  originX: number;
  onOpen: () => void;
}

/**
 * The texture source. Routed through Next's image optimizer rather than the raw
 * file: the originals run to 4800px, which is a lot of texture memory for a
 * plane that is never more than ~700px on screen.
 */
function textureUrl(image: string) {
  return `/_next/image?url=${encodeURIComponent(image)}&w=1920&q=80`;
}

const HOVER_SCALE = 1.06;
/** World units toward the camera on hover. */
const HOVER_LIFT = 0.35;
const EASE = 0.12;

export function Card({ project, placement, progress, travel, originX, onOpen }: CardProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const lift = useRef(0);
  const [hovered, setHovered] = useState(false);
  const gl = useThree((state) => state.gl);

  const texture = useLoader(THREE.TextureLoader, textureUrl(project.image));

  // Sharpness. Anisotropy is the one that matters here — these planes are seen
  // at an angle, and without it the fine poster type smears into grey.
  // `useLoader` caches by URL, so this configures the shared texture once.
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture, gl]);

  useFrame((state) => {
    const node = mesh.current;
    if (!node) return;

    // `speed` is what makes this a field rather than a strip: far cards answer
    // the scroll more slowly than near ones, so they slide past each other.
    const offset = progress.current * travel * placement.speed;

    // A slow lateral breath so the field is never completely dead at rest.
    const drift = Math.sin(state.clock.elapsedTime * 0.35 + placement.x) * 0.06;

    node.position.x = placement.x + originX - offset + drift;
    node.position.y = placement.y;

    // Hover straightens the tilt and floats the card forward. Eased per frame
    // rather than transitioned, so interrupting it mid-way stays smooth.
    lift.current += ((hovered ? HOVER_LIFT : 0) - lift.current) * EASE;
    node.position.z = placement.z + lift.current;

    const targetRotation = hovered ? 0 : placement.rotation;
    node.rotation.z += (targetRotation - node.rotation.z) * EASE;

    const targetScale = hovered ? HOVER_SCALE : 1;
    node.scale.x += (targetScale - node.scale.x) * EASE;
    node.scale.y = node.scale.x;

    // Fade in once this card's own texture has decoded. Each card suspends
    // separately (see CardField), so the field assembles piece by piece instead
    // of holding a blank stage until the slowest image lands.
    const mat = material.current;
    if (mat && mat.opacity < 1) {
      mat.opacity = Math.min(1, mat.opacity + 0.06);
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[placement.x + originX, placement.y, placement.z]}
      rotation-z={placement.rotation}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.dataset.cursor = "view";
      }}
      onPointerOut={() => {
        setHovered(false);
        delete document.body.dataset.cursor;
      }}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
    >
      <planeGeometry args={[placement.width, placement.height]} />
      <meshBasicMaterial ref={material} map={texture} toneMapped={false} transparent opacity={0} />
    </mesh>
  );
}
