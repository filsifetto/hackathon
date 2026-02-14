import { CameraControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef } from "react";
import { PlaceholderAvatar } from "../components/PlaceholderAvatar";
import { StaticAvatar } from "../components/StaticAvatar";

class TestAvatarErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("Avatar failed to load:", error?.message || error);
  }

  render() {
    if (this.state.hasError) return <PlaceholderAvatar />;
    return this.props.children;
  }
}

export function TestAvatarPage() {
  const cameraControlsRef = useRef();
  useEffect(() => {
    cameraControlsRef.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
        <CameraControls
          ref={cameraControlsRef}
          makeDefault
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="sunset" />
        <Suspense fallback={<PlaceholderAvatar />}>
          <TestAvatarErrorBoundary>
            <StaticAvatar />
          </TestAvatarErrorBoundary>
        </Suspense>
      </Canvas>
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
