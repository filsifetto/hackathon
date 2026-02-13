import { CameraControls, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import { AvatarErrorBoundary } from "./AvatarErrorBoundary";
import { PlaceholderAvatar } from "./PlaceholderAvatar";

export const Scenario = () => {
  const cameraControls = useRef();
  useEffect(() => {
    cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      <Suspense fallback={<PlaceholderAvatar />}>
        <AvatarErrorBoundary>
          <Avatar />
        </AvatarErrorBoundary>
      </Suspense>
    </>
  );
};
