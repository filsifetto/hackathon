import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Simple animated placeholder when avatar.glb is missing.
 * Gives the scene visible "action" so the app doesn’t feel empty.
 */
export function PlaceholderAvatar(props) {
  const group = useRef();
  const mesh = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group {...props} ref={group} position={[0, -0.5, 0]}>
      <mesh ref={mesh} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color="#6366f1" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#818cf8" metalness={0.1} roughness={0.7} />
      </mesh>
    </group>
  );
}
