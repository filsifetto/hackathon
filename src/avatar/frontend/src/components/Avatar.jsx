import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

export function Avatar(props) {
  const group = useRef();
  const head = useRef();
  const mouth = useRef();
  const leftEye = useRef();
  const rightEye = useRef();

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout;

    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 140);
      }, 1200 + Math.random() * 2600);
    };

    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.35) * 0.12;
    }

    if (head.current) {
      head.current.position.y = 1.62 + Math.sin(t * 1.4) * 0.02;
    }

    const talking = !!message;
    const mouthOpen = talking ? (Math.sin(t * 12) + 1) * 0.07 + 0.015 : 0.015;

    if (mouth.current) {
      mouth.current.scale.y = mouthOpen / 0.03;
      mouth.current.position.y = 1.47 - mouthOpen * 0.08;
    }

    const eyeScaleY = blink ? 0.08 : 1;
    if (leftEye.current) {
      leftEye.current.scale.y = eyeScaleY;
    }
    if (rightEye.current) {
      rightEye.current.scale.y = eyeScaleY;
    }
  });

  return (
    <group ref={group} {...props} position={[0, -0.5, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.38, 0.9, 10, 18]} />
        <meshStandardMaterial color="#142c47" roughness={0.6} metalness={0.08} />
      </mesh>

      <mesh ref={head} position={[0, 1.62, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#f3c8a5" roughness={0.68} metalness={0.02} />
      </mesh>

      <mesh ref={leftEye} position={[-0.1, 1.66, 0.27]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      <mesh ref={rightEye} position={[0.1, 1.66, 0.27]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      <mesh ref={mouth} position={[0, 1.47, 0.28]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#8e2424" roughness={0.5} />
      </mesh>
    </group>
  );
}
