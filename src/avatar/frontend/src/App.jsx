/**
 * Avatar app root: chat UI + 3D canvas with party representative.
 * ChatInterface talks to the backend (TTS/STS); Scenario renders the avatar and animations.
 */
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { ChatInterface } from "./components/ChatInterface";

function App() {
  return (
    <>
      <Loader />
      <Leva collapsed hidden />
      <ChatInterface />
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
        <Scenario />
      </Canvas>
    </>
  );
}

export default App;
