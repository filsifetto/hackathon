/**
 * ARKit blend shape names in the standard export order (index 0, 1, 2, …).
 * When a GLB has no mesh.extras.targetNames, Three.js sets morphTargetDictionary
 * to { "0": 0, "1": 1, … }. This list maps index → name so we can rebuild the
 * dictionary and drive expressions by name (browInnerUp, mouthSmileLeft, etc.).
 *
 * Order matches Apple ARKit / Ready Player Me ARKit-compatible export.
 * See: https://docs.readyplayer.me/ready-player-me/api-reference/avatars/morph-targets/apple-arkit
 */
export const ARKIT_BLEND_SHAPE_ORDER = [
  "jawOpen",           // 0
  "jawForward",        // 1
  "jawLeft",           // 2
  "jawRight",          // 3
  "eyeLookDownLeft",   // 4
  "eyeLookDownRight",  // 5
  "eyeLookInLeft",     // 6
  "eyeLookInRight",    // 7
  "eyeBlinkLeft",      // 8
  "eyeBlinkRight",     // 9
  "eyeLookUpLeft",     // 10
  "eyeLookUpRight",    // 11
  "eyeWideLeft",       // 12
  "eyeWideRight",      // 13
  "eyeSquintLeft",     // 14
  "eyeSquintRight",    // 15
  "eyeLookOutLeft",    // 16
  "eyeLookOutRight",   // 17
  "browInnerUp",       // 18
  "browOuterUpLeft",   // 19
  "browOuterUpRight",  // 20
  "browDownLeft",      // 21
  "browDownRight",     // 22
  "cheekPuff",         // 23
  "cheekSquintLeft",   // 24
  "cheekSquintRight",  // 25
  "noseSneerLeft",     // 26
  "noseSneerRight",    // 27
  "mouthClose",        // 28
  "mouthLeft",         // 29
  "mouthRight",        // 30
  "mouthFunnel",       // 31
  "mouthPucker",       // 32
  "mouthRollUpper",    // 33
  "mouthRollLower",    // 34
  "mouthShrugUpper",   // 35
  "mouthShrugLower",   // 36
  "mouthUpperUpLeft",  // 37
  "mouthUpperUpRight", // 38
  "mouthLowerDownLeft",  // 39
  "mouthLowerDownRight", // 40
  "mouthPressLeft",    // 41
  "mouthPressRight",   // 42
  "mouthStretchLeft",  // 43
  "mouthStretchRight", // 44
  "mouthSmileLeft",    // 45
  "mouthSmileRight",   // 46
  "mouthFrownLeft",    // 47
  "mouthFrownRight",   // 48
  "mouthDimpleLeft",   // 49
  "mouthDimpleRight",  // 50
  "tongueOut",         // 51
  // RPM/other may add more; we only map up to the count in the mesh
];

/** True if every key in morphTargetDictionary looks like a numeric index ("0", "1", …). */
export function hasOnlyNumericMorphKeys(dict) {
  if (!dict || typeof dict !== "object") return false;
  const keys = Object.keys(dict);
  if (keys.length === 0) return false;
  return keys.every((k) => /^\d+$/.test(k));
}

/**
 * Rebuild morphTargetDictionary from ARKIT_BLEND_SHAPE_ORDER so name lookups work.
 * Call when the GLB has no extras.targetNames and the dictionary has only "0","1",...
 */
export function applyArkitMorphNames(mesh) {
  const influences = mesh.morphTargetInfluences;
  const dict = mesh.morphTargetDictionary;
  if (!influences || !dict || !hasOnlyNumericMorphKeys(dict)) return;
  const newDict = {};
  const count = Math.min(ARKIT_BLEND_SHAPE_ORDER.length, influences.length);
  for (let i = 0; i < count; i++) {
    newDict[ARKIT_BLEND_SHAPE_ORDER[i]] = i;
  }
  mesh.morphTargetDictionary = newDict;
}
