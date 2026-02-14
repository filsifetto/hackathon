/**
 * Diagnostic page: verifies fetch, Canvas/WebGL, and GLB load step by step.
 * Open test-avatar-debug.html to see what is failing.
 */
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { Component, Suspense, useEffect, useRef, useState } from "react";
import { AVATAR_GLB_URL } from "../constants/avatarUrl";

const styles = {
  panel: {
    position: "fixed",
    top: 12,
    left: 12,
    right: 12,
    maxWidth: 420,
    background: "rgba(0,0,0,0.85)",
    color: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "monospace",
    zIndex: 100,
    pointerEvents: "auto",
    maxHeight: "80vh",
    overflow: "auto",
  },
  row: { marginBottom: 8 },
  ok: { color: "#6f6" },
  fail: { color: "#f66" },
  pending: { color: "#aa0" },
  heading: { fontWeight: "bold", marginBottom: 12, color: "#fff" },
};

function AvatarLoaderInner({ onResult }) {
  const gltf = useGLTF(AVATAR_GLB_URL);
  const reported = useRef(false);
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    onResult?.({ ok: true, scene: !!gltf?.scene });
  }, [gltf, onResult]);
  return (
    <group position={[0, -0.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

class AvatarLoaderErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(e) {
    return { error: e?.message ?? String(e) };
  }
  componentDidCatch(err) {
    this.props.onResult?.({ ok: false, error: err?.message ?? String(err) });
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

function AvatarLoader({ onResult }) {
  return (
    <AvatarLoaderErrorBoundary onResult={onResult}>
      <Suspense fallback={null}>
        <AvatarLoaderInner onResult={onResult} />
      </Suspense>
    </AvatarLoaderErrorBoundary>
  );
}

function SceneContent({ onCanvasMount, onGltfResult }) {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    onCanvasMount?.();
  }, [onCanvasMount]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 5]} intensity={1.5} />
      <AvatarLoader onResult={onGltfResult} />
    </>
  );
}

export function TestAvatarDiagnostic() {
  const [fetchStatus, setFetchStatus] = useState("pending");
  const [fetchDetail, setFetchDetail] = useState("");
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [gltfStatus, setGltfStatus] = useState("pending");
  const [gltfDetail, setGltfDetail] = useState("");

  // Step 1: can we fetch the file?
  useEffect(() => {
    let cancelled = false;
    setFetchStatus("pending");
    setFetchDetail("fetching…");
    fetch(AVATAR_GLB_URL)
      .then((res) => {
        if (cancelled) return;
        const status = res.ok ? "ok" : "fail";
        setFetchStatus(status);
        setFetchDetail(
          status === "ok"
            ? `${res.status} ${res.headers.get("content-length") ?? "?"} bytes`
            : `${res.status} ${res.statusText}`
        );
        return res.ok ? res.arrayBuffer() : null;
      })
      .then((buf) => {
        if (cancelled || !buf) return;
        setFetchDetail(`${buf.byteLength} bytes`);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchStatus("fail");
          setFetchDetail(err?.message ?? String(err));
        }
      });
    return () => { cancelled = true; };
  }, []);

  const onGltfResult = (result) => {
    if (result.ok) {
      setGltfStatus("ok");
      setGltfDetail("scene loaded");
    } else {
      setGltfStatus("fail");
      setGltfDetail(result?.error ?? "unknown");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div style={styles.panel}>
        <div style={styles.heading}>Diagnostic — test-avatar</div>
        <div style={styles.row}>
          1. Fetch {AVATAR_GLB_URL}:{" "}
          <span
            style={
              fetchStatus === "ok"
                ? styles.ok
                : fetchStatus === "fail"
                ? styles.fail
                : styles.pending
            }
          >
            {fetchStatus === "ok"
              ? "OK"
              : fetchStatus === "fail"
              ? "FAIL"
              : "pending"}
          </span>
          {fetchDetail && ` — ${fetchDetail}`}
        </div>
        <div style={styles.row}>
          2. Canvas / WebGL:{" "}
          <span style={canvasMounted ? styles.ok : styles.pending}>
            {canvasMounted ? "mounted" : "pending"}
          </span>
        </div>
        <div style={styles.row}>
          3. GLB load in Three:{" "}
          <span
            style={
              gltfStatus === "ok"
                ? styles.ok
                : gltfStatus === "fail"
                ? styles.fail
                : styles.pending
            }
          >
            {gltfStatus === "ok"
              ? "OK"
              : gltfStatus === "fail"
              ? "FAIL"
              : "pending"}
          </span>
          {gltfDetail && ` — ${gltfDetail}`}
        </div>
        <div style={{ ...styles.row, marginTop: 12, fontSize: 12 }}>
          If all three steps show OK, the avatar is visible in the scene.
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 1.2, 4], fov: 50 }}
        onCreated={() => setCanvasMounted(true)}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent
          onCanvasMount={() => setCanvasMounted(true)}
          onGltfResult={onGltfResult}
        />
      </Canvas>
    </div>
  );
}
