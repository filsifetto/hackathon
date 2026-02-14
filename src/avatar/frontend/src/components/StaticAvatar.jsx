/**
 * Static avatar for design testing: same look as Avatar but no chat, no Leva, no lip-sync.
 * Uses same AVATAR_GLB_URL as main Avatar so the design is identical.
 */
import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef, Suspense } from "react";
import { AVATAR_GLB_URL } from "../constants/avatarUrl";
import { PlaceholderAvatar } from "./PlaceholderAvatar";

const animationsUrl = "/models/animations.gltf";

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

function IdleAnimation({ groupRef }) {
  const { animations } = useGLTF(animationsUrl);
  const { actions } = useAnimations(animations, groupRef);
  const name = useMemo(
    () => animations?.find((a) => a.name === "Idle")?.name ?? animations?.[0]?.name ?? "Idle",
    [animations]
  );
  useEffect(() => {
    const act = actions[name] || actions[Object.keys(actions)[0]];
    if (act) {
      act.reset().fadeIn(0).play();
      return () => act.fadeOut(0.5);
    }
  }, [actions, name]);
  return null;
}

function AvatarMeshes({ onLoaded }) {
  const gltf = useGLTF(AVATAR_GLB_URL);
  const scene = gltf.scene;
  const { nodes, materials } = useMemo(() => buildNodesAndMaterials(scene), [scene]);
  useEffect(() => {
    if (scene) onLoaded?.();
  }, [scene, onLoaded]);

  const hasScene = scene != null;
  const isRpmFormat =
    hasScene &&
    nodes?.Hips &&
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
    return (
      <group dispose={null}>
        <primitive object={scene} />
      </group>
    );
  }

  return (
    <group dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      {nodes.Wolf3D_Glasses?.geometry && materials.Wolf3D_Glasses && (
        <skinnedMesh
          geometry={nodes.Wolf3D_Glasses.geometry}
          material={materials.Wolf3D_Glasses}
          skeleton={nodes.Wolf3D_Glasses.skeleton}
        />
      )}
      {(nodes.Wolf3D_Headwear?.geometry || nodes.Wolf3D_Hair?.geometry) && (materials.Wolf3D_Headwear || materials.Wolf3D_Hair) && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Headwear ?? nodes.Wolf3D_Hair).geometry}
          material={materials.Wolf3D_Headwear ?? materials.Wolf3D_Hair}
          skeleton={(nodes.Wolf3D_Headwear ?? nodes.Wolf3D_Hair).skeleton}
        />
      )}
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      {nodes.Wolf3D_Outfit_Bottom?.geometry && materials.Wolf3D_Outfit_Bottom && (
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
      )}
      {nodes.Wolf3D_Outfit_Footwear?.geometry && materials.Wolf3D_Outfit_Footwear && (
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
      )}
      {nodes.Wolf3D_Outfit_Top?.geometry && materials.Wolf3D_Outfit_Top && (
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
      )}
    </group>
  );
}

export function StaticAvatar(props) {
  const { onLoaded, skipAnimations = false } = props;
  const group = useRef();
  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <Suspense fallback={<PlaceholderAvatar />}>
        <AvatarMeshes onLoaded={onLoaded} />
      </Suspense>
      {!skipAnimations && (
        <Suspense fallback={null}>
          <IdleAnimation groupRef={group} />
        </Suspense>
      )}
    </group>
  );
}

useGLTF.preload(AVATAR_GLB_URL);
useGLTF.preload(animationsUrl);
