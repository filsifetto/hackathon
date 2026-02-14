import { CameraControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef, useState } from "react";
import { PlaceholderAvatar } from "../components/PlaceholderAvatar";
import { StaticAvatar } from "../components/StaticAvatar";

class TestAvatarErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("Avatar failed to load:", error?.message || error);
    this.props.setLoaded?.(true);
    this.props.onError?.(error?.message || String(error));
  }

  render() {
    if (this.state.hasError) return <PlaceholderAvatar />;
    return this.props.children;
  }
}

export function TestAvatarPage() {
  const cameraControlsRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    cameraControlsRef.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 5]} intensity={1.5} castShadow />
        <CameraControls
          ref={cameraControlsRef}
          makeDefault
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2}
        />
        <Suspense fallback={<PlaceholderAvatar />}>
          <Environment preset="sunset" />
          <TestAvatarErrorBoundary setLoaded={setLoaded} onError={setError}>
            <StaticAvatar onLoaded={() => setLoaded(true)} skipAnimations />
          </TestAvatarErrorBoundary>
        </Suspense>
      </Canvas>
      {error && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(200,60,60,0.95)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            maxWidth: "90%",
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          Avatar failed: {error}
        </div>
      )}
      {!loaded && !error && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(255,255,255,0.9)",
            fontSize: 14,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Loading avatar…
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          pointerEvents: "none",
        }}
      >
        Design test — static avatar · Drag to orbit
      </div>
    </div>
  );
}
