/**
 * Avatar design loading pipeline:
 * 1. AVATAR_GLB_URL is same-origin (/models/avatar.glb) so Vite serves
 *    frontend/public/models/avatar.glb. No cross-origin = no CORS/preload failures.
 * 2. useGLTF(AVATAR_GLB_URL) loads the GLB; on failure, AvatarErrorBoundary shows PlaceholderAvatar.
 * 3. Animations are loaded in AvatarAnimations (inside ErrorBoundary). If animations.gltf or
 *    animations_data.bin is missing, the real avatar still shows, just without skeleton animation.
 * 4. If the GLB has Ready Player Me node names (Wolf3D_Head, EyeLeft, etc.), we render
 *    the full rig with expressions and lip-sync; otherwise we render a simple <primitive>.
 */
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useSpeech } from "../hooks/useSpeech";
import { AVATAR_GLB_URL } from "../constants/avatarUrl";
import facialExpressions from "../constants/facialExpressions";
import visemesMapping from "../constants/visemesMapping";
import morphTargets from "../constants/morphTargets";
import { applyArkitMorphNames } from "../constants/arkitBlendShapeOrder";

const ANIMATIONS_URL = "/models/animations.gltf";

class AnimationsErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("[Avatar] Animations failed to load (avatar will show without skeleton animation):", err?.message || err);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function AvatarAnimations({ groupRef, animationName, onReady }) {
  const gltf = useGLTF(ANIMATIONS_URL);
  const animations = gltf?.animations ?? [];
  const { actions, mixer } = useAnimations(animations, groupRef);
  useEffect(() => {
    if (onReady && animations.length) onReady(animations.map((a) => a.name));
  }, [animations, onReady]);
  useEffect(() => {
    const name = animations.find((a) => a.name === animationName)?.name ?? animations[0]?.name;
    const act = name ? actions[name] : undefined;
    if (act) {
      act.reset().fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5).play();
      return () => act.fadeOut(0.5);
    }
  }, [animationName, actions, mixer]);
  return null;
}

function buildNodesAndMaterials(scene) {
  if (!scene) return { nodes: {}, materials: {} };
  const nodes = {};
  const materials = {};
  scene.traverse((obj) => {
    const name = obj.name;
    if (name) {
      if (obj.isSkinnedMesh || obj.isMesh) nodes[name] = obj;
      else if (!nodes[name]) nodes[name] = obj;
    }
    const mats = obj.material != null ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
    mats.forEach((m) => { if (m && m.name) materials[m.name] = m; });
  });
  return { nodes, materials };
}

