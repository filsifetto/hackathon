/**
 * Static avatar for design testing: same look as Avatar but no chat, no Leva, no lip-sync.
 * Loads GLB from public /models/avatar.glb and plays Idle only.
 */
import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const avatarUrl = "/models/avatar.glb";
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

export function StaticAvatar(props) {
  const gltf = useGLTF(avatarUrl);
  const scene = gltf.scene;
  const { nodes, materials } = useMemo(() => buildNodesAndMaterials(scene), [scene]);
  const group = useRef();
  const { animations } = useGLTF(animationsUrl);
  const { actions } = useAnimations(animations, group);
  const animationName = useMemo(
    () => animations?.find((a) => a.name === "Idle")?.name ?? animations?.[0]?.name ?? "Idle",
    [animations]
  );

  useEffect(() => {
    const act = actions[animationName] || actions[Object.keys(actions)[0]];
    if (act) {
      act.reset().fadeIn(0).play();
      return () => act.fadeOut(0.5);
    }
  }, [actions, animationName]);

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
      <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
        <primitive object={scene} />
      </group>
    );
  }

  return (
    <group {...props} dispose={null} ref={group} position={[0, -0.5, 0]}>
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

useGLTF.preload(avatarUrl);
useGLTF.preload(animationsUrl);
