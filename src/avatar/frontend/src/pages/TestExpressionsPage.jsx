/**
 * Debug page for testing avatar facial expressions.
 * Use the buttons to apply each expression without sending a real message.
 * Open via /test-avatar-expressions
 */
import { CameraControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { AvatarErrorBoundary } from "../components/AvatarErrorBoundary";
import { PlaceholderAvatar } from "../components/PlaceholderAvatar";
import { useSpeech } from "../hooks/useSpeech";
import facialExpressions from "../constants/facialExpressions";
import { ARKIT_BLEND_SHAPE_ORDER } from "../constants/arkitBlendShapeOrder";

const EXPRESSION_KEYS = Object.keys(facialExpressions);

function Scenario() {
  const cameraControlsRef = useRef(null);
  useEffect(() => {
    cameraControlsRef.current?.setLookAt(0, 2.0, 4.3, 0, 1.05, 0, true);
  }, []);
  return (
    <>
      <CameraControls ref={cameraControlsRef} makeDefault />
      <Environment preset="sunset" />
      <Suspense fallback={<PlaceholderAvatar />}>
        <AvatarErrorBoundary>
          <Avatar />
        </AvatarErrorBoundary>
      </Suspense>
    </>
  );
}

export function TestExpressionsPage() {
  const { pushTestExpression } = useSpeech();
  const [selectedExpression, setSelectedExpression] = useState("");
  const [expandedExpression, setExpandedExpression] = useState(null);
  const [showIndexMap, setShowIndexMap] = useState(false);

  const handleExpression = (key) => {
    setSelectedExpression(key);
    pushTestExpression(key, "Idle");
  };

  return (
    <div className="test-expressions-page">
      <div className="test-expressions-canvas-wrap">
        <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
          <Scenario />
        </Canvas>
      </div>

      <aside className="test-expressions-panel">
        <Link to="/" className="test-expressions-back">← Back to site</Link>
        <h1>Facial expression debug</h1>
        <p className="test-expressions-callout">
          Just click a button below to change the face. No typing, no numbers.
        </p>
        <p className="test-expressions-hint">
          If the face does not change when you click, the avatar model may use a different morph order than we expect.
        </p>

        <div className="test-expressions-buttons">
          {EXPRESSION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`test-expr-btn ${selectedExpression === key ? "active" : ""}`}
              onClick={() => handleExpression(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="test-expressions-morphs">
          <h2>Morph targets per expression</h2>
          {EXPRESSION_KEYS.map((key) => {
            const mapping = facialExpressions[key];
            const keys = mapping && typeof mapping === "object" ? Object.keys(mapping) : [];
            const isExpanded = expandedExpression === key;
            return (
              <div key={key} className="test-expr-morph-block">
                <button
                  type="button"
                  className="test-expr-morph-header"
                  onClick={() => setExpandedExpression(isExpanded ? null : key)}
                >
                  <span>{key}</span>
                  <span className="test-expr-morph-count">
                    {keys.length} morphs
                  </span>
                </button>
                {isExpanded && (
                  <pre className="test-expr-morph-list">
                    {keys.length
                      ? keys.join(", ")
                      : "(none — neutral face)"}
                  </pre>
                )}
              </div>
            );
          })}
        </div>

        <div className="test-expressions-index-map">
          <button
            type="button"
            className="test-expr-morph-header"
            onClick={() => setShowIndexMap((v) => !v)}
          >
            <span>Index → name map (reference only)</span>
            <span className="test-expr-morph-count">{ARKIT_BLEND_SHAPE_ORDER.length} blend shapes</span>
          </button>
          {showIndexMap && (
            <>
              <p className="test-expressions-index-note">Reference list—you don’t type these. The buttons above drive the face.</p>
              <pre className="test-expr-morph-list">
                {ARKIT_BLEND_SHAPE_ORDER.map((name, i) => `${i}: ${name}`).join("\n")}
              </pre>
            </>
          )}
        </div>

        <p className="test-expressions-note">
          When the GLB has no morph target names, the app maps index 0→{ARKIT_BLEND_SHAPE_ORDER[0]}, 1→{ARKIT_BLEND_SHAPE_ORDER[1]}, … so expressions work.
        </p>
      </aside>

      <style>{`
        .test-expressions-page {
          display: grid;
          grid-template-columns: 1fr 340px;
          min-height: 100vh;
          background: #0a0e1a;
        }
        .test-expressions-canvas-wrap {
          position: relative;
          min-height: 400px;
        }
        .test-expressions-panel {
          padding: 1.25rem;
          overflow-y: auto;
          border-left: 1px solid rgba(117, 194, 255, 0.25);
          background: rgba(4, 8, 22, 0.9);
          color: #e2e8f0;
          font-family: system-ui, sans-serif;
        }
        .test-expressions-panel h1 {
          margin: 0 0 0.5rem;
          font-size: 1.35rem;
          font-weight: 700;
        }
        .test-expressions-callout {
          margin: 0 0 0.35rem;
          padding: 0.5rem 0.65rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0a0e1a;
          background: rgba(61, 228, 255, 0.35);
          border-radius: 0.5rem;
          line-height: 1.4;
        }
        .test-expressions-hint {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.45;
        }
        .test-expressions-index-note {
          margin: 0.35rem 0 0.25rem;
          font-size: 0.8rem;
          color: #94a3b8;
          font-style: italic;
        }
        .test-expressions-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .test-expr-btn {
          padding: 0.5rem 0.85rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(117, 194, 255, 0.4);
          background: rgba(117, 194, 255, 0.1);
          color: #e2e8f0;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .test-expr-btn:hover {
          background: rgba(117, 194, 255, 0.2);
        }
        .test-expr-btn.active {
          background: rgba(61, 228, 255, 0.35);
          border-color: var(--cyan, #3de4ff);
        }
        .test-expressions-morphs h2 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .test-expr-morph-block {
          margin-bottom: 0.5rem;
        }
        .test-expr-morph-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.5rem;
          border: none;
          border-radius: 0.4rem;
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
          font-size: 0.85rem;
          cursor: pointer;
          text-align: left;
        }
        .test-expr-morph-header:hover {
          background: rgba(255,255,255,0.1);
        }
        .test-expr-morph-count {
          color: #94a3b8;
          font-size: 0.8rem;
        }
        .test-expr-morph-list {
          margin: 0.25rem 0 0 0.5rem;
          padding: 0.5rem;
          font-size: 0.75rem;
          color: #94a3b8;
          background: rgba(0,0,0,0.3);
          border-radius: 0.35rem;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .test-expressions-index-map {
          margin-top: 1rem;
        }
        .test-expressions-note {
          margin: 1rem 0 0;
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
        }
        .test-expressions-back {
          display: inline-block;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: rgba(117, 194, 255, 0.9);
          text-decoration: none;
        }
        .test-expressions-back:hover {
          text-decoration: underline;
        }
        @media (max-width: 700px) {
          .test-expressions-page {
            grid-template-columns: 1fr;
            grid-template-rows: 50vh auto;
          }
        }
      `}</style>
    </div>
  );
}