export function Avatar(props) {
  const gltf = useGLTF(AVATAR_GLB_URL);
  const scene = gltf.scene;
  const { nodes, materials } = useMemo(() => buildNodesAndMaterials(scene), [scene]);

  useEffect(() => {
    const oldBackendUrl = `${import.meta.env.VITE_AVATAR_BACKEND_URL || "http://localhost:3000"}/models/avatar.glb?v=4`;
    useGLTF.clear(oldBackendUrl);
    fetch(AVATAR_GLB_URL, { method: "HEAD" })
      .then((r) => console.log("[Avatar] Asset reachable:", r.ok ? "yes" : r.status, AVATAR_GLB_URL))
      .catch((e) => console.error("[Avatar] Asset check failed:", e.message));
  }, []);

  useEffect(() => {
    if (!scene) return;
    const isRpm =
      nodes?.Hips &&
      nodes?.Wolf3D_Head?.geometry &&
      nodes?.EyeLeft?.geometry &&
      nodes?.Wolf3D_Body?.geometry;
    console.log("[Avatar] Loaded:", AVATAR_GLB_URL, "| RPM format:", !!isRpm, "| Node names:", Object.keys(nodes || {}).slice(0, 20).join(", "));
    // When GLB has no mesh.extras.targetNames, Three.js gives morph targets numeric keys ("0","1",…).
    // Rebuild morphTargetDictionary from ARKit order so name-based expressions work.
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        applyArkitMorphNames(child);
      }
    });
  }, [scene, nodes]);
  const { message, onMessagePlayed } = useSpeech();
  const [lipsync, setLipsync] = useState();
  const [setupMode, setSetupMode] = useState(false);
  const [animationNames, setAnimationNames] = useState(["Idle"]);
  const [animation, setAnimation] = useState("Idle");
  const group = useRef();

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    if (!message.audio) {
      onMessagePlayed();
      return;
    }
    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = onMessagePlayed;
  }, [message]);

  const head = useRef();
  const mouth = useRef();

  // Meshes that have morph targets (face/eyes) — we update these so the rendered skinnedMesh sees changes
  const morphMeshes = useMemo(() => {
    const list = [];
    if (nodes?.Wolf3D_Head?.morphTargetDictionary) list.push(nodes.Wolf3D_Head);
    if (nodes?.EyeLeft?.morphTargetDictionary) list.push(nodes.EyeLeft);
    if (nodes?.EyeRight?.morphTargetDictionary) list.push(nodes.EyeRight);
    if (nodes?.Wolf3D_Teeth?.morphTargetDictionary) list.push(nodes.Wolf3D_Teeth);
    return list;
  }, [nodes]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    const apply = (mesh) => {
      if (!mesh?.isSkinnedMesh || !mesh.morphTargetDictionary) return;
      const index = mesh.morphTargetDictionary[target];
      if (index === undefined || mesh.morphTargetInfluences?.[index] === undefined) return;
      mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        mesh.morphTargetInfluences[index],
        value,
        speed
      );
    };
    if (morphMeshes.length > 0) {
      morphMeshes.forEach(apply);
    } else if (scene?.traverse) {
      scene.traverse((child) => apply(child));
    }
  };

  const [blink, setBlink] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState();

  useFrame(() => {
    if (!scene) return;
    !setupMode &&
      morphTargets.forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return;
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    if (setupMode) {
      return;
    }

    const appliedMorphTargets = [];
    if (message && lipsync) {
      const currentAudioTime = audio?.currentTime ?? 0;
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          appliedMorphTargets.push(visemesMapping[mouthCue.value]);
          lerpMorphTarget(visemesMapping[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }

    Object.values(visemesMapping).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  useControls("FacialExpressions", {
    animation: {
      value: animation,
      options: animationNames,
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    setupMode: button(() => {
      setSetupMode(!setupMode);
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {};
      Object.values(nodes).forEach((node) => {
        if (node.morphTargetInfluences && node.morphTargetDictionary) {
          morphTargets.forEach((key) => {
            if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
              return;
            }
            const value = node.morphTargetInfluences[node.morphTargetDictionary[key]];
            if (value > 0.01) {
              emotionValues[key] = value;
            }
          });
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...morphTargets.map((key) => ({
        [key]: {
          label: key,
          value: 0,
          min: 0,
          max: 1,
          onChange: (val) => {
            lerpMorphTarget(key, val, 0.1);
          },
        },
      }))
    )
  );

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

  const hasScene = scene != null;
  const rootNode = nodes?.Hips || nodes?.Armature;
  const isRpmFormat =
    hasScene &&
    rootNode &&
    nodes?.Wolf3D_Head?.geometry &&
    nodes?.EyeLeft?.geometry &&
    nodes?.EyeRight?.geometry &&
    nodes?.Wolf3D_Teeth?.geometry &&
    nodes?.Wolf3D_Body?.geometry &&
    materials?.Wolf3D_Skin &&
    materials?.Wolf3D_Eye &&
    materials?.Wolf3D_Teeth &&
    materials?.Wolf3D_Body;
  if (!hasScene) return null;
  if (!isRpmFormat) {
    console.warn("[Avatar] GLB loaded but not Ready Player Me format (missing Wolf3D_Head etc.). Rendering as generic primitive.");
    return (
      <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
        <primitive object={scene} />
        <AnimationsErrorBoundary>
          <Suspense fallback={null}>
            <AvatarAnimations groupRef={group} animationName={animation} onReady={setAnimationNames} />
          </Suspense>
        </AnimationsErrorBoundary>
      </group>
    );
  }

  // Render full scene so all meshes show (they may be siblings of Armature, not under it). Morph updates apply to the same node objects in the scene.
  return (
    <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
      <primitive object={scene} />
      <AnimationsErrorBoundary>
        <Suspense fallback={null}>
          <AvatarAnimations groupRef={group} animationName={animation} onReady={setAnimationNames} />
        </Suspense>
      </AnimationsErrorBoundary>
    </group>
  );
}

useGLTF.preload(AVATAR_GLB_URL);
