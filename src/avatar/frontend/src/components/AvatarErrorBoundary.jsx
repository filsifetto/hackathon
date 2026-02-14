import { Component } from "react";
import { PlaceholderAvatar } from "./PlaceholderAvatar";

/**
 * Catches load errors for the 3D avatar (e.g. missing avatar.glb)
 * and shows an animated placeholder so the scene still has visible action.
 * Also plays TTS when the full avatar isn't available.
 */
export class AvatarErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("Avatar failed to load, showing placeholder:", error?.message || error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <PlaceholderAvatar />
        </>
      );
    }
    return this.props.children;
  }
}
